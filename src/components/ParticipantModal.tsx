import React from "react";
import Modal from "react-modal";


/**
 * Props for the ParticipantModal component.
 */
type ParticipantModalProps = {
  isParticipantModalOpen: boolean /** Boolean to control if the modal is open */;
  onRequestClose: () => void /** Function to close the modal */;
  participantId: number /** ID of the participant */;
  participantData: [string, string, string] | null/** Array containing participant data */;
};

/**
 * ParticipantModal Component
 *
 * This component displays a modal with details about a newly added participant.
 * It shows the participant's name, type, and account ID.
 *
 * @param props - The props of type ParticipantModalProps
 * @returns A React Functional Component
 */
const ParticipantModal: React.FC<ParticipantModalProps> = ({
  participantId,
  participantData,
  isParticipantModalOpen,
  onRequestClose,
}) => {
  /** Checks if there's no participant data or ID, for don't render anything */
  if (!participantId || !participantData) return null;

  //POSIBLE FUTURO MODAL PARA VALIDACION DE DATOS
    // if (!participantData || !participantId) {
    //   return (
    //     <Modal
    //       isOpen={isParticipantModalOpen}
    //       onRequestClose={onRequestClose}
    //       contentLabel="Error en detalles del proveedor"
    //       aria-labelledby="error-modal-title"
    //       role="dialog"
    //     >
    //       <h2 id="error-modal-title" className="text-red-500">Error: No se encontraron datos del proveedor</h2>
    //       <div className="flex flex-col justify-self-end">
    //     <button
    //       onClick={onRequestClose}
    //       className="px-3  bg-[#ca0372] text-white self-end border-2 border-stone-800 rounded-md hover:scale-105 transition-all disabled:opacity-80 text-4xl font-semibold"
    //     >
    //       x
    //     </button>
    //   </div>
    //     </Modal>
    //   );
    // }
  
    // /** Verifica si participantData tiene la estructura esperada */
    // const hasValidData = Array.isArray(participantData) && participantData.length >= 3;

  return (
    <Modal
    className="flex flex-wrap flex-col place-content-center py-4 px-4 m-auto mt-24 w-5/6  sm:w-2/3 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gray-50 border-2 border-stone-800 rounded-md"
      isOpen={isParticipantModalOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de producto"
      appElement={document.getElementById("root") || undefined}
    >
      <h2 className="p-2 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md text-xl md:text-2xl font-semibold">
        Se ha añadido exitosamente este proveedor:
      </h2>
      {participantData && (
        <div className="bg-[#292d67] my-4 m-auto border-gray-300 rounded-lg p-4 shadow-md text-white text-xl sm:text-2xl md:text-3xl w-full flex flex-col place-content-center">
          <p>Nombre: {participantData[0]}</p>
          <p>Tipo de Proveedor: {participantData[1]}</p>
          <p>Id de cuenta: {participantData[2]}</p>
        </div>
      )}
      <div className="flex flex-col justify-self-end">
        <button
          onClick={onRequestClose}
          className="px-3 bg-[#ca0372] text-white self-end border-2 border-stone-800 rounded-md hover:scale-105 transition-all disabled:opacity-80 text-4xl font-semibold"
        >
          x
        </button>
      </div>
    </Modal>
  );
};

export default ParticipantModal;

//Colores personalizacion del modal //COLORES: Azul bg-[#292d67] Rojo bg-[#ca0372]
