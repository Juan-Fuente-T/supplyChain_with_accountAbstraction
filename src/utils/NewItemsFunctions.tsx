
// import { contract } from 'web3/lib/commonjs/eth.exports';
import { Contract, ethers, hashMessage, JsonRpcProvider, Signer, Wallet } from 'ethers';
import { toast } from 'react-toastify';

import { addItemToLocalStorage } from './StorageFuntions';
import { Participant, Product, Ownership } from './Types';
import { signMessage} from '../utils/SignMessageFunction';

/**
 * Adds a new participant and set data on local storage.
 * 
 * @param signer - The signer object for transaction signing
 * @param contract - The smart contract instance
 * @param address - The address of the user
 * @param name - The name of the participant
 * @param pass - The password of the participant
 * @param participantType - The type of the participant
 * @param participantAddress - The address of the participant
 * @param setIsParticipantModalOpen - Function to set the participant modal open state
 * @param setIsLoading - Function to set the loading state
 * @param setParticipantData - Function to set the participant data
 * @param setName - Function to set the name state
 * @param setPass - Function to set the password state
 * @param setParticipantType - Function to set the participant type state
 * @param setParticipantAddress - Function to set the participant address state
 */
export const addParticipant = async (
  signer: Signer,
  contract: Contract,
  address: string,
  name: string,
  pass: string,
  participantType: string,
  participantAddress: string,
  setIsParticipantModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setPass: React.Dispatch<React.SetStateAction<string>>,
  setParticipantType: React.Dispatch<React.SetStateAction<string>>,
  setParticipantAddress: React.Dispatch<React.SetStateAction<string>>,
) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          console.log("hash", hash);
          // const signature = await signMessage(message, signer);
          
          let signature;
          try {
            signature = await signMessage(message, signer);
            console.log("signature", signature);
            console.log("Message signed");
          } catch (signError) {
            console.error("Error signing message:", signError);
            throw new Error("Failed to sign message");
          }
    
          if (!contract) {
            throw new Error("Contract not found");
          }
          //** Get the last participant Id */
          // const addParticipantID = await contract.participant_id(); 
          let addParticipantID;
          try {
            addParticipantID = await contract.participant_id();
            console.log("Participant ID fetched:", addParticipantID.toString());
          } catch (idError) {
            console.error("Error fetching participant_id:", idError);
            throw new Error("Failed to fetch participant ID");
          }

          console.log("Adding participant to contract");
          let addParticipantTx;
          try {
      console.log("Datos que paso a addParticipant: ", address, hash, signature, name, pass, participantType, participantAddress);
          const addParticipantTx = await contract.addParticipant(address, hash, signature, name, pass, participantType, participantAddress, {
            gasLimit: 5000000,
          });
          console.log("addParticipant transaction sent");
          await addParticipantTx.wait();
        } catch (txError) {
          console.error("Error in addParticipant transaction:", txError);
          throw new Error("Failed to add participant to contract");
        }finally{
          console.log("Transaction finalized");
        }

    if (addParticipantTx) {
      let participant = new Participant(
        name,
        participantType,
        participantAddress,
        addParticipantID.toString()
      );
      addItemToLocalStorage(participant, "participant");
      console.log("Participant added to local storage");

      console.log("Fetching participant data from contract");
      const participantData = await contract.getParticipant(addParticipantID);
      setParticipantData(participantData);
      console.log("Participant data fetched and set");
    

                //** Save participant data in local storage */
                addItemToLocalStorage(participant, "participant");
                
                //** Retrieve and save participant data */
                setParticipantData(await contract.getParticipant(addParticipantID));
            }
                
                toast("Participant added successfully");
                setIsParticipantModalOpen(true);
            } catch (error) {
                console.error(error);
                toast.error('Error while adding participant. Try again.')
        } finally {
          setIsLoading(false);
        }
        //** Reset the new participant's data */
        setName('');
        setPass('');
        setParticipantAddress('');
        setParticipantType('');
        // setIsLoading(true)
      };

      /**
       * Adds a new product to the blockchain and local storage.
       * 
       * @param signer - The signer object for transaction signing
       * @param contract - The smart contract instance
       * @param address - The address of the user
       * @param ownerId - The ID of the owner
       * @param modelNumber - The model number of the product
       * @param partNumber - The part number of the product
       * @param serialNumber - The serial number of the product
       * @param productCost - The cost of the product
       * @param setIsProductModalOpen - Function to set the product modal open state
       * @param setIsLoading - Function to set the loading state
       * @param setProductData - Function to set the product data
       * @param setOwnerId - Function to set the owner ID state
       * @param setModelNumber - Function to set the model number state
       * @param setSerialNumber - Function to set the serial number state
       * @param setProductCost - Function to set the product cost state
       */
      export const addProduct = async (
        signer: Signer,
        contract: Contract,
        address: string,
        ownerId: number, 
        modelNumber: string,
        partNumber: string, 
        serialNumber: string, 
        productCost: number,
        // productData: any,
        setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        setOwnerId: React.Dispatch<React.SetStateAction<number>>,
        setModelNumber: React.Dispatch<React.SetStateAction<string>>,
        setSerialNumber: React.Dispatch<React.SetStateAction<string>>,
        setProductCost: React.Dispatch<React.SetStateAction<number>>
      ) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          const signature = await signMessage(message, signer);
    
          if (!contract) {
            throw new Error("Contract not found");
          }
    
          //** Get the last product Id */
          const addProductID = await contract.product_id(); 
          //** Set product in blockchain */
          const addProductTx = await contract.addProduct(address, hash, signature, ownerId, modelNumber, partNumber, serialNumber, productCost, {
            gasLimit: 5000000,
          });
          const receipt = await addProductTx.wait();
    
          if(receipt && addProductID){
            //** Retrieve product data */
            const _productData = await contract.getProduct(parseInt(addProductID));
        
            setProductData(_productData);
            
            let product = new Product(
              _productData ? (_productData[0]).toString() : '',
              _productData ? (_productData[1]).toString() : '',
              _productData ? (_productData[2]).toString() : '',
              _productData ? (_productData[3]).toString() : '',
              _productData ? parseInt(_productData[4].toString()) : 0,
              _productData ? _productData[5]: 0,
              _productData ? (_productData[6]).toString() : '',
              (parseInt(addProductID)).toString())
              // console.log("Product DATA:", product.id, JSON.stringify(product));
              
               //** Save product data in local storage */
              addItemToLocalStorage(product, "product");
              // fetchProductData(addProductID.toString());
              
              toast("Product added successfully");
              setIsProductModalOpen(true);             
          }
        } catch (error) {
          console.error(error);
          toast.error('Error while adding product. Try again.')
        } finally {
          setIsLoading(false);
        }
        //** Reset the new product's data */
        setOwnerId(0);
        setModelNumber('');
        setSerialNumber('');
        setProductCost(0);
      };
    

