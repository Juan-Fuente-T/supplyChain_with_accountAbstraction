// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useEffect, useState } from "react";
import { uploadJSONToIPFS } from "../utils/Pinata";
import { supplyChainTokenABI } from '../assets/abis/supplyChainTokenABI';
// import { useLocation } from "react-router";
import { Contract, ethers, hashMessage } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS } from "../assets/constants";
// import { Address } from "web3";
import { toast } from "react-toastify";
import { getTransmisionData } from "../utils/TransmisionData";
import { signMessage } from "../utils/SignMessageFunction";
import { IProvider } from "@web3auth/base";

type TransmisionData = {
    Fecha: string;
    Participante: string;
    Clase: string;
};


// export async function UploadNFT(signer: Signer, address: string) {    // const [transmisionData, updateTransmisionData] = useState<{ Fecha: string; Participante: string; Clase: string; }[]>([]);
//     // const [fileURL, setFileURL] = useState<string | undefined>("");

//     // // const [productData, setProductData] = useState<ethers.BigNumberish[] | undefined>([]);
//     const [tokenContract, setTokenContract] = useState<Contract | null>(null);
//     const [tokenEmitted, setTokenEmitted] = useState<boolean | null>(false);
//     console.log("productId",productId);
//     console.log("tokenContract",tokenContract);

// Función para simular la lógica
async function testProductInfoHandling() {
    // Datos simulados para imitar lo que se recibiría de la blockchain
    const simulatedProductInfo = new Proxy(
        ["12", "120", "Bob", "Supplier", BigInt(1200), BigInt(1722449801), "0xe67F18c5064f12470Efc943798236edF45CF3Afb"],
        {
            get(target, prop, receiver) {
                console.log(`Accessing property ${String(prop)}`);
                return Reflect.get(target, prop, receiver);
            }
        }
    );

    // Simulando la lógica que usas en tu código
    const supplierType = String(simulatedProductInfo[3]).trim();
    console.log("Supplier Type:", supplierType);

    if (supplierType === "Supplier") {
        console.log(`Product has been transferred to Supplier`);
    } else {
        console.log(`Product has been transferred to another participant type: ${supplierType}`);
    }
}

// Llamar a la función para probar
testProductInfoHandling();

