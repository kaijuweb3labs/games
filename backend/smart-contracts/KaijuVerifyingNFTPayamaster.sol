// SPDX-License-Identifier: GPL-3.0
// author: kaiju3d.com

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./core/BasePaymaster.sol";
import "./interfaces/IKajuGameNFT.sol";

/**
 * A sample paymaster that uses external service to decide whether to pay for the UserOp.
 * The paymaster trusts an external signer to sign the transaction.
 * The calling user must pass the UserOp to that external signer first, which performs
 * whatever off-chain verification before signing the UserOp.
 * Note that this signature is NOT a replacement for the account-specific signature:
 *  - the paymaster checks a signature to agree to PAY for GAS.
 *  - the account checks a signature to prove identity and account ownership.
 *
 * Contract Dependencies:
 *  - Contract is Build on the AA model 9b5f2e4bb3 Commit (09th April 2023)
 */

contract KaijuVerifyingNFTPaymaster is BasePaymaster {

    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    address public immutable verifyingSigner;
    address public immutable kaijuAccountFactory;

    uint256 private constant TOKEN_URI_OFFSET = 20;
    uint256 private constant NFT_ADDRESS_OFFSET = 148;
    uint256 private constant VALID_TIME_OFFSET = 168;
    uint256 private constant SIGNATURE_OFFSET = 232;

    mapping(address => uint256) public senderNonce;

    constructor(address accountFactory, IEntryPoint _entryPoint, address _verifyingSigner ) BasePaymaster(_entryPoint) {
        kaijuAccountFactory = accountFactory;
        verifyingSigner = _verifyingSigner;
    }

    
     /**
     * @dev  Copy directly the userOp from calldata up to (but not including) the paymasterAndData. This encoding depends on the ABI encoding of calldata, but is much lighter to copy than referencing each field separately.
     * @param userOp | User Operation
     */
    function pack(UserOperation calldata userOp) internal pure returns (bytes memory ret) {

        bytes calldata pnd = userOp.paymasterAndData;
        assembly {
            let ofs := userOp
            let len := sub(sub(pnd.offset, ofs), 32)
            ret := mload(0x40)
            mstore(0x40, add(ret, add(len, 32)))
            mstore(ret, len)
            calldatacopy(add(ret, 32), ofs, len)
        }
    }

    /**
     * @dev The hash we're going to sign off-chain (and validate on-chain). Method is called by 
     *      Off-chain Service - to sign the request.
     *      On-chain Service - from the validatePaymasterUserOp, to validate the signature.
     * @param userOp | User Operation
     * @param tokenUri | Metadata URI of the NFT
     * @param nftAddress | Contract Address of the NFT
     * @param validUntil | Validate Period
     * @param validAfter | Validate Period
     * 
     * Note:    that this signature covers all fields of the UserOperation, except the "paymasterAndData",
     *          which will carry the signature itself.
     */
    function getHash(UserOperation calldata userOp, string memory tokenUri, address nftAddress, uint48 validUntil, uint48 validAfter
    ) public view returns (bytes32) {

        //can't use userOp.hash(), since it contains also the paymasterAndData itself.

        return
            keccak256(abi.encode(
                pack(userOp),
                block.chainid,
                address(this),
                senderNonce[userOp.getSender()],
                tokenUri,
                nftAddress,
                validUntil,
                validAfter
                )
            );
    }
    
    /**
     * @dev Decode the Paymaster data
     * @param paymasterAndData | The Data came from the User Operation
     * @return tokenUri | URL of the metadata of the NFT
     * @return nftAddress | Contract Address of the NFT
     * @return validUntil | Valid Period 
     * @return validAfter | Valid Period
     * @return signature | Digital Signature which signed by the Paymaster provider
     */
    function parsePaymasterAndData(bytes calldata paymasterAndData) public pure returns (
            string memory tokenUri,
            address nftAddress,
            uint48 validUntil,
            uint48 validAfter,
            bytes calldata signature
        )
    {

        signature = paymasterAndData[SIGNATURE_OFFSET:];

        require(signature.length == 64 || signature.length == 65, "VerifyingPaymaster: invalid signature length in paymasterAndData");

        (tokenUri) = abi.decode(
            paymasterAndData[TOKEN_URI_OFFSET:NFT_ADDRESS_OFFSET],
            (string)
        );

        bytes memory nftAddressBytes = paymasterAndData[NFT_ADDRESS_OFFSET:VALID_TIME_OFFSET];
        assembly {
            nftAddress := mload(add(nftAddressBytes, 20))
        }

        (validUntil, validAfter) = abi.decode(
            paymasterAndData[VALID_TIME_OFFSET:SIGNATURE_OFFSET],
            (uint48, uint48)
        );
    }

    /**
     * @dev verify our external signer signed this request. The "paymasterAndData" is expected to be the paymaster and a signature over the entire request params
     * @param userOp | User Operation
     * @param requiredPreFund | To be Developed
     * @return context | 
     * @return validationData | Validated Data for the Paymaster
     * 
     * Note :   ECDSA library supports both 64 and 65-byte long signatures. Only "require" it here so that the revert reason on invalid signature will be of "VerifyingPaymaster", and not "ECDSA".
     *          Don't revert on signature failure: return SIG_VALIDATION_FAILED
     *          No need for other on-chain validation: entire UserOp should have been checked by the external service prior to signing it.
     */
    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 /*userOpHash*/, uint256 requiredPreFund
    ) internal override returns (bytes memory context, uint256 validationData) {

        (requiredPreFund);

        (
            string memory tokenUri,
            address nftAddress,
            uint48 validUntil,
            uint48 validAfter,
            bytes calldata signature
        ) = parsePaymasterAndData(userOp.paymasterAndData);

        bytes32 hash = ECDSA.toEthSignedMessageHash(getHash(userOp, tokenUri, nftAddress, validUntil, validAfter));

        senderNonce[userOp.getSender()]++;

        if (verifyingSigner != ECDSA.recover(hash, signature)) {
            return ("", _packValidationData(true, validUntil, validAfter));
        }

        return (abi.encode(userOp.sender, tokenUri, nftAddress),_packValidationData(false, validUntil, validAfter));
    }

    /**
     * @dev This method will be called after the Verification happence. Here we can pay the gas and Mint NFTs respect to the game. Override the BasePayamster method.
     *      From here NFT is minted for the respective URI.
     * @param mode | Result of the Opcode 
     * @param context | encoded Sender address and Metadata URL
     * @param actualGasCost | Gas cost of the Transaction
     */
    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override {
        (mode);
        (actualGasCost);

        (address sender, string memory cid, address nftAddress) = abi.decode(context,(address, string, address));
        IKaijuGameNFT(nftAddress).safeMint(sender, cid);
    }
}
