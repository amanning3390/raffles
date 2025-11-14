// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRaffle} from "./interfaces/IRaffle.sol";
import {IERC20, IERC721} from "./interfaces/IERC20.sol";

/**
 * @title RaffleCore
 * @notice Non-custodial raffle contract for ETH, ERC20, and ERC721 assets
 * @dev Fully decentralized with no admin controls over user funds
 * @dev Supports ANY ERC-20 token and ANY ERC-721 NFT on Base chain
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

    /// @notice Mapping of raffle ID to actual winner count (may be less than requested)
    mapping(uint256 => uint256) public actualWinnerCount;

    /// @notice Mapping of raffle ID to whether entry fees have been distributed
    mapping(uint256 => bool) public entryFeesDistributed;

    /// @notice Platform fee (0.5% = 50 basis points)
    uint256 public constant PLATFORM_FEE_BPS = 50;
    uint256 public constant BPS_DENOMINATOR = 10000;

    /// @notice Accumulated platform fees
    uint256 public accumulatedFees;

    /// @notice Platform fee recipient (can be updated to DAO/multisig)
    address public platformFeeRecipient;

    /// @notice Events
    event PlatformFeeRecipientUpdated(address indexed newRecipient);

    /**
     * @notice Constructor - sets deployer as initial platform fee recipient
     */
    constructor() {
        platformFeeRecipient = msg.sender;
    }

    /**
     * @notice Create a new raffle for any asset type
     * @param config Raffle configuration
     * @return raffleId The ID of the created raffle
     * @dev Supports ETH, any ERC-20 token, and any ERC-721 NFT
     */
    function createRaffle(RaffleConfig calldata config)
        external
        payable
        returns (uint256)
    {
        // Validate configuration
        if (config.endTime <= config.startTime) revert InvalidTimeRange();
        if (config.startTime < block.timestamp) revert InvalidTimeRange();
        if (config.winnerCount == 0 || config.winnerCount > config.maxEntries) {
            revert InvalidAssetAmount();
        }
        if (config.entryFee == 0) revert InvalidEntryFee();
        
        // For NFT raffles, winnerCount must be 1 (can't split NFTs)
        if (config.assetType == AssetType.ERC721 && config.winnerCount != 1) {
            revert InvalidAssetAmount();
        }

        uint256 raffleId = _raffleIdCounter++;

        // Handle asset deposit based on type
        if (config.assetType == AssetType.ETH) {
            // ETH raffle - require exact amount sent
            if (msg.value != config.assetAmount) revert InvalidAssetAmount();

        } else if (config.assetType == AssetType.ERC20) {
            // ERC-20 token raffle - transfer from creator to contract
            if (config.assetContract == address(0)) revert InvalidAssetAmount();
            if (config.assetAmount == 0) revert InvalidAssetAmount();

            IERC20 token = IERC20(config.assetContract);

            // Transfer tokens from creator to contract (requires prior approval)
            bool success = token.transferFrom(msg.sender, address(this), config.assetAmount);
            require(success, "Token transfer failed");

        } else if (config.assetType == AssetType.ERC721) {
            // ERC-721 NFT raffle - transfer NFT from creator to contract
            if (config.assetContract == address(0)) revert InvalidAssetAmount();

            IERC721 nft = IERC721(config.assetContract);

            // Transfer NFT to contract (requires prior approval)
            nft.safeTransferFrom(msg.sender, address(this), config.assetTokenId);
        }

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
            uint256 winnersToSelect = raffle.winnerCount > participantCount
                ? participantCount
                : raffle.winnerCount;
            
            // Store actual winner count for prize calculation
            actualWinnerCount[raffleId] = winnersToSelect;

            // Simple random winner selection using blockhash
            // NOTE: For production with high value, use Chainlink VRF
            uint256 randomSeed = uint256(
                keccak256(abi.encodePacked(block.timestamp, block.prevrandao, raffleId))
            );

            // Use Fisher-Yates shuffle algorithm to ensure unique winners
            address[] memory participantPool = new address[](participantCount);
            for (uint256 i = 0; i < participantCount; i++) {
                participantPool[i] = participants[raffleId][i];
            }

            // Shuffle and select unique winners
            for (uint256 i = 0; i < winnersToSelect; i++) {
                uint256 j = (uint256(keccak256(abi.encodePacked(randomSeed, i))) % (participantCount - i)) + i;
                
                // Swap
                address temp = participantPool[i];
                participantPool[i] = participantPool[j];
                participantPool[j] = temp;
                
                winners[raffleId].push(participantPool[i]);
            }

            // Distribute entry fees to creator (minus platform fee)
            uint256 totalFees = totalEntries[raffleId] * raffle.entryFee;
            uint256 platformFee = (totalFees * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
            uint256 creatorFee = totalFees - platformFee;

            accumulatedFees += platformFee;
            entryFeesDistributed[raffleId] = true;

            (bool successFee, ) = payable(raffle.creator).call{value: creatorFee}("");
            require(successFee, "Fee transfer failed");

            emit RaffleEnded(raffleId, winners[raffleId]);
        } else {
            // No entries - refund creator
            actualWinnerCount[raffleId] = 0;
            
            // Refund creator based on asset type
            if (raffle.assetType == AssetType.ETH) {
                (bool success, ) = payable(raffle.creator).call{value: raffle.assetAmount}("");
                require(success, "ETH refund failed");
            } else if (raffle.assetType == AssetType.ERC20) {
                IERC20 token = IERC20(raffle.assetContract);
                bool success = token.transfer(raffle.creator, raffle.assetAmount);
                require(success, "Token refund failed");
            } else if (raffle.assetType == AssetType.ERC721) {
                IERC721 nft = IERC721(raffle.assetContract);
                nft.safeTransferFrom(address(this), raffle.creator, raffle.assetTokenId);
            }
            
            emit RaffleEnded(raffleId, new address[](0));
        }
    }

    /**
     * @notice Claim prize as winner
     * @param raffleId The raffle to claim from
     * @dev Transfers ETH, ERC-20 tokens, or ERC-721 NFTs based on asset type
     */
    function claimPrize(uint256 raffleId) external {
        RaffleConfig storage raffle = raffles[raffleId];

        // Validate claim
        if (raffle.status != RaffleStatus.Ended) revert RaffleNotEnded();
        if (prizeClaimed[raffleId][msg.sender]) revert PrizeAlreadyClaimed();

        // Check if caller is a winner
        address[] memory raffleWinners = winners[raffleId];
        bool isWinner = false;
        uint256 winnerIndex = 0;
        for (uint256 i = 0; i < raffleWinners.length; i++) {
            if (raffleWinners[i] == msg.sender) {
                isWinner = true;
                winnerIndex = i;
                break;
            }
        }
        if (!isWinner) revert NotWinner();

        // Mark as claimed
        prizeClaimed[raffleId][msg.sender] = true;

        // Get actual winner count (may be less than requested if not enough participants)
        uint256 winnersCount = actualWinnerCount[raffleId];
        require(winnersCount > 0, "No winners selected");

        // Transfer prize based on asset type
        if (raffle.assetType == AssetType.ETH) {
            // ETH prize - split among actual winners
            // Handle remainder by giving it to first winner
            uint256 basePrize = raffle.assetAmount / winnersCount;
            uint256 remainder = raffle.assetAmount % winnersCount;
            uint256 prizeAmount = basePrize + (winnerIndex == 0 ? remainder : 0);
            
            require(prizeAmount > 0, "Prize amount too small");
            (bool success, ) = payable(msg.sender).call{value: prizeAmount}("");
            require(success, "ETH transfer failed");

        } else if (raffle.assetType == AssetType.ERC20) {
            // ERC-20 token prize - split among actual winners
            // Handle remainder by giving it to first winner
            uint256 basePrize = raffle.assetAmount / winnersCount;
            uint256 remainder = raffle.assetAmount % winnersCount;
            uint256 prizeAmount = basePrize + (winnerIndex == 0 ? remainder : 0);
            
            require(prizeAmount > 0, "Prize amount too small");
            IERC20 token = IERC20(raffle.assetContract);
            bool success = token.transfer(msg.sender, prizeAmount);
            require(success, "Token transfer failed");

        } else if (raffle.assetType == AssetType.ERC721) {
            // ERC-721 NFT prize - only first winner gets NFT
            // winnerCount is validated to be 1 in createRaffle, so winnerIndex should always be 0
            require(winnerIndex == 0, "Only first winner gets NFT");
            IERC721 nft = IERC721(raffle.assetContract);
            nft.safeTransferFrom(address(this), msg.sender, raffle.assetTokenId);
        }

        emit PrizeClaimed(raffleId, msg.sender);
    }

    /**
     * @notice Cancel raffle (only creator, only if no entries)
     * @param raffleId The raffle to cancel
     * @dev Refunds the prize asset to creator
     */
    function cancelRaffle(uint256 raffleId) external {
        RaffleConfig storage raffle = raffles[raffleId];

        if (msg.sender != raffle.creator) revert NotRaffleCreator();
        if (raffle.status != RaffleStatus.Active) revert RaffleNotActive();
        if (totalEntries[raffleId] > 0) revert RaffleNotActive(); // Can't cancel with entries

        raffle.status = RaffleStatus.Cancelled;

        // Refund creator based on asset type
        if (raffle.assetType == AssetType.ETH) {
            (bool success, ) = payable(raffle.creator).call{value: raffle.assetAmount}("");
            require(success, "ETH refund failed");

        } else if (raffle.assetType == AssetType.ERC20) {
            IERC20 token = IERC20(raffle.assetContract);
            bool success = token.transfer(raffle.creator, raffle.assetAmount);
            require(success, "Token refund failed");

        } else if (raffle.assetType == AssetType.ERC721) {
            IERC721 nft = IERC721(raffle.assetContract);
            nft.safeTransferFrom(address(this), raffle.creator, raffle.assetTokenId);
        }

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
     * @notice Withdraw accumulated platform fees (platform fee recipient only)
     * @dev Only the platform fee recipient can withdraw fees
     */
    function withdrawPlatformFees() external {
        require(msg.sender == platformFeeRecipient, "Not authorized");
        require(platformFeeRecipient != address(0), "No recipient set");
        
        uint256 amount = accumulatedFees;
        require(amount > 0, "No fees to withdraw");
        accumulatedFees = 0;

        (bool success, ) = payable(platformFeeRecipient).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Update platform fee recipient (current recipient only)
     * @param newRecipient New platform fee recipient address
     * @dev Can be updated to DAO or multisig address
     */
    function updatePlatformFeeRecipient(address newRecipient) external {
        require(msg.sender == platformFeeRecipient, "Not authorized");
        require(newRecipient != address(0), "Invalid address");
        platformFeeRecipient = newRecipient;
        emit PlatformFeeRecipientUpdated(newRecipient);
    }

    /**
     * @notice ERC-721 receiver to accept NFT transfers
     * @dev Required for safeTransferFrom to work
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
