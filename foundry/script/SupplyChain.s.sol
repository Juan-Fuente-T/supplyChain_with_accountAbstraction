// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { SupplyChain } from "../src/SupplyChainModSigner.sol";

contract SupplyChainScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        SupplyChain supplyChain = new SupplyChain();
        // console.log("Contract deployed to %s", address(educatethnft));
        console.log("SupplyChain contract deployed at: ", address(supplyChain));
        
        vm.stopBroadcast();
        // emit Deployed(address(educatethnft));
    }

    event Deployed(address contractAddress);
}
