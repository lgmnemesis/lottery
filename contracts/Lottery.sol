// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Lottery {
    address public manager;
    address[] public players;
    mapping(address => bool) public pl;

    modifier onlyManagers() {
        require(msg.sender == manager, "nop");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function enter() external payable {
        require(pl[msg.sender] == false, "Player is already entered");
        require(
            msg.value > 0.01 ether,
            "Can not enter lottery without supplying some ether"
        );
        pl[msg.sender] = true;
        players.push(msg.sender);
    }

    function pickWinner() external onlyManagers {
        uint256 index = _random() % players.length;
        address player = players[index];
        players = new address[](0);
        payable(player).transfer(address(this).balance);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function _random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }
}
