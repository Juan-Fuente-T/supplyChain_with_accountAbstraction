// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;
// foundry\lib\forge-std\src\Script.sol
import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import { SupplyChainToken } from "../src/SupplyChainToken1155.sol";

contract SupplyChainTokenScript is Script {
    function run() public {
        vm.startBroadcast();

        address owner = vm.envAddress("OWNER");

        // EducatETH educatETH = new EducatETH(owner);
        // console.log("EducatETH contract deployed at: ", address(educatETH));
        SupplyChainToken supplyChainToken = new SupplyChainToken(owner);
        console.log("SupplyChainToken contract deployed at: ", address(supplyChainToken));

        vm.stopBroadcast();
    }
}
