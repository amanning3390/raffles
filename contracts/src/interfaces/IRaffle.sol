// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IRaffle
 * @notice Interface for raffle contracts
 * @dev Defines the core raffle functionality
 */
interface IRaffle {
    /// @notice Raffle status enum
    enum RaffleStatus {
        Active,
        Ended,
        Cancelled
    }

    /// @notice Raffle asset types
    enum AssetType {
        ETH,
        ERC20,
        ERC721
    }

    /// @notice Raffle configuration struct
    struct RaffleConfig {
        address creator;
        AssetType assetType;
        address assetContract;
        uint256 assetTokenId;
        uint256 assetAmount;
        uint256 entryFee;
        uint256 maxEntries;
        uint256 maxEntriesPerWallet;
        uint256 startTime;
        uint256 endTime;
        uint256 winnerCount;
        RaffleStatus status;
    }

    /// @notice Events
    event RaffleCreated(
        uint256 indexed raffleId,
        address indexed creator,
        AssetType assetType,
        uint256 entryFee
    );
    event RaffleEntered(uint256 indexed raffleId, address indexed participant, uint256 entries);
    event RaffleEnded(uint256 indexed raffleId, address[] winners);
    event RaffleCancelled(uint256 indexed raffleId);
    event PrizeClaimed(uint256 indexed raffleId, address indexed winner);

    /// @notice Errors
    error RaffleNotActive();
    error RaffleNotEnded();
    error RaffleAlreadyEnded();
    error InvalidEntryFee();
    error MaxEntriesReached();
    error MaxEntriesPerWalletReached();
    error NotRaffleCreator();
    error NotWinner();
    error PrizeAlreadyClaimed();
    error InvalidTimeRange();
    error InvalidAssetAmount();

    /// @notice Create a new raffle
    function createRaffle(RaffleConfig calldata config) external payable returns (uint256);

    /// @notice Enter a raffle
    function enterRaffle(uint256 raffleId, uint256 entries) external payable;

    /// @notice End raffle and select winners
    function endRaffle(uint256 raffleId) external;

    /// @notice Claim prize as winner
    function claimPrize(uint256 raffleId) external;

    /// @notice Cancel raffle (only creator, before entries)
    function cancelRaffle(uint256 raffleId) external;

    /// @notice Get raffle details
    function getRaffle(uint256 raffleId) external view returns (RaffleConfig memory);

    /// @notice Get raffle participants
    function getParticipants(uint256 raffleId) external view returns (address[] memory);

    /// @notice Get raffle winners
    function getWinners(uint256 raffleId) external view returns (address[] memory);
}
