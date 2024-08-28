// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SupplyChainToken} from "../src/ERC1155.sol";

contract EducatETHNFTTest is Test {
    SupplyChainToken public supplyToken;
    address alice;
    address bob;

    event Transfer(
        address indexed from, address indexed to, uint256 indexed tokenId
    );

    function setUp() public {
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        // address initialOwner = vm.addr(1);
        supplyToken = new SupplyChainToken(alice);
        startHoax(alice, 100);
    }

    function testName() public view {
        assertEq(supplyToken.name(), "EducateETH NFT");
    }

    function testSimbol() public view {
        assertEq(supplyToken.symbol(), "EEN");
    }

    function testMint() public {
        vm.expectEmit();

        emit Transfer(address(0), alice, 0);
        supplyToken.mint(alice, 1, 1, "");
        // assertEq(supplyToken.ownerOf(0), alice);
    }

    function testMintFail() public {
        // vm.expectRevert(abi.encodeWithSignature("ERC721InvalidReceiver(address(0))"));
        vm.expectRevert();
        supplyToken.mint(address(0), 1, 1, "");
        vm.startPrank(bob);
        // vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(bob)"));
        vm.expectRevert();
        supplyToken.mint(alice, 1, 1, "");
    }

    function testTransfer() public {
        supplyToken.mint(alice, 1, 1, "");
        // assertEq(supplyToken.ownerOf(0), alice);
        // supplyToken.transferFrom(alice, bob, 0);
        // assertEq(supplyToken.ownerOf(0), bob);
    }

    // function testTransferFail() public {
    //     supplyToken.safeMint(alice);
    //     assertEq(supplyToken.ownerOf(0), alice);
    //     vm.expectRevert();
    //     // vm.expectRevert(abi.encodeWithSignature("ERC721InvalidReceiver(0x0000000000000000000000000000000000000000"));
    //     supplyToken.transferFrom(alice, address(0), 0);
    //     vm.startPrank(bob);
    //     vm.expectRevert();
    //     // vm.expectRevert(abi.encodeWithSignature("ERC721InsufficientApproval(bob, 0)"));
    //     supplyToken.transferFrom(alice, bob, 0);
    //     assertEq(supplyToken.ownerOf(0), alice);
    // }

    function testBalance() public {
        supplyToken.mint(alice, 1, 1, "");
        // assertEq(supplyToken.balanceOf(alice), 1);
        // supplyToken.transferFrom(alice, bob, 0);
        // assertEq(supplyToken.balanceOf(alice), 0);
        // assertEq(supplyToken.balanceOf(bob), 1);
    }

    // function testApprove() public {
    //     supplyToken.mint(alice, 1, 1);
    //     supplyToken.approve(bob, 0);
    //     assertEq(supplyToken.getApproved(0), bob);
    // }

    // function testApproveFail() public {
    //     supplyToken.safeMint(alice);
    //     // vm.expectRevert();
    //     supplyToken.approve(address(0), 0);
    //     assertEq(supplyToken.getApproved(0), address(0));
    //     vm.startPrank(bob);
    //     vm.expectRevert();
    //     supplyToken.approve(bob, 0);
    //     assertEq(supplyToken.getApproved(0), address(0));
    // }

    // function testApprovalForAll() public {
    //     supplyToken.safeMint(alice);
    //     supplyToken.safeMint(alice);
    //     supplyToken.safeMint(alice);
    //     supplyToken.setApprovalForAll(bob, true);
    //     assertTrue(supplyToken.isApprovedForAll(alice, bob));
    // }

    // function testApprovalForAllFail() public {
    //     supplyToken.safeMint(alice);
    //     supplyToken.safeMint(alice);
    //     supplyToken.safeMint(alice);
    //     vm.expectRevert();
    //     supplyToken.setApprovalForAll(address(0), true);
    //     assertEq(supplyToken.isApprovedForAll(alice, address(0)), false);
    // }
}
