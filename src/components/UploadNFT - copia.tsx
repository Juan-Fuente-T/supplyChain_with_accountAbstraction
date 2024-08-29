// import Navbar from "./Navbar";
// import Footer from "./Footer";
import { useEffect, useState } from "react";
import {uploadJSONToIPFS } from "../utils/Pinata";
import { supplyChainTokenABI } from '../assets/abis/supplyChainTokenABI';
// import { useLocation } from "react-router";
import { Contract, ethers, Signer } from 'ethers';
import { TOKEN_CONTRACT_ADDRESS } from "../assets/constants";
// import { Address } from "web3";
import { toast } from "react-toastify";
import { getTransmisionData } from "../utils/TransmisionData";

type TransmisionData = {
    Fecha: string;
    Participante: string;
    Clase: string;
};

// interface UploadNFTProps {
//     contract: ethers.Contract;
//     address: string;
// }
export default function UploadNFT(signer: Signer, address: string) {
    // const [transmisionData, updateTransmisionData] = useState<{ Fecha: string; Participante: string; Clase: string; }[]>([]);
    // const [fileURL, setFileURL] = useState<string | undefined>("");
    // const ethers = require("ethers");
    // const [message, updateMessage] = useState('');
    const [productId, setProductId] = useState<ethers.BigNumberish | undefined>(undefined);
    // const [productData, setProductData] = useState<ethers.BigNumberish[] | undefined>([]);
    const [tokenContract, setTokenContract] = useState<Contract | null>(null);
    // const location = useLocation();

    // async function disableButton() {
    //     const listButton = document.getElementById("list-button") as HTMLButtonElement | null;
    //     if (listButton) {
    //         listButton.disabled = true;
    //         listButton.style.backgroundColor = "grey";
    //         listButton.style.opacity = "0.3"; // Asegúrate de que sea una cadena
    //     }
    // }
    
    // async function enableButton() {
    //     const listButton = document.getElementById("list-button") as HTMLButtonElement | null;
    //     if (listButton) {
    //         listButton.disabled = false;
    //         listButton.style.backgroundColor = "#A500FF";
    //         listButton.style.opacity = "1"; // Asegúrate de que sea una cadena
    //     }
    // }
    // async function getNFTData(){
    //     try {
    //         // Llama a la función y espera los resultados
    //         if(productData){
    //             const { transmisionDataArray } = await getTransmisionData(productData); // Pasa los IDs que necesites
                
    //             // Ahora ownerships y participants contienen los datos obtenidos
                
    //             // Generar el nombre y descripción para el NFT basado en los datos obtenidos
    //             // const transmisionDataArray = ownerships.map(ownership => {
    //             // const correspondingParticipant = participants.find(participant => 
    //             //     participant.id.startsWith(`participant-${ownership.productOwnerId}-`)
    //             // );

    //         //     return {
    //         //         Fecha: ownership.trxTimeStamp,
    //         //         Participante: correspondingParticipant ? correspondingParticipant.name : 'Desconocido',
    //         //         Clase: correspondingParticipant ? correspondingParticipant.participantType : 'Clase desconocida',
    //         //     };
    //         // });

    //         // Actualizar el estado con los datos preparados
    //         updateTransmisionData(transmisionDataArray);

    //         console.log("Transmision Data Array:", transmisionDataArray);
    //         console.log("transmisionData(No creo de tiempo):", transmisionData);
    //         } 
    //         // Puedes realizar otras operaciones con los datos obtenidos aquí
    //     } catch (error) {
    //         console.error("Error obteniendo datos de NFT:", error);
    //     }
    // }
    
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
    
    // const formParams = {
    //     name: 'Nombre temporal',
    //     description: 'Descripción temporal',
    //     price: '0.01'
    // };
    
    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS(productData: ethers.BigNumberish[]) {
        let transmisionDataArray: TransmisionData[] = [];

    try {
        if (productData) {
            const data = await getTransmisionData(productData);
            transmisionDataArray = data.transmisionDataArray;   
            // updateTransmisionData(transmisionDataArray);
            console.log("transmisionDataArray", transmisionDataArray);
        }
    } catch (e) {
        console.log("Error obteniendo los datos del NFT:", e);
    }

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
    useEffect(() => {
        const tokenContract = new Contract(TOKEN_CONTRACT_ADDRESS, supplyChainTokenABI, signer);
        setTokenContract(tokenContract);

        const initContractListener = async () => {
            if (!tokenContract) {
                console.error("TokenContrac is not initialized");
            return;
        }
          
          // Escuchar el evento TransferOwnership
          tokenContract.on('TransferOwnership', async (productId: ethers.BigNumberish) => {
            console.log(`Product ${productId.toString()} has been transferred`);
            productId? setProductId(productId) : setProductId(undefined);
            try {
              // Fetch the product data
              const _productInfo = await tokenContract.getProduct(productId);
              const _productData = await tokenContract.getProvenance(productId);
            //   setProductData(_productData);
              
              // Check if the product has been transferred to a customer
              if (_productInfo.participantType === 'customer') {
                console.log(`Product ${productId.toString()} has been transferred to a customer`);
                // Aquí puedes realizar cualquier otra acción, como emitir un NFT o notificar al usuario
                // Emitir NFT y comprobar si fue exitoso
                // await getNFTData(); // Espera a que termine antes de continuar
                const metadataURL = await uploadMetadataToIPFS(_productData);
                if (metadataURL !== -1 && metadataURL !== undefined) {
                    // Emitir NFT
                    const success = await emitNFT(productId, metadataURL);
                    if (success) {
                        console.log('NFT emitted successfully');
                    } else {
                        console.log('NFT emission failed');
                    }
                }
              }
            } catch (error) {
              console.error('Error fetching product data:', error);
            }
          });
        };
    
        initContractListener();
    
        return () => {
          if (tokenContract) {
            tokenContract.off('TransferOwnership');
          }
        };
      }, [tokenContract, signer]);
    
      const emitNFT = async (productId: ethers.BigNumberish, metadataURL: string) => {        // if (!contract || !signer) return;
        if (!tokenContract ) return;
    
        if (!metadataURL) {
            console.error('Metadata URL is undefined.');
            return false; // O lanza un error si prefieres
        }

        try {
        //   const metadata = JSON.stringify({
        //     productId: productId.toString(),
        //     timestamp: new Date().toISOString()
        //   });
    
          const tx = await tokenContract.mint(address, productId, 1, metadataURL);
          await tx.wait();
          console.log('NFT emitted successfully');
          toast("Successfully listed your NFT!");
          return true;
          //   alert("Successfully listed your NFT!");
        } catch (error) {
            toast.error('Emitting NFT failed');
            console.error('Error emitting NFT:', error);
            return false;
        }
      };
    
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
