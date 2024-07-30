import React from 'react';
// import '../App.css';
// import './App.css';

// interface ProductData {
//   modelNumber: string;
//   serialNumber: string;
//   participantName: string;
//   participantType: string;
//   cost: number;
//   fgTimeStamp: number;
//   productOwnerAddress: string;
// }
// interface OwnershipData {
//   productId: number,
//   productOwnerId: number,
//   productOwnerAddress: string
//   trxTimeStamp: number
// }
// interface ParticipantData {
//   userName: string,
//   participantType: string,
//   participantAddress: string
// }

interface ProductEntryProps {
  name: string;
  pass: string;
  participantAddress: any;
  participantType: string;
  modelNumber: string;
  serialNumber: string;
  productCost :number;
  isLoading: boolean;
  user1: number;
  user2: number;
  theProductId: number;
  ownerId: number,
  setName: React.Dispatch<React.SetStateAction<string | ''>>; // Ajuste para el tipo correcto
  setPass: React.Dispatch<React.SetStateAction<string| ''>>; // Ajuste para el tipo correcto
  setParticipantAddress: React.Dispatch<React.SetStateAction<any | ''>>; // Ajuste para el tipo correcto
  setParticipantType: React.Dispatch<React.SetStateAction<string | ''>>; // Corrección en el nombre y ajuste para el tipo correcto
  setOwnerId: React.Dispatch<React.SetStateAction<number>>; // Ajuste para el tipo correcto
  setModelNumber: React.Dispatch<React.SetStateAction<string | ''>>; // Corrección en el nombre y ajuste para el tipo correcto
  setSerialNumber: React.Dispatch<React.SetStateAction<string | ''>>; // Corrección en el nombre y ajuste para el tipo correcto
  setProductCost: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  setUser1: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  setUser2: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  setTheProductId: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  addParticipant: React.Dispatch<React.SetStateAction<any | undefined>>;
  addProduct: React.Dispatch<React.SetStateAction<any | undefined>>;
  newOwner: React.Dispatch<React.SetStateAction<any | undefined>>;
}