//////////////////NECESARIO REVISAR ESTA DOCUMENTACION Y COMENTARIOS///////////////////////////////////


      /**
       * Transfers ownership of a product to a new owner.
       * 
       * @param signer - The signer object for transaction signing
       * @param contract - The smart contract instance
       * @param address - The address of the user
         //  @param user1 - The ID of the current owner
       * @param user2 - The ID of the new owner
       * @param theProductId - The ID of the product being transferred
       * @param theOwnershipId - The current ownership ID
       * @param setIsNewOwnerModalOpen - Function to set the new owner modal open state
       * @param setIsLoading - Function to set the loading state
       * @param setProvenanceData - Function to set the provenance data
       * @param setOwnershipData - Function to set the ownership data
       * @param setTheOwnershipId - Function to set the ownership ID state
       * @param setUser2 - Function to set the user2 state
       * @param setTheProductId - Function to set the product ID state
       */
      export const newOwner = async (
        signer: Signer,
        contract: Contract,
        address: string,
        // user1: number, 
        user2: number, 
        theProductId: number, 
        // theOwnershipId: number,
        // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        // setIsNewOwnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsNewOwnerModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
        setProvenanceData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
        // setTheOwnershipId: React.Dispatch<React.SetStateAction<number>>,
        setUser2: React.Dispatch<React.SetStateAction<number>>,
        setTheProductId: React.Dispatch<React.SetStateAction<number>>,
        // fetchProvenanceData: () => Promise<void>
      ) => {
        try {
          setIsLoading(true);
          const message = "Hola, TraZableDLT pagará el gas por ti";
          const hash = hashMessage(message);
          const signature = await signMessage(message, signer);
    
          if (!contract) {
            throw new Error("Contract not found");
          }
          
          const theOwnershipId = await contract.owner_id();
          console.log("NOWS_theOwnershipId",parseInt(theOwnershipId.toString()));
          // setOwnershipId(theOwnershipId);
          
          /** Wait for state to update */
          // await new Promise(resolve => setTimeout(resolve, 0));
          
          let lastOwnership;
          /** Get provenance data of a product */
          const result = await contract.getProvenance(parseInt(theOwnershipId.toString()));
          if(!result){
            lastOwnership = 1; //////////MAL, ES NECESARIO OBTENER EL DUEÑO REAL DE ESE PRODUCTO, NO UN ID 1 PARA UNA ownership
          }else{

            setProvenanceData(result);
            console.log("NOWS_result", result);
            
            /** Get the last ownership of a product */
            lastOwnership = result[result.length - 1];
            console.log("NOWS_lastOwnership", lastOwnership);
          }
            
            /** Get the data from a ownership */
            const ownershipResult = await contract.getOwnership(lastOwnership);         
            console.log("NOWS_ownershipResult", ownershipResult);
            const [productOwnerId] = ownershipResult;
          // console.log("USER 1 in New owner", user1);
          console.log("ownershipResult in New owner", productOwnerId);

          /** Set the new owner for a product */
          const newOwnerTx = await contract.newOwner(address, hash, signature, productOwnerId, user2, theProductId, {
            gasLimit: 5000000,
          });
          await newOwnerTx.wait();

          if(newOwnerTx){
            // console.log("newOwnerTx in New owner", newOwnerTx);
            // console.log("theOwnershipId in New owner", theOwnershipId.toString());
            // console.log("OwnershipId in New owner", _ownershipId.toString());

            /** Get the data from the new ownership */
            const result = await contract.getOwnership(parseInt(theOwnershipId.toString()));
            setOwnershipData(result);
            console.log("Ownership result in New owner", result);
          // fetchOwnershipData();
          const [productId, productOwnerId, productOwnerAddress, trxTimeStamp] = result;
          
          let ownership = new Ownership(
            parseInt(productId.toString()),
            parseInt(productOwnerId.toString()),
            productOwnerAddress.toString(),
            trxTimeStamp,
            theOwnershipId.toString()
          );
          /** If the data is valid, set it in local storage */
          if (ownership.productId !== 0 && ownership.productOwnerId !== 0 && ownership.productOwnerAddress && ownership.trxTimeStamp) {
            console.log("FECHA,etc", ownership.trxTimeStamp, ownership.productId, ownership.productOwnerAddress, ownership.productOwnerId, ownership.id);
            addItemToLocalStorage(ownership, "ownership");
            // fetchProvenanceData();
          }
          toast('Product transfered successfully')
          setIsNewOwnerModalOpen(true);
          
        }
        } catch (error) {
          console.error(error);
          toast.error('Error while transfering product. Try again.')
        } finally {
          setIsLoading(false);
        }
        /** Reset new ownership's data */
        setUser2(0);
        setTheProductId(0);
      };