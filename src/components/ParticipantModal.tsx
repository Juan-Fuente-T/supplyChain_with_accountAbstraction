import React from 'react';
import Modal from 'react-modal';
import formatDate  from  '../utils/FormatDate';


  type ProductModalProps = {
    isParticipantModalOpen: boolean;
    onRequestClose: () => void;
    participantId: number;
    participantData: any[];
  };


const ParticipantModal: React.FC<ProductModalProps> = ({ participantId, participantData, isParticipantModalOpen, onRequestClose}) => { 
  if (!participantData || !participantId) return null;

  return (
    <Modal className="flex flex-wrap flex-col place-content-center py-4 px-4 m-auto mt-24 w-5/6  sm:w-2/3 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gray-50 border-2 border-stone-800 rounded-md"
    isOpen={isParticipantModalOpen} onRequestClose={onRequestClose} contentLabel="Detalles de producto" appElement={document.getElementById('root') || undefined}>
      <h2 className="py-1 px-2 bg-[#ca0372] text-white border-2 border-stone-800 p-2 rounded-md text-l font-semibold text-2xl">
        Se ha añadido exitosamente este proveedor:</h2>
      {/* <p>ID: {product.id}</p> */}
      {participantData && (
       <div className="bg-[#292d67] my-4 m-auto border-gray-300 rounded-lg p-4 shadow-md text-xl sm:text-2xl text-white md:text-3xl w-full flex flex-col place-content-center">
        <p>Nombre: {participantData[0]}</p>
        <p>Tipo de Proveedor: {participantData[1]}</p>
        <p>Id de cuenta: {participantData[2]}</p>
       </div> 
     )}
      <div className="flex flex-col justify-self-end">
      <button onClick={onRequestClose} className="px-3  bg-[#ca0372] text-white self-end border-2 border-stone-800 rounded-md hover:scale-105 transition-all disabled:opacity-80 text-4xl font-semibold">
        x</button>
      </div>
    </Modal>
  );
};

export default ParticipantModal;

//Colores personalizacion del modal //COLORES: Azul bg-[#292d67] Rojo bg-[#ca0372]