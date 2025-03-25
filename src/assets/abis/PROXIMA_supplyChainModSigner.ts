export const abi = [
    {
        "type": "function",
        "name": "addParticipant",
        "inputs": [
            {
                "name": "_signer",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_hash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_signature",
                "type": "bytes",
                "internalType": "bytes"
            },
            {
                "name": "_name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_pass",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_pType",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_pAdd",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addProduct",
        "inputs": [
            {
                "name": "_signer",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_hash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_signature",
                "type": "bytes",
                "internalType": "bytes"
            },
            {
                "name": "_productOwnerId",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "_modelNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_partNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_serialNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_productCost",
                "type": "uint64",
                "internalType": "uint64"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "authenticateParticipant",
        "inputs": [
            {
                "name": "_uid",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "_uname",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_pass",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "_utype",
                "type": "string",
                "internalType": "string"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getOwnership",
        "inputs": [
            {
                "name": "_regId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getParticipant",
        "inputs": [
            {
                "name": "_participant_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getProduct",
        "inputs": [
            {
                "name": "_productId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getProvenance",
        "inputs": [
            {
                "name": "_prodId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getproductOwnerData",
        "inputs": [
            {
                "name": "_productId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "",
                "type": "uint64",
                "internalType": "uint64"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "newOwner",
        "inputs": [
            {
                "name": "_signer",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_hash",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "_signature",
                "type": "bytes",
                "internalType": "bytes"
            },
            {
                "name": "_user1Id",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "_user2Id",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "_prodId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "owner_id",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "ownerships",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "productId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "productOwnerId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "trxTimeStamp",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "productOwnerAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "participant_id",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "participants",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "userName",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "password",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "participantType",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "participantAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "productTrack",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "product_id",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "products",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "modelNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "partNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "serialNumber",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "participantName",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "participantType",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "participantId",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "cost",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "mfgTimeStamp",
                "type": "uint64",
                "internalType": "uint64"
            },
            {
                "name": "productOwnerAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "TransferOwnership",
        "inputs": [
            {
                "name": "productId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "ECDSAInvalidSignature",
        "inputs": []
    },
    {
        "type": "error",
        "name": "ECDSAInvalidSignatureLength",
        "inputs": [
            {
                "name": "length",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "ECDSAInvalidSignatureS",
        "inputs": [
            {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ]
    },
    {
        "type": "error",
        "name": "NotSigner",
        "inputs": []
    }
]