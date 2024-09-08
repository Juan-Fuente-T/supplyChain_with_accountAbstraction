import React from 'react';
import Modal from 'react-modal';
import formatDate  from  '../utils/FormatDate';

// type Product = {
//     id: string;
//     modelNumber: string;
//     serialNumber: string;
//     participantName: string;
//     participantType: string;
//     productCost: number;
//     mfgTimeStamp: Date;
//     participantAddress: string;
//   };

  type ProductModalProps = {
    isProductModalOpen: boolean;
    onRequestClose: () => void;
    productId: number;
    productData: any[];
  };


const ProductModal: React.FC<ProductModalProps> = ({ productId, productData, isProductModalOpen, onRequestClose}) => { 
  if (!productData || !productId) return null;

  return (
    <Modal className="flex flex-wrap flex-col place-content-center py-4 px-4 m-auto mt-24 w-5/6  sm:w-2/3 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gray-50 border-2 border-stone-800 rounded-md"
    isOpen={isProductModalOpen}
    onRequestClose={onRequestClose}
    contentLabel="Detalles de producto"
    appElement={document.getElementById('root') || undefined}
  >
    <h2 className="py-1 px-2 bg-blue-300 text-stone-800 border-2 border-stone-800 p-2 rounded-md text-lg font-semibold text-xl sm:text-2xl">
      Se ha añadido exitosamente este producto:
    </h2>

    {productData && (
      <div className="bg-[#292d67] my-4 m-auto border-gray-300 rounded-lg p-4 shadow-md text-white text-xl sm:text-2xl md:text-3xl w-full flex flex-col place-content-center">
       <p>Id del producto: {productId}</p>
        <p>Modelo: {productData[0]}</p>
        <p>Número de serie: {productData[1]}</p>
        <p>Proveedor: {productData[2]}</p>
        <p>Tipo: {productData[3]}</p>
        <p>Costo: {productData[4].toString()}</p>
        <p>Fecha de alta: {formatDate(productData[5])}</p>  
       </div> 
     )}
      <div className="flex flex-col justify-self-end">
      <button onClick={onRequestClose} className="py-2 px-12 pd-20 w-14 h-14 bg-[#ca0372] text-white self-end border-2 border-stone-800 rounded-md hover:scale-105 transition-all disabled:opacity-80 text-6xl font-semibold">
        x</button>
      </div>
    </Modal>
  );
};

export default ProductModal;