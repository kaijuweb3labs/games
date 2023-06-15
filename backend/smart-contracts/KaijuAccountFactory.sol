// SPDX-License-Identifier: GPL-3.0
// author: kaiju3d.com

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "./KaijuAccount.sol";

/**
 * A sample factory contract for SimpleAccount
 * A UserOperations "initCode" holds the address of the factory, and a method call (to createAccount, in this sample factory).
 * The factory's createAccount returns the target account address even if it is already installed.
 * This way, the entryPoint.getSenderAddress() can be called either before or after the account is created.
 */
 
contract KaijuAccountFactory {
    KaijuAccount public immutable accountImplementation; // The Entry Point for a blockchain never changes.

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new KaijuAccount(_entryPoint);
    }

    /**
     * @dev create an account, and return its address. 
     * returns the address even if the account is already deployed.
     * Note that during UserOperation execution, this method is called only if the account is not deployed.
     * This method returns an existing account address so that entryPoint.getSenderAddress() would work even after account creation
     * @param owner Wallet address of the Wallet holder. 
     * @param salt Number of the account of that respective user. (By changing this one user can create multiple account contracts)
     */
    function createAccount(address owner,uint256 salt) public returns (KaijuAccount userAccount) {
        address userAddres = getAddress(owner, salt);
        uint codeSize = userAddres.code.length;
        if (codeSize > 0) {
            return KaijuAccount(payable(userAddres));
        }
        userAccount = KaijuAccount(payable(new ERC1967Proxy{salt : bytes32(salt)}(
                address(accountImplementation),
                abi.encodeCall(KaijuAccount.initialize, (owner))
            )));
    }

    /**
     * @dev This Returns the address of the account contract which belongs to the user. This is the address of the AA contract adress respect to a Wallet and salt
     * @param owner Wallet address of the Wallet holder. 
     * @param salt Number of the account of that respective user. (By changing this one user can create multiple account contracts)
     */
    function getAddress(address owner,uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(
                type(ERC1967Proxy).creationCode,
                abi.encode(
                    address(accountImplementation),
                    abi.encodeCall(KaijuAccount.initialize, (owner))
                )
            )));
    }
}
