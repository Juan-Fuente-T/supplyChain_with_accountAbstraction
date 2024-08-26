// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {EducatETHNFT} from "src/EducatETHNFTerc721.sol";

contract EducatETHNFTTest is Test {
    EducatETHNFT public educateth;
    address alice;
    address bob;

    event Transfer(
        address indexed from, address indexed to, uint256 indexed tokenId
    );

    function setUp() public {
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        // address initialOwner = vm.addr(1);
        educateth = new EducatETHNFT(alice);
        startHoax(alice, 100);
    }

    function testName() public view {
        assertEq(educateth.name(), "EducateETH NFT");
    }

    function testSimbol() public view {
        assertEq(educateth.symbol(), "EEN");
    }

    function testMint() public {
        vm.expectEmit();

        emit Transfer(address(0), alice, 0);
        educateth.safeMint(alice);
        assertEq(educateth.ownerOf(0), alice);
    }

    function testMintFail() public {
        // vm.expectRevert(abi.encodeWithSignature("ERC721InvalidReceiver(address(0))"));
        vm.expectRevert();
        educateth.safeMint(address(0));
        vm.startPrank(bob);
        // vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(bob)"));
        vm.expectRevert();
        educateth.safeMint(alice);
    }

    function testTransfer() public {
        educateth.safeMint(alice);
        assertEq(educateth.ownerOf(0), alice);
        educateth.transferFrom(alice, bob, 0);
        assertEq(educateth.ownerOf(0), bob);
    }

    function testTransferFail() public {
        educateth.safeMint(alice);
        assertEq(educateth.ownerOf(0), alice);
        vm.expectRevert();
        // vm.expectRevert(abi.encodeWithSignature("ERC721InvalidReceiver(0x0000000000000000000000000000000000000000"));
        educateth.transferFrom(alice, address(0), 0);
        vm.startPrank(bob);
        vm.expectRevert();
        // vm.expectRevert(abi.encodeWithSignature("ERC721InsufficientApproval(bob, 0)"));
        educateth.transferFrom(alice, bob, 0);
        assertEq(educateth.ownerOf(0), alice);
    }

    function testBalance() public {
        educateth.safeMint(alice);
        assertEq(educateth.balanceOf(alice), 1);
        educateth.transferFrom(alice, bob, 0);
        assertEq(educateth.balanceOf(alice), 0);
        assertEq(educateth.balanceOf(bob), 1);
    }

    function testApprove() public {
        educateth.safeMint(alice);
        educateth.approve(bob, 0);
        assertEq(educateth.getApproved(0), bob);
    }

    function testApproveFail() public {
        educateth.safeMint(alice);
        // vm.expectRevert();
        educateth.approve(address(0), 0);
        assertEq(educateth.getApproved(0), address(0));
        vm.startPrank(bob);
        vm.expectRevert();
        educateth.approve(bob, 0);
        assertEq(educateth.getApproved(0), address(0));
    }

    function testApprovalForAll() public {
        educateth.safeMint(alice);
        educateth.safeMint(alice);
        educateth.safeMint(alice);
        educateth.setApprovalForAll(bob, true);
        assertTrue(educateth.isApprovedForAll(alice, bob));
    }

    function testApprovalForAllFail() public {
        educateth.safeMint(alice);
        educateth.safeMint(alice);
        educateth.safeMint(alice);
        vm.expectRevert();
        educateth.setApprovalForAll(address(0), true);
        assertEq(educateth.isApprovedForAll(alice, address(0)), false);
    }
}
