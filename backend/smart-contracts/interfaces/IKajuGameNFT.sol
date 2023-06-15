// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IKaijuGameNFT is IERC721 {
    function safeMint(address to, string memory uri) external;
}
