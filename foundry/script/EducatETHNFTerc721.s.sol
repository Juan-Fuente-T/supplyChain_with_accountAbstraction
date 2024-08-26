// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "lib/forge-std/src/Script.sol";
import {console} from "lib/forge-std/src/console.sol";
import {EducatETHNFT} from "src/EducatETHNFTerc721.sol";

contract EducatETHNFTDeploy is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        address owner = vm.envAddress("OWNER");
        EducatETHNFT educatethnft = new EducatETHNFT(owner);
        console.log("Contract deployed to %s", address(educatethnft));
        vm.stopBroadcast();
        emit Deployed(address(educatethnft));
    }

    event Deployed(address contractAddress);
}