export async function UploadNFT(signer: ethers.Signer, address: string, contract: Contract, provider: IProvider): Promise<boolean> {
    // const [productId, setProductId] = useState<ethers.BigNumberish | undefined>(undefined);
    let productId: ethers.BigNumberish | undefined;
    // Variable para evitar duplicar el procesamiento de eventos
    let isProcessing = false;
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, supplyChainTokenABI, signer);
    console.log("UP_tokenContract", tokenContract);
    
    return new Promise(async (resolve, reject) => {
        try {
        // contract.on('TransferOwnership', async (_productId: ethers.BigNumberish) => {
            // const listener = async (_productId: ethers.BigNumberish) => {
            
            // const _productId = 12;
            console.log("El LISTENER debe activarse ahora");
            contract.on('TransferOwnership', async (_productId: ethers.BigNumberish) => {
            productId = _productId;
            console.log("UP_productId", productId);
            if (isProcessing) return; // Evita la concurrencia si ya se está procesando un evento
            isProcessing = true;
            console.log(`Product ${productId?.toString()} has been transferred`);
         
            try {
                // Obtener la información del producto
                const productInfo = await contract.getProduct(_productId);
                const ownershipIds = await contract.getProvenance(_productId);
                console.log("UP_productInfo",productInfo);
                console.log("UP__ownershipIds ",ownershipIds );
                const { transmisionDataArray, filteredIds } = await getTransmisionData(ownershipIds);
                console.log("UP__transmisionDataArray + filteredIds ",transmisionDataArray, filteredIds);
                
                const supplierType = String(productInfo[3]).trim();

                console.log("ProductTYPE", String(productInfo[3]).trim());
                // if (supplierType === "Supplier") {
                if (supplierType === "Consumer") {
                // if (productInfo[3] === "Supplier") {
                // if (productInfo[3] === 'Consumer') {
                    console.log(`Product ${productId?.toString()} has been transferred to consumer`);
                    if(productId !== undefined){
                        const metadataCid = await uploadMetadataToIPFS(ownershipIds, productId, transmisionDataArray);

                        // Subir los metadatos a IPFS y emitir NFT
                        console.log("UP__metadataCid",metadataCid);
                        if (metadataCid !== -1 && metadataCid !== undefined) {
                            
                            // Estas dos lineas ya no son necesarias, se realiza en la propia funcion en Pinata.tsx
                            // const parts = metadataURL.split('/'); // Se divide la URL en partes usando '/' como delimitador
                            // const cid = parts[parts.length - 1]; // Se devuelve la última parte, que debería ser el CID
                        
                            // const success = true;
                            const success = await emitNFT(tokenContract, productId, metadataCid, address, filteredIds);
                            if (success) {
                                console.log('NFT emitted successfully');
                                // Eliminar las ownerships filtradas del localStorage
                                // filteredIds.forEach(id => localStorage.removeItem(id));//ya se hace en emitNFT
                                resolve(true);
                            } else {
                                console.log('NFT emission failed');
                                resolve(false);
                            }
                        }
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                    resolve(false);
                } finally {
                    isProcessing = false; // Permite procesar el siguiente evento
                }       
        });
        
            console.log("Listener registrado correctamente");
        } catch (error) {
            console.error('Error registrando el listener:', error);
            reject(false);
        }
    });


 
    //This function uploads the NFT image to IPFS    
    // async function OnChangeFile(e: React.ChangeEvent<HTMLInputElement>){
    //     var file = e.target.files?.[0];
    //     //check for file extension
    //     if (file) {
    //         try {
    //             //upload the file to IPFS
    //             disableButton();
    //             updateMessage("Uploading image.. please dont click anything!")
    //             const response = await uploadFileToIPFS(file);
    //             if(response.success === true) {
    //                 enableButton();
    //                 updateMessage("")
    //                 console.log("Uploaded image to Pinata: ", response.pinataURL)
    //                 setFileURL(response?.pinataURL);
    //                 console.log("fileURL updated:", fileURL);
    //             }
    //         }
    //         catch(e) {
    //             console.log("Error during file upload", e);
    //         }
    //     } else {
    //         console.log("No file selected");
    //     }
    // }
    
   
    
    //This function uploads the metadata to IPFS
    // async function uploadMetadataToIPFS(ownershipIds: ethers.BigNumberish[], productId: ethers.BigNumberish, transmisionDataArray: TransmisionData[]) {
    async function uploadMetadataToIPFS(ownershipIds: ethers.BigNumberish[], productId: ethers.BigNumberish, transmisionDataArray: TransmisionData[]) {
    //     let transmisionDataArray: TransmisionData[] = [];

    // try {
    //     if (productData) {
    //         // const { transmisionDataArray, } = await getTransmisionData(productData);
    //         // transmisionDataArray = data.transmisionDataArray;   
    //         // updateTransmisionData(transmisionDataArray);
    //         console.log("transmisionDataArray", transmisionDataArray);
    //     }
    // } catch (e) {
    //     console.log("Error obteniendo los datos del NFT:", e);
    // }

    // Verificar si el array de transmisionData no está vacío
    if (!productId || transmisionDataArray.length === 0) {
        toast.error("No hay datos para cargar a IPFS.");
        console.error("No hay datos para cargar a IPFS.");
        return -1;
    }
    const idsArray = ownershipIds.map(bn => bn.toString());
    const nftJSON = {
        productId: productId.toString(),
        ownershipIds: idsArray,
        ownershipsData: transmisionDataArray?.map(data => ({
            Fecha: data.Fecha,
            Participante: data.Participante,
            Clase: data.Clase,
        }))
    };
    // const extractedNumbers = ownershipIds.map(id => {
    //     const match = id.match(/ownership-(\d+)-/);
    //     return match ? parseInt(match[1], 10) : null;
    // });
    try {
        //upload the metadata JSON to IPFS
        const response = await uploadJSONToIPFS(nftJSON);
        if(response.success === true){
            console.log("Uploaded JSON to Pinata: ", response);
            console.log("Uploaded JSON PinataURL: ", response.pinataURL);
            return response.pinataURL;
        }
    }
    catch(e) {
        console.log("error uploading JSON metadata:", e)
    }
    }
    // async function uploadMetadataToIPFS() {
    //     const {name, description, price} = formParams;
    //     //Make sure that none of the fields are empty
    //     if( !name || !description || !price || !fileURL)
    //     {
    //         updateMessage("Please fill all the fields!")
    //         return -1;
    //     }
    
    //     const nftJSON = {
    //         name, description, price, image: fileURL
    //     }
    
    //     try {
    //         //upload the metadata JSON to IPFS
    //         const response = await uploadJSONToIPFS(nftJSON);
    //         if(response.success === true){
    //             console.log("Uploaded JSON to Pinata: ", response);
    //             console.log("Uploaded JSON PinataURL: ", response.pinataURL);
    //             return response.pinataURL;
    //         }
    //     }
    //     catch(e) {
    //         console.log("error uploading JSON metadata:", e)
    //     }
    // }

    
    async function emitNFT(
        tokenContract: Contract,
        productId: ethers.BigNumberish,
        metadataCid: string,
        address: string, 
        filteredIds: string[]
    ): Promise<boolean> {
        if (!tokenContract || !metadataCid || !address || !productId) return false;
    
        try {
            console.log("Address conectada que usa la Dapp: ", address);
            const message = "Hola, Trazable DLT pagará el gas por ti";
            const hash = hashMessage(message);
            const signature = await signMessage(message, provider);
            console.log("Hash", hash);
            console.log("address", address);
            console.log("Signature", signature);
            const tx = await tokenContract.mint(hash, signature, address, productId, 1, metadataCid);
            await tx.wait();
            console.log('NFT emitted successfully');
            console.log('NFT TX', tx);
            console.log('NFT TX HASH', tx.hash);
            console.log('NFT TX HASHmessage', tx.hashMessage);
            toast("Successfully listed your NFT!");
            // Eliminar las ownerships del localStorage
            filteredIds.forEach(id => localStorage.removeItem(id));
            return true;
        } catch (error) {
            toast.error('Emitting NFT failed');
            console.error('Error emitting NFT:', error);
            return false;
        }
    }
    
    // async function uploadNFT(e: React.FormEvent<HTMLFormElement>){
    //     console.log("listNFT called");
    //     e.preventDefault();
    
    //     //Upload data to IPFS
    //     try {
    //         const metadataURL = await uploadMetadataToIPFS();
    //         if(metadataURL === -1) return;
    //         //After adding your Hardhat network to your metamask, this code will get providers and signers
    //         // const provider = new ethers.BrowserProvider(window.ethereum, "any"); // "any" permite trabajar con diferentes redes            const signer = provider.getSigner();
    //         disableButton();
    //         updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")
    
    //         alert("Successfully listed your NFT!");
    //         enableButton();
    //         updateMessage("");
    //         updateFormParams({ name: '', description: '', price: ''});
    //         window.location.replace("/")
    //     }
    //     catch(e) {
    //         alert( "Upload error"+e )
    //     }
   
} 
