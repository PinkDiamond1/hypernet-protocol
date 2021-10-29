// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract LazyMintModule is Context {
    // root proof of merkle tree
    mapping(uint256 => bool) private usedNonces;
    address public registry;

    constructor(address _registry)
    {
        registry = _registry;
    }

    /// @notice lazyRegister REGISTRAR_ROLE to offload gas cost of minting to reciever 
    /// @dev REGISTRAR_ROLE must provide a signature and allowLabelChange must be false to prevent replay
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI 
    /// @param signature signature from REGISTRAR_ROLE 
    function lazyRegister(address to, 
                          string calldata label, 
                          string calldata registrationData, 
                          uint256 nonce,
                          bytes calldata signature)
        external {
        // the token label is the nonce to prevent replay attack
        require(_cleanNonce(nonce), "LazyMintModule: used nonce.");
        
        // transaction caller must be recipient
        require(_msgSender() == to, "LazyMintModule: Caller is not recipient.");
        
        // require a valid signature from a member of REGISTRAR_ROLE
        require(_isValidSignature(to, label, registrationData, nonce, signature), "LazyMintModule: signature failure.");
        
        // issue new token here
        INfr(registry).register(to, label, registrationData);
    }
    
    function _isValidSignature(address to, string memory label, string memory registrationData, uint256 nonce, bytes memory signature)
        internal
        view
        returns (bool)
    {
        // convert the payload to a 32 byte hash
        bytes32 hash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(to, label, registrationData, nonce)));
        
        // check that the signature is from REGISTRAR_ROLE
        return INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), ECDSA.recover(hash, signature));
    }

    function _cleanNonce(uint256 nonce) internal view virtual returns (bool) {
        // returns true of the nonce has not been used
        return (usedNonces[nonce] == false);
    }
}

// minimal interfact for the NonFungibleRegistry register function
interface INfr {
    function register(address to, string calldata label, string calldata registrationData) external;
    function hasRole(bytes32 role, address account) external view returns (bool);
    function REGISTRAR_ROLE() external view returns (bytes32);
}