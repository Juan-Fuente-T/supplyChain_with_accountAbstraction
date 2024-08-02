import React from 'react';
import Modal from 'react-modal';

type Product = {
    id: string;
    modelNumber: string;
    serialNumber: string;
    participantName: string;
    participantType: string;
    productCost: number;
    mfgTimeStamp: Date;
    participantAddress: string;
  };

const ProductModal: React.FC<{ product: Product | null, isOpen: boolean, onRequestClose: () => void }> = ({ product, isOpen, onRequestClose }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Product Details">
      <h2>Product Details</h2>
      <p>ID: {product.id}</p>
      <p>Model Number: {product.modelNumber}</p>
      <p>Serial Number: {product.serialNumber}</p>
      <p>Participant Name: {product.participantName}</p>
      <p>Participant Type: {product.participantType}</p>
      <p>Product Cost: {product.productCost}</p>
      <p>Manufacturing Timestamp: {product.mfgTimeStamp?.toString()}</p>
      <p>Participant Address: {product.participantAddress}</p>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ProductModal;