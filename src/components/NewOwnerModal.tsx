import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useUserContext } from "../contexts/UserContext";
import formatDate from "../utils/FormatDate";

/**
 * Props for the NewOwnerModal component.
 */
type NewOwnerModalProps = {
  isNewOwnerModalOpen: boolean; /** Boolean to control if the modal is open */
  onRequestClose: () => void; /** Function to close the modal */
  ownershipData: any[]; /** Array of ownership data */
};

/**
 * NewOwnerModal Component
 * 
 * This component displays a modal for setting a new owner for a product.
 * It fetches and displays information about the current and new owners.
 * 
 * @param props - The props of type NewOwnerModalProps
 * @returns A React Functional Component
 */
const NewOwnerModal: React.FC<NewOwnerModalProps> = ({
  ownershipData, 
  isNewOwnerModalOpen,
  onRequestClose,
}) => {
  /** State to store fetched participant data */
  const [fetchedParticipants, setFetchedParticipants] = useState<any | null>(
    null
  );
  /** User context for managing user and ownership data */
  const { user1, setUser1, theOwnershipId, setTheOwnershipId } =
    useUserContext();

  /** Effect to update ownership ID when modal opens */
  useEffect(() => {
    if (isNewOwnerModalOpen) {
      /** Update the ownershipId only if the modal is opened */
      setTheOwnershipId(theOwnershipId);
    }
  }, [isNewOwnerModalOpen, theOwnershipId, setTheOwnershipId]);

  /** Effect to fetch participant data when modal opens */
  useEffect(() => {
    if (isNewOwnerModalOpen) {
      /** Update the participant data only if the modal is opened */
      const allParticipantIds: string[] = JSON.parse(
        localStorage.getItem("participantIds") || "[]"
      );

      /** Array of participant IDs to fetch (current owner and new owner) */
      const participantIdsToFetch = [
        user1.toString(),
        ownershipData[1].toString(),
      ];

      /** Filter participant IDs to only include those that start with the IDs we're interested in
     This ensures we only fetch data for the current owner and the new owner */
      const filteredParticipantIds = allParticipantIds.filter((id) => {
        return participantIdsToFetch.some((participantId) =>
          id.startsWith(`participant-${participantId}-`)
        );
      });

      /** Get participant data from local storage*/
      const participantsData: any[] = [];
      if (filteredParticipantIds) {
        filteredParticipantIds.forEach((id) => {
          const participantData = localStorage.getItem(id);
          if (participantData) {
            participantsData.push(JSON.parse(participantData));
          }
        });
        setFetchedParticipants(participantsData);
      }
    }
  }, [isNewOwnerModalOpen, theOwnershipId, user1, ownershipData]);

  /**
   * Handles closing the modal and resetting user1
   */
  const handleCloseModal = () => {
    onRequestClose();
    setUser1(0); // Reset user1 when closing modal
  };

  /** Checks if data is not ready */
  if (!ownershipData || fetchedParticipants?.length < 2 || user1 === null)
    return null;

  /** Find the old (current) participant */
  const oldParticipant = fetchedParticipants?.find(
    (participant: { id: string }) =>
      participant.id.startsWith(`participant-${user1.toString()}`)
  );

  /** Find the new participant */
  const newParticipant = fetchedParticipants?.find(
    (participant: { id: string }) =>
      participant.id.startsWith(`participant-${ownershipData[1].toString()}`)
  );

  return (
    <Modal
    className="flex flex-wrap flex-col place-content-center py-4 px-4 m-auto mt-24 w-5/6  sm:w-2/3 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gray-50 border-2 border-stone-800 rounded-md"
    isOpen={isNewOwnerModalOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Detalles de transferencia de producto"
      appElement={document.getElementById("root") || undefined}
    >
      <h2 className="p-2 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md text-xl md:text-2xl  font-semibold">
        Se ha movido el producto numero {ownershipData[0].toString()}:
      </h2>
      {ownershipData && fetchedParticipants && (
        <div className="bg-[#292d67] my-4 m-auto border-gray-300 rounded-lg p-4 shadow-md text-white text-xl sm:text-2xl md:text-3xl w-full flex flex-col place-content-center">
          {/* <p>ID: {product.id}</p> */}
          <p>Número de intercambio: {theOwnershipId.toString()}</p>
          <p>Antiguo proveedor: {oldParticipant?.name}</p>
          <p>Nuevo proveedor: {newParticipant?.name}</p>
          <p>Numero de producto: {ownershipData?.[0].toString()}</p>
          <p>Fecha: {formatDate(ownershipData?.[3]).toString()}</p>
          {/* <p>Nombre: {participantData[0]}</p>
          <p>Tipo de Proveedor: {participantData[1]}</p>
          <p>Id de cuenta: {participantData[2]}</p> */}
        </div>
      )}
      <div className="flex flex-col justify-self-end">
        <button
          onClick={handleCloseModal}
          className="px-3 bg-[#ca0372] text-white self-end border-2 border-stone-800 rounded-md hover:scale-105 transition-all disabled:opacity-80 text-4xl font-semibold"
        >
          x
        </button>
      </div>
    </Modal>
  );
};

export default NewOwnerModal;

//Colores personalizacion del modal: Azul bg-[#292d67] Rojo bg-[#ca0372]