// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "lib/forge-std/src/Script.sol";
import {console} from "lib/forge-std/src/console.sol";
import {EducatETHerc1155} from "../src/EducatETHerc1155.sol";

contract EducatETHerc1155Deploy is Script {
    function run() public {
        vm.startBroadcast();

        address owner = vm.envAddress("OWNER");

        EducatETHerc1155 educatETH = new EducatETHerc1155(owner);
        console.log("EducatETHerc1155 contract deployed at: ", address(educatETH));

        vm.stopBroadcast();
    }
}
// cd mnt/c/Users/Juan/Desktop/Mis_proyectos/Solidity/EducatETH_NFT