// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

using ECDSA for bytes32;

/// @title SupplyChainToken - Un contrato ERC1155 simple para la gestión de tokens en una cadena de suministro
/// @notice Este contrato permite la creación de tokens ERC1155 que pueden ser usados en una cadena de suministro.
/// @dev Hereda de ERC1155 de OpenZeppelin, y extiende con funcionalidades de quema y suministro.
contract SupplyChainToken is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    
    /// @notice Nombre de la colección de tokens
    string public name = "Supply Chain Token";
    /// @notice Símbolo de la colección de tokens
    string public symbol = "SCT";

    /// @notice Mapping para asociar un tokenId con su CID en formato bytes32
     mapping(uint256 => string) private _tokenCIDs;

    /// @notice Error que se lanza cuando la firma no es válida
    error NotSigner();
    // error NOT_SIGNER();

    /// @notice Constructor del contrato que inicializa el ERC1155 con un URI vacío y transfiere la propiedad
    /// @param owner Dirección del propietario que recibirá el primer token
    constructor(address owner) ERC1155("https://gateway.pinata.cloud/ipfs/{cid}") Ownable(owner){
       // mint(owner, 1, 1); // Mintea un NFT con id 1 y cantidad 1 al creador del contrato
    }

    /// @notice Modificador que verifica la firma de un hash dado
    /// @param _signer Dirección que se espera sea la firmante
    /// @param _hash Hash que fue firmado
    /// @param _signature Firma que será verificada
    modifier verifySignature(
        address _signer,
        bytes32 _hash,
        bytes memory _signature
    ){
        _checkSigner(_signer, _hash, _signature);
        _;
    }


    /// @notice Establece la URI para los metadatos de un ID de token dado
    /// @param newuri La nueva URI a establecer
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /// @notice Mintea una cantidad específica de un token con un ID dado a una dirección especificada
    /// @param _to Dirección que recibirá los tokens minteados
    /// @param _id ID del token a mintear
    /// @param _amount Cantidad de tokens a mint
    function mint(bytes32 _hash, bytes memory _signature, address _to, uint256 _id, uint256 _amount, string memory cid) 
    // function mint(bytes32 _hash, bytes memory _signature, address _to, uint256 _id, uint256 _amount) 
    // public onlyOwner verifySignature(_to, _hash, _signature){
    // public onlyOwner{ //TAL COMO ESTA NO USA LA FIRMA ENCRIPTADA 
    public verifySignature(_to, _hash, _signature){ //TAL COMO ESTA NO USA EL ONLYOWNER
    // public verifySignature(_to, _hash, _signature){
        _mint(_to, _id, _amount, "");
        _tokenCIDs[_id] = cid; // Store CID in the mapping as bytes32
    }

    /// @notice Mintea cantidades específicas de múltiples IDs de token a una dirección especificada
    /// @param to Dirección que recibirá los tokens minteados
    /// @param ids Array de IDs de tokens a mintear
    /// @param amounts Array de cantidades de cada ID de token a mintear
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner{
         _mintBatch(to, ids, amounts, data);
    }

    /// @notice Actualiza el estado del suministro al transferir o quemar tokens
    /// @param from Dirección desde la que se están moviendo los tokens
    /// @param to Dirección hacia la que se están moviendo los tokens
    /// @param ids Array de IDs de tokens que se están moviendo
    /// @param values Array de cantidades de cada token que se están moviendo
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
   
    /// @notice Retrieves the URI for a given token ID based on the stored CID.
    /// @dev Combines the base IPFS gateway URL with the stored CID to construct the full URI.
    /// @param id The token ID
    /// @return The URI for the token metadata   
    function uri(uint256 id) public view override returns (string memory) {
        string memory cid = _tokenCIDs[id]; // Retrieve the CID from the mapping
        require(bytes(cid).length > 0, "CID not set for this token ID"); // Ensure CID exists
    // string memory baseURI = "https://gateway.pinata.cloud/ipfs/";
    // return string(abi.encodePacked(baseURI, cid)); // Construye la URI completa
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", cid));
    }

    /// @notice Verifica que una firma sea válida comparando el resultado con el signer esperado
    /// @param _signer Dirección esperada del firmante
    /// @param _hash Hash que se ha firmado
    /// @param _signature Firma proporcionada para verificar
    function _checkSigner(
        address _signer,
        bytes32 _hash,
        bytes memory _signature      
    ) internal pure{
        bool isSigner = _hash.recover(_signature) == _signer;
        if(!isSigner){
            revert NotSigner();
        }
        // if(!isSigner) revert NOT_SIGNER();
    }
    
}