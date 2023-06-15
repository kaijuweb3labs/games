// SPDX-License-Identifier: GPL-3.0
// author: kaiju3d.com

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "./core/BaseAccount.sol";
import "./callback/TokenCallbackHandler.sol";

/**
  * minimal account.
  *     this is sample minimal account.
  *     has execute, eth handling methods
  *     has a single signer that can send requests through the entryPoint.
  * Contract Dependencies:
  *     - Contract is Build on the AA model 9b5f2e4bb3 Commit (09th April 2023)
  */
contract KaijuAccount is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable {
    using ECDSA for bytes32;

    address public owner;
    IEntryPoint private immutable _entryPoint;

    event KaijuAccountInitialized(IEntryPoint indexed entryPoint, address indexed owner);

    /**
    * @dev Set initial state of the contract
    */
    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }


    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == address(this), "Only the owner can access to this Function");
        _;
    }

    modifier requireFromEntryPointOrOwner(){
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
        _;
    }

    function nonce() public view returns (uint256) {
        return getNonce();
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    /**
     * @dev Execute a transaction (called directly from owner, or by entryPoint)
     * @param dest - address | Address 
     * @param value - uint256 | 
     * @param func - bytes | Function
     */
    function execute(address dest, uint256 value, bytes calldata func) requireFromEntryPointOrOwner() external {
        _call(dest, value, func);
    }

    /**
     * @dev Execute a sequence of transactions
     * @param dest - address[] | Array of Addresses 
     * @param func - bytes[] | Array of Functions
     */
    function executeBatch(address[] calldata dest, bytes[] calldata func) requireFromEntryPointOrOwner() external {
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    /**
     * @dev The _entryPoint member is immutable, to reduce gas consumption.  To upgrade EntryPoint, a new implementation of SimpleAccount must be deployed with the new EntryPoint address, then upgrading the implementation by calling `upgradeTo()`
     * @param anOwner - (address) | Address of the owner
     */
    function initialize(address anOwner) public virtual initializer {
        _initialize(anOwner);
    }

    /**
     * @dev Ccheck current account deposit in the entryPoint
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    /**
     * @dev Deposit more funds for this account in the entryPoint
     */
    function addDeposit() public payable {
        entryPoint().depositTo{value : msg.value}(address(this));
    }

    /**
     * @dev Withdraw value from the account's deposit
     * @param withdrawAddress Recivers Address
     * @param amount value of the withdrawal
     */
    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function _initialize(address anOwner) internal virtual {
        owner = anOwner;
        emit KaijuAccountInitialized(_entryPoint, owner);
    }


    /**
     * @dev Function to validate the actual owners request of the contract. Implement template method of BaseAccount
     * @param userOp User Operation data
     * @param userOpHash User Operation Hash value
     */
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature))
            return SIG_VALIDATION_FAILED;
        return 0;
    }

    function _authorizeUpgrade(address newImplementation) onlyOwner() internal view override {
        (newImplementation);
    }
}

