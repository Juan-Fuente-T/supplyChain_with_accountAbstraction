// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "lib/forge-std/src/Script.sol";
import {console} from "lib/forge-std/src/console.sol";
import {EducatETH} from "../src/EducatETH.sol";

contract EducatETHDeploy is Script {
    function run() public {
        vm.startBroadcast();

        address owner = vm.envAddress("OWNER");

        EducatETH educatETH = new EducatETH(owner);
        console.log("EducatETH contract deployed at: ", address(educatETH));

        vm.stopBroadcast();
    }
}
