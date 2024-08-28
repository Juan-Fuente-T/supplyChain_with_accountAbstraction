import { ethers } from "ethers";

//COLORES: Azul bg-[#292d67] Rojo [#ca0372]
type Ownership = {
  id: string;
  productId: number;
  productOwnerId: number;
  productOwnerAddress: string;
  trxTimeStamp: string;
  };
  type Participant = {
    id: string;
    name: string;
    participantType: string;
  };
//   type Product = {
//     id: string | '';
//     modelNumber: string | '';
//     serialNumber: string | '';
//     participantName: string | '';
//     participantType: string | '';
//     productCost: number | undefined;
//     mfgTimeStamp: string | '';
//     participantAddress: string | '';
//   }

//   type ProductDataModalProps = {
//     ids: number[];
//     isTraceabilityModalOpen: boolean;
//     onRequestClose: () => void;
//     productId: number;
//     productData: Product[];
//     provenanceData: string[];
//   };


//   const ProductData: React.FC<ProductDataModalProps> = ({ ids, isTraceabilityModalOpen, productId, productData, provenanceData, onRequestClose }) => {
    export async function getTransmisionData(
        ids: ethers.BigNumberish[]
      ): Promise<{ ownerships: Ownership[], participants: Participant[] }> {    
        // const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    // const [participants, setParticipants] = useState<Map<number, Participant>>(new Map());
    // const [participants, setParticipants] = useState<Participant[]>([]);
    // const [productOwnerIds, setPproductOwnerIds] = useState<number[]>([]);

    
    // let _participants: (string | null)[] = [];
   
      // const fetchData = () => {
        // if (!isTraceabilityModalOpen) {
        //     return { ownerships: [], participants: [] };
        //   }

    //   if (isTraceabilityModalOpen) {
        const allOwnershipIds: string[] = JSON.parse(localStorage.getItem('ownershipIds') || '[]');
        const allParticipantsIds: string[] = JSON.parse(localStorage.getItem('participantIds') || '[]');
        
        const filteredIds = allOwnershipIds.filter(id => ids?.some(num => id.startsWith(`ownership-${num}-`)));
        
        const fetchedOwnerships = filteredIds.map(id => {
          const ownershipData = localStorage.getItem(id);
          return ownershipData ? JSON.parse(ownershipData) : null;
        }).filter((ownership): ownership is Ownership => ownership !== null);
        
        // setOwnerships(fetchedOwnerships);
        console.log("allOwnershipIds",allOwnershipIds)
        console.log("fetchedOwnerships",fetchedOwnerships)
        console.log("allParticipantsIds",allParticipantsIds)
        /////////////
        // Obtener los productIds de fetchedOwnerships
        const productOwnerIds = fetchedOwnerships.map(ownership => ownership.productOwnerId);
        // Filtrar participantIds basados en los productIds
        console.log("productOwnerIds", productOwnerIds); // Verifica los productIds aquí
        
        const filteredParticipants = allParticipantsIds.filter(id => {
          return productOwnerIds.some(productOwnerId => id.startsWith(`participant-${productOwnerId}-`));
        });
        console.log("filteredParticipants", filteredParticipants);
        ////////////
        // const filteredParticipants = allParticipantsIds.filter(id => ids.some(num => id.startsWith(`participant-${fetchedOwnerships.productOwnerId}`)));
        // console.log("XXfilteredParticipants",filteredParticipants)
        // const fetchedParticipants = filteredParticipants.map(id => {
          //   const participantData = localStorage.getItem(id);
          //   console.log("XXfetchedOwnerships",participantData)
          //   return participantData ? JSON.parse(participantData) : null;
          // }).filter((participant): participant is Participant => participant !== null);
          // setParticipants(fetchedParticipants);
          // console.log("XXfetchedParticipants",fetchedParticipants);
          
          
          // Obtener los datos de los participantes
          const fetchedParticipants = filteredParticipants.map(id => {
            const participantData = localStorage.getItem(id);
            // _participants.push(participantData);
            console.log("fetchedParticipantData", participantData);
            return participantData ? JSON.parse(participantData) as Participant  : null;
          }).filter((participant): participant is Participant => participant !== null);
          
        //   setParticipants(fetchedParticipants);
          console.log("fetchedParticipants", fetchedParticipants);
        
        // };
        // fetchData();
        return { ownerships: fetchedOwnerships, participants: fetchedParticipants };
  }

 