const DataEntry: React.FC<ProductEntryProps> = ({
  name,
  pass,
  participantAddress,
  participantType,
  ownerId,
  modelNumber,
  serialNumber,
  productCost,
  isLoading,
  user1,
  user2,
  theProductId,
  setName,
  setPass,
  setParticipantAddress,
  setParticipantType,
  setOwnerId,
  setModelNumber,
  setSerialNumber,
  setProductCost,
  setUser1,
  setUser2,
  setTheProductId,
  addParticipant,
  addProduct,
  newOwner
  // fetchOwnershipData,
  // fetchParticipantData
}) => {  return (

// const ProductEntry = ({ name, pass, participantAddress, participantType, ownerId, modelNumber, serialNumber, productCost, user1, user2, theProductId, setName, setPass, setParticipantAddress, setParticipantType,setOwnerId, setModelNumber, setSerialNumber, setProductCost, setUser1, setUser2, setTheProductId }) => {
// }) => {  return (
  <div className=" flex flex-col flex-center m-auto w-full justify-evenly gap-2 p-2 text-stone-800">     
  <div className="flex flex-col justify-between gap-2 ">
      {/* Aquí va el contenido de la sección de entrada de datos del producto */}
      <div className="flex flex-row justify-between place-items-center p-1 m-auto w-full max-w-6xl border-2 border-stone-800 rounded-md">
      <h1 className="md:text-3xl w-auto">
        Entrada de datos</h1>
      <img src="trazable2.png" className={`h-10 w-60 rounded-md`} alt="TrazableDLT logo m2"/>
      </div>
      <div className="flex flex-col flex-center m-auto w-full max-w-6xl justify-evenly gap-2 ">

      {/* Sección de entrada de datos del participante */}
      <div></div>
      <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row justify-evenly gap-2">
        {/* <div className="flex flex-col w-full max-w-xs"> */}
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Nombre de proveedor:</label>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base text-stone-800 md:text-xl"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Password:</label>
          <input
            type="text"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
          />
        </div>

        </div>
        <div className="flex flex-row gap-2 justify-evenly">

        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="name">Cuenta del proveedor:</label>
          <input
            type="text"
            placeholder="Cuenta del proveedor"
            value={participantAddress}
            onChange={(e) => setParticipantAddress(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col w-full max-w-md">
          <label htmlFor="pass">Tipo de proveedor:</label>
          <input
            type="text"
            placeholder="Tipo de proveedor"
            value={participantType}
            onChange={(e) => setParticipantType(e.target.value)}
            className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full flex-grow text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
            />
        </div>
        </div>
        </div>
        <div className="content-end">
        <button
          className="py-1 px-3 h-12 w-56 mt-4 bg-orange-500 text-stone-800 border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={addParticipant}
          disabled={isLoading || !name || !pass || !participantAddress || !participantType}
        >
          {isLoading ? 'Añadiendo proveedor...' : '📤 Añadir proveedor'}
        </button>
      </div>
      </div>
      
      {/* Sección de entrada de datos del producto */}
      <div className="flex flex-row justify-between gap-2 w-full">
        {/* <div className="flex flex-row justify-strech w-full gap-4 mb-4 "> */}
        <div className="w-full flex flex-row flex-grow gap-1">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="ownerId">Id del fabricante:</label>
          <input
            type="number"
            placeholder="Número de Id del fabricante"
            value={ownerId}
            min="0"
            onChange={(e) => setOwnerId(parseInt(e.target.value))}
            // className="w-28 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-28 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-stone-800"
            style={{fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <label htmlFor="modelNumber">Número de modelo:</label>
          <input
            type="text"
            placeholder="Número del producto"
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            className="flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col flex-grow">
          <label htmlFor="serialNumber">Número de serie:</label>
          <input
            type="text"
            placeholder="Número de serie del producto" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-stone-800"
            style={{fontSize: '20px' }}
          />
          </div>
          <div className="flex flex-col max-w-xs">
          {/* <label htmlFor="productCost">Coste del producto:</label> */}
          <label htmlFor="serialNumber">Coste del producto:</label>
          <input
            type="number"
            placeholder="Coste del producto"
            min="0"
            value={productCost}
            onChange={(e) => setProductCost(parseFloat(e.target.value))}
            // className="w-1/3 h-12 mt-6 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            className="w-36 bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl text-stone-800"
            // className="w-full bg-orange-100 border-2 border-stone-800 p-2 rounded-md  text-base md:text-xl"
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
            style={{ fontSize: '20px' }}
          />
        </div>
        </div>
        <div>
        <button
          className="py-1 px-3 h-12 w-56 mt-6 bg-orange-500 text-stone-800 border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={addProduct}
          disabled={isLoading || !ownerId || !modelNumber || !serialNumber || !productCost}
          >
          {isLoading ? 'Añadiendo producto...' : '📤 Añadir producto'}
        </button>
        </div>
      </div>

      {/* Sección para mover el producto */}
        {/* <div className="flex flex-col flex-grow w-full max-w-xs"> */}
        <div className="flex flex-row gap-2">
        <div className="flex flex-col max-w-xs">
          <label htmlFor="theProductId">Id del producto:</label>
          <input
            type="number"
            placeholder="Número de Id del producto"
            min="0"
            value={theProductId}
            onChange={(e) => setTheProductId(parseInt(e.target.value))}
            className="w-28 h-12 bg-orange-100 border-2 border-stone-800 p-2 rounded-md text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
          />
        </div>
        <div className="flex flex-col flex-grow max-w-md">
        <label htmlFor="user1">Mover el producto de este proveedor...</label>
        <input
          type="number"
          placeholder="Número de Id del poseedor actual"
          value={user1}
          min="0"
          onChange={(e) => setUser1(parseInt(e.target.value))}
          className="flex-grow max-w-md  bg-orange-100 p-2 border-2 border-stone-800  rounded-md text-base md:text-xl text-stone-800"
          style={{ fontSize: '20px' }}
        />
        </div>
        <div className="flex flex-col flex-grow max-w-md">
          <label htmlFor="user2">...a este proveedor:</label>
          <input
            type="number"
            placeholder="Número de Id del próximo poseedor"
            min="0"
            value={user2}
            onChange={(e) => setUser2(parseInt(e.target.value))}
            // className="py-1 px-3 h-12 flex-grow bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-full text-base md:text-xl"
            className=" flex-grow  bg-orange-100 p-2 border-2 border-stone-800 rounded-md text-base md:text-xl text-stone-800"
            style={{ fontSize: '20px' }}
          />
        <div>
        </div>
        </div>

        <button
          className="w-56 h-12 mt-6 bg-orange-500 text-stone-800 border-2 border-stone-800 rounded-md hover:bg-orange-400 transition-all disabled:opacity-80 text-xl"
          onClick={newOwner}
          disabled={isLoading || !user1 || !user2 || !theProductId}
          >
          {isLoading ? 'Moviendo el producto...' : '📤 Mover el producto'}
        </button>
      </div>
    </div>
  </div>
  </div>
  );
};

export default DataEntry;