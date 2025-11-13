// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {RaffleCore} from "../src/RaffleCore.sol";

/**
 * @title DeployScript
 * @notice Deployment script for RaffleCore contract
 * @dev Run with: forge script script/Deploy.s.sol:DeployScript --broadcast
 */
contract DeployScript {
    function run() external {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy RaffleCore
        RaffleCore raffleCore = new RaffleCore();

        // Stop broadcasting
        vm.stopBroadcast();

        // Log deployment info
        console.log("====================================");
        console.log("RaffleCore deployed to:", address(raffleCore));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("====================================");
        console.log("");
        console.log("Next steps:");
        console.log("1. Verify contract on Basescan:");
        console.log("   forge verify-contract", address(raffleCore));
        console.log("   --chain-id 84532");
        console.log("   --etherscan-api-key $BASESCAN_API_KEY");
        console.log("   src/RaffleCore.sol:RaffleCore");
        console.log("");
        console.log("2. Update frontend .env with:");
        console.log("   NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=", address(raffleCore));
    }
}

// Forge script helper functions
interface Vm {
    function envUint(string calldata key) external view returns (uint256);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function addr(uint256 privateKey) external view returns (address);
}

library console {
    function log(string memory message) internal pure {}
    function log(string memory message, address addr) internal pure {}
    function log(string memory message, string memory value) internal pure {}
}

// Global vm instance (provided by Foundry)
Vm constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
