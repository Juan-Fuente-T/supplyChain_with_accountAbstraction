// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { useEffect, useState } from "react";
import { uploadJSONToIPFS } from "../utils/Pinata";
import { supplyChainTokenABI } from '../assets/abis/supplyChainTokenABI';
// import { useLocation } from "react-router";
import { Contract, ethers } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS } from "../assets/constants";
// import { Address } from "web3";
import { toast } from "react-toastify";
import { getTransmisionData } from "../utils/TransmisionData";

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

export async function UploadNFT(signer: ethers.Signer, address: string, contract: Contract): Promise<boolean> {
    // const [productId, setProductId] = useState<ethers.BigNumberish | undefined>(undefined);
    let productId: ethers.BigNumberish | undefined;
    // Variable para evitar duplicar el procesamiento de eventos
    let isProcessing = false;
    const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, supplyChainTokenABI, signer);
    console.log("UP_tokenContract", tokenContract);
    
    return new Promise((resolve, reject) => {
        contract.on('TransferOwnership', async (_productId: ethers.BigNumberish) => {
            if (isProcessing) return; // Evita la concurrencia si ya se está procesando un evento
            isProcessing = true;
            console.log(`Product ${_productId.toString()} has been transferred`);
            // productId? setProductId(productId) : setProductId("");
            productId = _productId;
            try {
                // Obtener la información del producto
                const _productInfo = await contract.getProduct(productId);
                const _productData = await contract.getProvenance(productId);
                console.log("UP__productInfo",_productInfo);
                console.log("UP__productData ",_productData );
                const { transmisionDataArray, filteredIds } = await getTransmisionData(_productData);
                console.log("UP__productData + filteredIds ",transmisionDataArray, filteredIds);
                
                if (_productInfo.participantType === 'Consumer') {
                    console.log(`Product ${productId.toString()} has been transferred to consumer`);
                    
                    // Subir los metadatos a IPFS y emitir NFT
                    const metadataURL = await uploadMetadataToIPFS(_productData, productId, transmisionDataArray);
                    console.log("UP__metadataURL",metadataURL);
                        if (metadataURL !== -1 && metadataURL !== undefined) {
                            const success = await emitNFT(tokenContract, productId, metadataURL, address, filteredIds);
                            if (success) {
                                console.log('NFT emitted successfully');
                                // Eliminar las ownerships filtradas del localStorage
                                filteredIds.forEach(id => localStorage.removeItem(id));
                                resolve(true);
                            } else {
                                console.log('NFT emission failed');
                                resolve(false);
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
        });
    }
    
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
    async function uploadMetadataToIPFS(productData: ethers.BigNumberish[], productId: ethers.BigNumberish, transmisionDataArray: TransmisionData[]) {
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
    const nftJSON = {
        productId: productId,
        ownerships: transmisionDataArray?.map(data => ({
            Fecha: data.Fecha,
            Participante: data.Participante,
            Clase: data.Clase,
        }))
    };

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
        metadataURL: string,
        address: string, 
        filteredIds: string[]
    ): Promise<boolean> {
        if (!tokenContract || !metadataURL) return false;
    
        try {
            const tx = await tokenContract.mint(address, productId, 1, metadataURL);
            await tx.wait();
            console.log('NFT emitted successfully');
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
   
    
