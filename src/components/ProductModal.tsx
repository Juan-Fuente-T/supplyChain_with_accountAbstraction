import React from "react";
import Modal from "react-modal";
import formatDate from "../utils/FormatDate";

/**
 * Props for the ProductModal component.
 */
type ProductModalProps = {
  isProductModalOpen: boolean /** Controls whether the modal is open */;
  onRequestClose: () => void /** Function to close the modal */;
  productId: number /** ID of the product */;
  productData: [
    number,
    string,
    string,
    string,
    string,
    number,
    string
  ] /** Array containing product data */;
};

/**
 * ProductModal Component
 *
 * This component displays a modal with details about a newly added product.
 * It shows the product's ID, model, serial number, provider, type, cost, and creation date.
 *
 * @param props - The props of type ProductModalProps
 * @returns A React Functional Component
 */
const ProductModal: React.FC<ProductModalProps> = ({
  productId,
  productData,
  isProductModalOpen,
  onRequestClose,
}) => {
  //TODO: Añadir mejores validaciones de datos

  // Checks if there's no product data or ID, for don't render anything
  if (!productData || !productId) return null;

  return (
    <Modal
      className="flex flex-wrap flex-col place-content-center py-4 px-4 m-auto mt-24 w-5/6  sm:w-2/3 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gray-50 border-2 border-stone-800 rounded-md"
      isOpen={isProductModalOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de producto"
      appElement={document.getElementById("root") || undefined}
    >
      <h2 className="p-2 bg-[#ca0372] text-white border-2 border-stone-800 rounded-md text-xl md:text-2xl font-semibold">
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
          <p>Fecha de alta: {formatDate(BigInt(productData[5].toString()))}</p>
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

export default ProductModal;
