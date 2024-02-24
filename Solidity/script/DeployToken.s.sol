// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "../lib/forge-std/src/Script.sol";
import {Token} from "../src/Token.sol";
contract DeployToken is Script{
uint256 public constant INTITIAL_SUPPLY = 100 ether;

function run() external {
    vm.startBroadcast();
    new Token(INTITIAL_SUPPLY);
    vm.stopBroadcast();
}


}