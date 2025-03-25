import React, { useEffect, useState } from "react";
import Modal from "react-modal";

/**
 * Represents the structure of an ownership record.
 */
type Ownership = {
  id: string;
  productId: number;
  productOwnerId: number;
  productOwnerAddress: string;
  trxTimeStamp: string;
};

/**
 * Represents the structure of a participant.
 */
type Participant = {
  id: string;
  name: string;
  participantType: string;
};

/**
 * Represents the structure of a product
 */
type Product = {
  id: string | "";
  modelNumber: string | "";
  serialNumber: string | "";
  participantName: string | "";
  participantType: string | "";
  productCost: number | undefined;
  mfgTimeStamp: string | "";
  participantAddress: string | "";
};

/**
 * Props for the TraceabilityModal component.
 */
type TraceabilityModalProps = {
  ids: number[] /** Array of IDs related to the traceability */;
  isTraceabilityModalOpen: boolean /** Controls whether the modal is open */;
  onRequestClose: () => void /** Function to close the modal */;
  productId: number /** ID of the product */;
  productData: Product[] /** Array of product data */;
  provenanceData: string[] /** Array of provenance data */;
};

/**
 * TraceabilityModal Component
 *
 * This component displays a modal with traceability information for a product,
 * including ownership history and participant details.
 *
 * @param props - The props of type TraceabilityModalProps
 * @returns A React Functional Component
 */
const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  ids,
  isTraceabilityModalOpen,
  productId,
  productData,
  provenanceData,
  onRequestClose,
}) => {
  const [ownerships, setOwnerships] = useState<Ownership[]>(
    []
  ); /** State to store ownership data */
  const [participants, setParticipants] = useState<Participant[]>(
    []
  ); /** State to store participant data */

  /** Temporary array to store participant data as strings */
  let _participants: (string | null)[] = [];

  useEffect(() => {
    if (isTraceabilityModalOpen) {
      /** Get ownership IDs from localStorage */
      const allOwnershipIds: string[] = JSON.parse(
        localStorage.getItem("ownershipIds") || "[]"
      );
      /** Get participants IDs from localStorage */
      const allParticipantsIds: string[] = JSON.parse(
        localStorage.getItem("participantIds") || "[]"
      );

      /** Filter ownership IDs based on the provided ids */
      const filteredIds = allOwnershipIds.filter((id) =>
        ids?.some((num) => id.startsWith(`ownership-${num}-`))
      );
      /** Fetch ownership data */
      const fetchedOwnerships = filteredIds
        .map((id) => {
          const ownershipData = localStorage.getItem(id);
          return ownershipData ? JSON.parse(ownershipData) : null;
        })
        .filter((ownership): ownership is Ownership => ownership !== null);

      setOwnerships(fetchedOwnerships);
      /** Get productOwnerIds from fetchedOwnerships */
      const productOwnerIds = fetchedOwnerships.map(
        (ownership) => ownership.productOwnerId
      );

      /** Filter participant IDs based on productOwnerIds */
      const filteredParticipants = allParticipantsIds.filter((id) => {
        return productOwnerIds.some((productOwnerId) =>
          id.startsWith(`participant-${productOwnerId}-`)
        );
      });

      /** Fetch participant data */
      const fetchedParticipants = filteredParticipants
        .map((id) => {
          const participantData = localStorage.getItem(id);
          _participants.push(participantData);
          return participantData
            ? (JSON.parse(participantData) as Participant)
            : null;
        })
        .filter(
          (participant): participant is Participant => participant !== null
        );

      setParticipants(fetchedParticipants);
    }
  }, [ids, isTraceabilityModalOpen]);

  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 w-fit max-w-4/6">
    {/* <div className="flex flex-col"> */}
      <Modal
        className="flex flex-col modal-custom [&.modal-custom]:w-5/6 md:[&.modal-custom]:w-[90vw] xl:[&.modal-custom]:w-[70vw] verflow-y-auto"
        // <Modal className="m-auto bg-opacity-60 flex flex-wrap flex-col justify-center p-4 px-12  mx-4 w-min-1/3 w-fit bg-gray-50 border-2 border-stone-800 rounded-md"
        isOpen={isTraceabilityModalOpen}
        onRequestClose={onRequestClose}
        contentLabel="Product Traceability Details"
        appElement={document.getElementById("root") || undefined}
      >
        <h2 className="p2 w-fit  bg-[#ca0372] text-white border-2 border-stone-800 p-2 rounded-md text-base md:text-l font-semibold">
          Trazabilidad del producto {productId}
        </h2>
        <p className="mt-2 text-white">
          Lista de transferencias:{" "}
          {provenanceData?.map((num) => num.toString()).join(", ")}
        </p>
        {ownerships.length === 0 ? (
          <p className="mb-2 text-white">No hay transferencias de producto.</p>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 overflow-y-auto">
            {ownerships.map((ownership, index) => {
              const correspondingParticipant = participants.find(
                (participant) =>
                  participant.id.startsWith(
                    `participant-${ownership.productOwnerId}-`
                  )
              );

              return (
                <div
                  key={index}
                  className="bg-gray-100 my-4 border border-gray-300 rounded-lg p-4 w-fit md:w-52 shadow-md"
                >
                  <p className="font-semibold">Fecha: {ownership?.trxTimeStamp}</p>
                  {correspondingParticipant ? (
                    <>
                      <p className="mt-1">{correspondingParticipant.name}</p>
                      <p className="text-gray-600">{correspondingParticipant.participantType}</p>
                    </>
                  ) : (
                    <p className="text-red-500">No se encontró el participante correspondiente.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex mt-4 justify-end">
        <button
    onClick={onRequestClose}
    className="px-3 py-1 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md hover:bg-white hover:text-[#292d67] transition-all disabled:opacity-80 text-2xl font-semibold"
  >
    x
  </button>
        </div>
      </Modal>
    </div>
  );
};
export default TraceabilityModal;

//COLORES del modal: Azul bg-[#292d67] Rojo [#ca0372]
