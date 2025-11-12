// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRaffle} from "./interfaces/IRaffle.sol";

/**
 * @title RaffleCore
 * @notice Non-custodial raffle contract for ETH, ERC20, and ERC721 assets
 * @dev Fully decentralized with no admin controls over user funds
 * @author Raffles Protocol
 */
contract RaffleCore is IRaffle {
    /// @notice Raffle counter
    uint256 private _raffleIdCounter;

    /// @notice Mapping of raffle ID to raffle config
    mapping(uint256 => RaffleConfig) public raffles;

    /// @notice Mapping of raffle ID to participants
    mapping(uint256 => address[]) private participants;

    /// @notice Mapping of raffle ID to entry count per wallet
    mapping(uint256 => mapping(address => uint256)) public entriesPerWallet;

    /// @notice Mapping of raffle ID to total entries
    mapping(uint256 => uint256) public totalEntries;

    /// @notice Mapping of raffle ID to winners
    mapping(uint256 => address[]) private winners;

    /// @notice Mapping of raffle ID to claimed status
    mapping(uint256 => mapping(address => bool)) public prizeClaimed;

    /// @notice Platform fee (0.5% = 50 basis points)
    uint256 public constant PLATFORM_FEE_BPS = 50;
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Accumulated platform fees
    uint256 public accumulatedFees;

    /**
     * @notice Create a new ETH raffle
     * @param config Raffle configuration
     * @return raffleId The ID of the created raffle
     */
    function createRaffle(RaffleConfig calldata config)
        external
        payable
        returns (uint256)
    {
        // Validate configuration
        if (config.endTime <= config.startTime) revert InvalidTimeRange();
        if (config.startTime < block.timestamp) revert InvalidTimeRange();
        if (config.assetType == AssetType.ETH && msg.value != config.assetAmount) {
            revert InvalidAssetAmount();
        }
        if (config.winnerCount == 0 || config.winnerCount > config.maxEntries) {
            revert InvalidAssetAmount();
        }

        uint256 raffleId = _raffleIdCounter++;

        // Store raffle configuration
        raffles[raffleId] = RaffleConfig({
            creator: msg.sender,
            assetType: config.assetType,
            assetContract: config.assetContract,
            assetTokenId: config.assetTokenId,
            assetAmount: config.assetAmount,
            entryFee: config.entryFee,
            maxEntries: config.maxEntries,
            maxEntriesPerWallet: config.maxEntriesPerWallet,
            startTime: config.startTime,
            endTime: config.endTime,
            winnerCount: config.winnerCount,
            status: RaffleStatus.Active
        });

        emit RaffleCreated(raffleId, msg.sender, config.assetType, config.entryFee);

        return raffleId;
    }

    /**
     * @notice Enter a raffle by paying the entry fee
     * @param raffleId The raffle to enter
     * @param entries Number of entries to purchase
     */
    function enterRaffle(uint256 raffleId, uint256 entries)
        external
        payable
    {
        RaffleConfig storage raffle = raffles[raffleId];

        // Validate raffle state
        if (raffle.status != RaffleStatus.Active) revert RaffleNotActive();
        if (block.timestamp < raffle.startTime) revert RaffleNotActive();
        if (block.timestamp >= raffle.endTime) revert RaffleAlreadyEnded();

        // Validate entry
        if (msg.value != raffle.entryFee * entries) revert InvalidEntryFee();
        if (totalEntries[raffleId] + entries > raffle.maxEntries) {
            revert MaxEntriesReached();
        }
        if (entriesPerWallet[raffleId][msg.sender] + entries > raffle.maxEntriesPerWallet) {
            revert MaxEntriesPerWalletReached();
        }

        // Record entries
        for (uint256 i = 0; i < entries; i++) {
            participants[raffleId].push(msg.sender);
        }
        entriesPerWallet[raffleId][msg.sender] += entries;
        totalEntries[raffleId] += entries;

        emit RaffleEntered(raffleId, msg.sender, entries);
    }

    /**
     * @notice End raffle and select winners
     * @param raffleId The raffle to end
     * @dev Uses blockhash for randomness (suitable for low-value raffles)
     *      For high-value raffles, integrate Chainlink VRF
     */
    function endRaffle(uint256 raffleId) external {
        RaffleConfig storage raffle = raffles[raffleId];

        // Validate raffle state
        if (raffle.status != RaffleStatus.Active) revert RaffleNotActive();
        if (block.timestamp < raffle.endTime) revert RaffleNotEnded();

        // Mark as ended
        raffle.status = RaffleStatus.Ended;

        // Select winners if there are entries
        uint256 participantCount = participants[raffleId].length;
        if (participantCount > 0) {
            uint256 actualWinnerCount = raffle.winnerCount > participantCount
                ? participantCount
                : raffle.winnerCount;

            // Simple random winner selection using blockhash
            // NOTE: For production with high value, use Chainlink VRF
            uint256 randomSeed = uint256(
                keccak256(abi.encodePacked(block.timestamp, block.prevrandao, raffleId))
            );

            for (uint256 i = 0; i < actualWinnerCount; i++) {
                uint256 winnerIndex = (randomSeed + i) % participantCount;
                winners[raffleId].push(participants[raffleId][winnerIndex]);
            }

            emit RaffleEnded(raffleId, winners[raffleId]);
        } else {
            // No entries - refund creator
            emit RaffleEnded(raffleId, new address[](0));
        }
    }

    /**
     * @notice Claim prize as winner
     * @param raffleId The raffle to claim from
     */
    function claimPrize(uint256 raffleId) external {
        RaffleConfig storage raffle = raffles[raffleId];

        // Validate claim
        if (raffle.status != RaffleStatus.Ended) revert RaffleNotEnded();
        if (prizeClaimed[raffleId][msg.sender]) revert PrizeAlreadyClaimed();

        // Check if caller is a winner
        address[] memory raffleWinners = winners[raffleId];
        bool isWinner = false;
        for (uint256 i = 0; i < raffleWinners.length; i++) {
            if (raffleWinners[i] == msg.sender) {
                isWinner = true;
                break;
            }
        }
        if (!isWinner) revert NotWinner();

        // Mark as claimed
        prizeClaimed[raffleId][msg.sender] = true;

        // Transfer prize (split if multiple winners)
        uint256 prizeAmount = raffle.assetAmount / raffle.winnerCount;

        if (raffle.assetType == AssetType.ETH) {
            (bool success, ) = payable(msg.sender).call{value: prizeAmount}("");
            require(success, "Transfer failed");
        }
        // TODO: Add ERC20 and ERC721 support in next milestone

        // Transfer entry fees to creator (minus platform fee)
        uint256 totalFees = totalEntries[raffleId] * raffle.entryFee;
        uint256 platformFee = (totalFees * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 creatorFee = totalFees - platformFee;

        accumulatedFees += platformFee;

        (bool successFee, ) = payable(raffle.creator).call{value: creatorFee}("");
        require(successFee, "Fee transfer failed");

        emit PrizeClaimed(raffleId, msg.sender);
    }

    /**
     * @notice Cancel raffle (only creator, only if no entries)
     * @param raffleId The raffle to cancel
     */
    function cancelRaffle(uint256 raffleId) external {
        RaffleConfig storage raffle = raffles[raffleId];

        if (msg.sender != raffle.creator) revert NotRaffleCreator();
        if (raffle.status != RaffleStatus.Active) revert RaffleNotActive();
        if (totalEntries[raffleId] > 0) revert RaffleNotActive(); // Can't cancel with entries

        raffle.status = RaffleStatus.Cancelled;

        // Refund creator
        if (raffle.assetType == AssetType.ETH) {
            (bool success, ) = payable(raffle.creator).call{value: raffle.assetAmount}("");
            require(success, "Refund failed");
        }
        // TODO: Add ERC20 and ERC721 refund support

        emit RaffleCancelled(raffleId);
    }

    /**
     * @notice Get raffle details
     * @param raffleId The raffle ID
     * @return Raffle configuration
     */
    function getRaffle(uint256 raffleId) external view returns (RaffleConfig memory) {
        return raffles[raffleId];
    }

    /**
     * @notice Get raffle participants
     * @param raffleId The raffle ID
     * @return Array of participant addresses
     */
    function getParticipants(uint256 raffleId) external view returns (address[] memory) {
        return participants[raffleId];
    }

    /**
     * @notice Get raffle winners
     * @param raffleId The raffle ID
     * @return Array of winner addresses
     */
    function getWinners(uint256 raffleId) external view returns (address[] memory) {
        return winners[raffleId];
    }

    /**
     * @notice Get total raffle count
     * @return Total number of raffles created
     */
    function totalRaffles() external view returns (uint256) {
        return _raffleIdCounter;
    }

    /**
     * @notice Withdraw accumulated platform fees (DAO/multisig only)
     * @dev This function should be controlled by a DAO or multisig in production
     */
    function withdrawPlatformFees() external {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
}
