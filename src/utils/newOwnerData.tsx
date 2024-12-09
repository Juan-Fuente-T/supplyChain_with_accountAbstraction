import { ethers } from "ethers";

/** Represents the structure of an ownership record */
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

/**
 * Retrieves transmission data based on ownership IDs.
 *
 * This function fetches ownership and participant data from localStorage,
 * processes it, and returns structured data for use in other components.
 *
 * @param ownershipIds - An array of ownership IDs to fetch data for
 * @returns A promise that resolves to an object containing:
 *          - transmisionDataArray: An array of structured data with Date, Participant, and Class
 *          - filteredIds: An array of filtered ownership IDs
 */
export async function getNewOwnerData(
  ownershipIds: ethers.BigNumberish[]
): Promise<{
  newOwnerDataArray: {
    Fecha: string;
    Participante: string;
    Clase: string;
  }[];
  filteredIds: string[];
}> {
  /** Retrieve all ownership IDs from localStorage */
  const allOwnershipIds: string[] = JSON.parse(
    localStorage.getItem("ownershipIds") || "[]"
  );
  /** Retrieve all participant IDs from localStorage */
  const allParticipantsIds: string[] = JSON.parse(
    localStorage.getItem("participantIds") || "[]"
  );
  /** Convert BigNumberish IDs to strings */
  const ids = ownershipIds.map((id) => id.toString());
  /** Filter ownership IDs based on the provided IDs */
  const filteredIds = allOwnershipIds.filter((id) =>
    ids?.some((num) => id.startsWith(`ownership-${num}-`))
  );
  /** Fetch ownership data from localStorage */
  const fetchedOwnerships = filteredIds
    .map((id) => {
      const ownershipData = localStorage.getItem(id);
      return ownershipData ? JSON.parse(ownershipData) : null;
    })
    .filter((ownership): ownership is Ownership => ownership !== null);

  /** Extract product owner IDs from fetched ownerships */
  const productOwnerIds = fetchedOwnerships.map(
    (ownership) => ownership.productOwnerId
  );
  /** Filter participant IDs based on product owner IDs */
  const filteredParticipants = allParticipantsIds.filter((id) => {
    return productOwnerIds.some((productOwnerId) =>
      id.startsWith(`participant-${productOwnerId}-`)
    );
  });

  /** Fetch participant data from localStorage */
  const fetchedParticipants = filteredParticipants
    .map((id) => {
      const participantData = localStorage.getItem(id);
      return participantData
        ? (JSON.parse(participantData) as Participant)
        : null;
    })
    .filter((participant): participant is Participant => participant !== null);

  /** Match ownerships with their corresponding participants */
  const participantPerOwnership = fetchedOwnerships.map((ownership) => {
    const correspondingParticipant = fetchedParticipants.find((participant) =>
      participant.id.startsWith(`participant-${ownership.productOwnerId}-`)
    );
    // return { ownerships: fetchedOwnerships, participants: fetchedParticipants};
    return { ownership, participant: correspondingParticipant || null };
  });

  /** Generate structured data for use in other components */
  const newOwnerDataArray = participantPerOwnership.map((data) => ({
    Fecha: data.ownership ? data.ownership.trxTimeStamp : "Fecha desconocida",
    Participante: data.participant ? data.participant.name : "Desconocido",
    Clase: data.participant
      ? data.participant.participantType
      : "Clase desconocida",
  }));

  // return { transmisionDataArray, participantPerOwnership };
  return {newOwnerDataArray, filteredIds };
}
//Expected input and output:
//Ownership example
// {
//   "id": "ownership-7-599b660d-cac0-456a-b4d7-8a61859e764b",
//   "productId": "2",
//   "productOwnerId": "3",
//   "productOwnerAddress": "0xe67F18c5064f12470Efc943798236edF45CF3Afb",
//   "trxTimeStamp": "30/07/2024"
// }

//Participant example
// {
//       "id": "participant-5-693ef050-8c92-4037-9cc3-ee4b6b27630d",
//       "name": "Dani",
//       "participantType": "Consumer",
//       "participantAddress": "0xe67F18c5064f12470Efc943798236edF45CF3Afb"
//     }

//Result of function getTransmisionData could be:

// transmisionDataArray:
// [
//   {
//     "Fecha": "30/07/2024",
//     "Participante": "Dani",
//     "Clase": "Consumer"
//   }
// ]

// participantPerOwnership:

// [
//   {
//     "ownership": {
//       "id": "ownership-7-599b660d-cac0-456a-b4d7-8a61859e764b",
//       "productId": "2",
//       "productOwnerId": "3",
//       "productOwnerAddress": "0xe67F18c5064f12470Efc943798236edF45CF3Afb",
//       "trxTimeStamp": "30/07/2024"
//     },
//     "participant": {
//       "id": "participant-5-693ef050-8c92-4037-9cc3-ee4b6b27630d",
//       "name": "Dani",
//       "participantType": "Consumer",
//       "participantAddress": "0xe67F18c5064f12470Efc943798236edF45CF3Afb"
//     }
//   }
// ]
