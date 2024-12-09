import { Contract } from "ethers";
import { addItemToLocalStorage, initializeExistingPrefixes, findItemsByInitialNumbers }from './StorageFuntions';
import { Participant, Ownership } from './Types';
import { NamedTupleMember } from "typescript";

export const fetchParticipantData = async (
    contract: Contract,
    participantId: number,
    ownershipId: number,
    // participant: Participant,
    setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
) => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result: any = await contract?.getParticipant(participantId);
      if (result && result.length === 3) {
        const [participantName, participantType, productOwnerAddress] = result;
        console.log("Participant Name:", participantName);
        console.log("Participant Type:", participantType);
        console.log("Product Owner Address:", productOwnerAddress);
        if (participantName.trim() !== '' && participantType.trim() !== '' && productOwnerAddress !== '0x0000000000000000000000000000000000000000') {
          setParticipantData(result);
  
          let participant = new Participant(
            participantName.toString(),
            participantType.toString(),
            productOwnerAddress.toString(),
            participantId.toString()
          );
          console.log("Participant Object:", participant);
          if (participant.name.trim() !== '' && participant.participantType.trim() !== '' && participant.participantAddress !== '0x0000000000000000000000000000000000000000') {           
             addItemToLocalStorage(participant, "participant");
          } else {
            console.error("Invalid participantId data:", participant);
          }
        } else {
          console.error("Invalid data received from contract:", result);
        }
      } else {
        console.error("No valid data found for participant ID:", ownershipId);
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
    }
  };

  export const fetchProductData = async (
    contract: Contract,
    productId: number,
    setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
    setParticipant_type: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result = await contract.getProduct(productId);
      if (result) {
        setProductData(result);
        setParticipant_type(result ? (result[3]).toString() : '');
       
        // let product = new Product( 
        //   result ? (result[0]).toString() : '',
        //   result ? (result[1]).toString() : '',
        //   result ? (result[2]).toString() : '',
        //   result ? (result[3]).toString() : '',
        //   result ? (result[4]).toString() : 0,
        //   result ? (result[5]).toString() : 0, 
        //   result ? (result[6]).toString() : '',
        //   productId.toString())
        // console.log("SET_ITEM_DATA:", product.id, JSON.stringify(product));
        // addItemToLocalStorage(product, "product");
      } else {
        console.error("No data found for product ID:", productId);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  export const fetchProvenanceData = async (
    contract: Contract,
    productId: number,
    provenanceData: any[],
    setProvenanceData: React.Dispatch<React.SetStateAction<any[] | undefined>>,
    setIsTraceabilityModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    console.log("INICIO fetchProvenanceData");
    const result = await contract?.getProvenance(productId);
    // fetchProductData()
    setProvenanceData(result);
    console.log("PROVENANCE RESULT", result);
    console.log("PROVENANCE DATA", provenanceData);
    setIsTraceabilityModalOpen(true);
  };

  export const fetchOwnershipData = async (
    contract: Contract,
    ownershipId: number,
    setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>
  ) => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result = await contract?.getOwnership(ownershipId);
      if (result && result.length === 4) {
      const [productId, productOwnerId, productOwnerAddress, trxTimeStamp] = result;

      // Validar que los valores no sean 0 o la dirección no sea la dirección nula
      if (productId !== 0 && productOwnerId !== 0 && productOwnerAddress !== '0x0000000000000000000000000000000000000000') {

        setOwnershipData(result);
        let ownership = new Ownership(
          parseInt(productId.toString()),
          parseInt(productOwnerId.toString()),
          productOwnerAddress.toString(),
          trxTimeStamp,
          ownershipId.toString()
        );
        // Validar que ownership no sea vacío
        if (ownership.productId !== 0 && ownership.productOwnerId !== 0 && ownership.productOwnerAddress && ownership.trxTimeStamp) {
          
          addItemToLocalStorage(ownership, "ownership");
          // return ownership;
        } else {
          console.error("Invalid ownership data:", ownership);
        }
      } else {
        console.error("No data found for ownership ID:", productId);
      }
      } else {
        console.error("No valid data found for ownership ID:", ownershipId);
      }
    }catch (error) {
      console.error("Error fetching ownership data:", error);
    }
    // localStorage.setItem(ownership.id, JSON.stringify(ownership));
  }