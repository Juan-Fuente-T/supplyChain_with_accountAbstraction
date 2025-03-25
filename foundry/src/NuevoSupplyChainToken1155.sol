// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";


/// @title SupplyChainToken - Un contrato ERC1155 simple para la gestión de tokens en una cadena de suministro
/// @notice Este contrato permite la creación de tokens ERC1155 que pueden ser usados en una cadena de suministro.
/// @dev Hereda de ERC1155 de OpenZeppelin, y extiende con funcionalidades de quema y suministro.
contract NuevoSupplyChainToken is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using ECDSA for bytes32;
    
    /// @notice Nombre de la colección de tokens
    string public name = "Supply Chain Token";
    /// @notice Símbolo de la colección de tokens
    string public symbol = "SCT";
    // Guarda el último ID usado
    uint256 private _currentTokenId; 
    /// @notice Mapping para asociar un tokenId con su CID en IPFS
    mapping(uint256 => string) private _tokenCIDs;
    /// @notice Mapping para asociar un id de NFT con el Id de un producto
    mapping (uint256 => uint256) private _tokenIds;
    /// @notice Mapping para asociar un productId con su Id en el contrato
    mapping (uint256 => uint256) private _productToToken;

    event nftMinted (uint256 indexed productId, uint256 indexed currentTokenId, uint256 amount, address  indexed sender);
    event nftBatchMinted (uint256[] indexed _productIds, uint256[] indexed ids, uint256[] amounts, address  indexed sender);
    event nftBurned (uint256 indexed productId, uint256 indexed tokenId, uint256 amount, address indexed sender);

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
    function setURI(
        bytes32 _hash, 
        bytes memory _signature,
        string memory newuri
        ) public onlyOwner verifySignature(msg.sender, _hash, _signature) {
        _setURI(newuri);
    }

    /// @notice Mintea una cantidad específica de un token con un ID dado a una dirección especificada
    /// @param _to Dirección que recibirá los tokens minteados
    /// @param _productId ID del token a mintear
    /// @param _amount Cantidad de tokens a mint
    // function mint(bytes32 _hash, bytes memory _signature, address _to, uint256 _id, uint256 _amount, string memory cid) 
    function mint(
        bytes32 _hash, 
        bytes memory _signature,
        address _to, 
        uint256 _productId, 
        uint256 _amount, 
        string memory cid
        ) 
    // public onlyOwner verifySignature(_to, _hash, _signature){
    public verifySignature(msg.sender, _hash, _signature){
        _currentTokenId++;
        _tokenCIDs[_currentTokenId] = cid; // Store CID in the mapping as bytes32
        _tokenIds[_currentTokenId] = _productId; // Relación tokenId -> productId
        _productToToken[_productId] = _currentTokenId; // Relación inversa productId -> tokenId
        _mint(_to, _currentTokenId, _amount, "");
        emit nftMinted(_productId, _currentTokenId, _amount, msg.sender);
    }

    /// @notice Mintea cantidades específicas de múltiples IDs de token a una dirección especificada
    /// @param _to Dirección que recibirá los tokens minteados
    /// @param _productIds Array de IDs de tokens a mintear
    /// @param _amounts Array de cantidades de cada ID de token a mintear
    function mintBatch(
        bytes32 _hash, 
        bytes memory _signature,
        address _to,
        uint256[] memory _productIds,
        uint256[] memory _amounts,
        string memory _cid
    ) public verifySignature(msg.sender, _hash, _signature){
        uint256[] memory ids = new uint256[](_productIds.length);
        for (uint256 i; i < _productIds.length;){
            _currentTokenId++;
            _tokenIds[_currentTokenId] = _productIds[i];
            _productToToken[_productIds[i]] = _currentTokenId; 
            _tokenCIDs[_currentTokenId] = _cid;
            ids[i] = _currentTokenId;
            unchecked{
                i++;
            }   
        }
         _mintBatch(_to, ids, _amounts, "");
         emit nftBatchMinted(_productIds, ids, _amounts, msg.sender);
    }
    
    /// @notice Quema el o los NFT correspondiente al id de un producto solicitado
    /// @param _productId The product ID
    /// @param _amount The amount to be burned
    function burn(
        bytes32 _hash, 
        bytes memory _signature,
        uint256 _productId,
        uint256 _amount
    ) public verifySignature(msg.sender, _hash, _signature){
        uint256 tokenId = _productToToken[_productId];
        _burn(msg.sender, tokenId, _amount);
        emit nftBurned(_productId, tokenId, _amount, msg.sender);
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
    /// @param _tokenId The token ID
    /// @return The URI for the token metadata   
    function uri(uint256 _tokenId) public view override returns (string memory) {
        string memory cid = _tokenCIDs[_tokenId]; // Retrieve the CID from the mapping
        require(bytes(cid).length > 0, "CID not set for this token ID"); // Ensure CID exists
        // string memory baseURI = "https://gateway.pinata.cloud/ipfs/";
        // return string(abi.encodePacked(baseURI, cid)); // Construye la URI completa
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", cid));
    }

    /// @notice Retrieves the URI for a given product ID based on the stored CID.
    /// @dev Combines the base IPFS gateway URL with the stored CID to construct the full URI.
    /// @param _productId The token ID
    /// @return The URI for the token metadata 
    function uriFromProductId(uint256 _productId) public view returns (string memory) {
        // uint256 id = _tokenIds[_productId];
        uint256 id = _productToToken[_productId];
        string memory cid = _tokenCIDs[id]; // Retrieve the CID from the mapping
        require(bytes(cid).length > 0, "CID not set for this token ID"); // Ensure CID exists
        // string memory baseURI = "https://gateway.pinata.cloud/ipfs/";
        // return string(abi.encodePacked(baseURI, cid)); // Construye la URI completa
        return string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/", cid));
    }

    /// @notice Retrieves the token ID of a given product based on its CID.
    /// @dev Retrieve the stored mapping value for an id and raise a not found error if it does not exist.
    /// @param _productId Product ID to retrieve
    function getTokenId(uint256 _productId) public view returns (uint256 id) {
        require(_productId > 0, "El id de producto debe ser mayor que cero");
        // require(bytes(_tokenCIDs[_productId]).length > 0);
        return  _productToToken[_productId];
    }

    /// @notice Retrieves the product ID of a given NFT based on its CID.
    /// @dev Retrieve the stored mapping value for an NFT id and raise a not found error if it does not exist.
    /// @param _tokenId Token ID to retrieve
    function getProductId(uint256 _tokenId) public view returns (uint256 id) {
        require(_tokenId > 0, "El id del NFT debe ser mayor que cero");
        // require(bytes(_tokenCIDs[_productId]).length > 0);
        return  _tokenIds[_tokenId];
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