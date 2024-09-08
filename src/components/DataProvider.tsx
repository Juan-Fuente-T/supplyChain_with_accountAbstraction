import React, { useEffect, useState } from "react";
// import '../App.css';
// import './App.css';
import formatDate from "../utils/FormatDate";

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

interface DataProviderProps {
  productData: any[];
  participantData: any[];
  ownershipData: any[];
  provenanceData: number[];
  participantId: number;
  ownershipId: number;
  productId: number;
  participant_type: string;
  isLoading: boolean;
  setProductData: React.Dispatch<React.SetStateAction<any[] | undefined>>; // Ajuste para el tipo correcto
  setParticipantData: React.Dispatch<React.SetStateAction<any[] | undefined>>; // Ajuste para el tipo correcto
  setOwnershipData: React.Dispatch<React.SetStateAction<any[] | undefined>>; // Ajuste para el tipo correcto
  setProvenanceData: React.Dispatch<React.SetStateAction<number[] | undefined>>; // Ajuste para el tipo correcto
  setParticipantId: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  setOwnershipId: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  setProductId: React.Dispatch<React.SetStateAction<number>>; // Corrección en el nombre y ajuste para el tipo correcto
  fetchOwnershipData: () => void;
  fetchParticipantData: () => void;
}

const DataProvider: React.FC<DataProviderProps> = ({
  ownershipData,
  participantData,
  productData,
  provenanceData,
  participantId,
  ownershipId,
  productId,
  participant_type,
  isLoading,
  // setParticipantData,
  // setProductData,
  // setOwnershipData,
  // setProvenanceData,
  setParticipantId,
  setOwnershipId,
  setProductId,
  fetchOwnershipData,
  fetchParticipantData,
}) => {
  const [showOwnershipData, setShowOwnershipData] = useState(true);
  const [showParticipantData, setShowParticipantData] = useState(true);

  useEffect(() => {
    // console.log("productData-DP:", productData);
    // console.log("participantData-DP:", participantData);
    // console.log("ownershipData-DP:", ownershipData);
    // console.log("provenanceData-DP:", provenanceData);
    // console.log("participant_type-DP:", participant_type);
  }, [
    productData,
    participantData,
    ownershipData,
    provenanceData,
    participant_type,
  ]);
  return (
    <div className="flex flex-col flex-center m-auto w-full justify-evenly gap-2 p-2 text-stone-800">
      {/* <div className="flex flex-row justify-between mt-4 mb-2 w-full border-2 border-stone-800 rounded-md"> */}
      <div className="flex flex-row justify-between m-auto mt-3 mb-2 w-full max-w-6xl border-2 border-stone-800 rounded-md">
        <h1 className="w-auto m-2 text-[#292d67] md:text-3xl content-center">
          Recuperacion de datos
        </h1>
        <div className="flex flex-row place-items-center m-1">
          <p className="bg-[#292d67] text-white p-2 h-12 content-center border-2 border-stone-800 rounded-md md:text-base leading-none">
            ID del Producto
          </p>
          <input
            type="number"
            placeholder="Id del producto"
            min="0"
            value={productId}
            onChange={(e) => setProductId(parseInt(e.target.value))}
            className="bg-[#ca0372] border-2 border-stone-800 p-2 ml-1 rounded-md w-24 text-base md:text-xl text-white"
            style={{ fontSize: "20px" }}
          />
        </div>
      </div>
      {/* Aquí va el contenido de la sección de entrada de datos del participante */}
      <div className="flex flex-col gap-2 m-auto mt-3 w-full max-w-6xl">
        <div className="flex justify-around gap-4">
          {/* <p className="flex justify-around mb-8">OWNER Number of product: {ownerNumber || '' ''}</p> */}
          <p className="bg-[#292d67] border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-base md:text-xl text-white">
            {" "}
            {/* PARTICIPANT NAME : {participant_name || '' ''}</p> */}
            {/* NOMBRE DEL PROVEEDOR : {participantData ? JSON.stringify(participantData[0]) : '' ''}</p> */}
            {/* NOMBRE DEL PROVEEDOR : {productData ? JSON.stringify(productData[2]) : '' } - NUMERO: {participantId} </p> No es posible usar participantId por qure cmabia cuando el user obtiene datos del participant */}
            NOMBRE DEL PROVEEDOR :{" "}
            {productData ? JSON.stringify(productData[2]) : ""}{" "}
          </p>
          <p className="bg-[#292d67] border-2 border-stone-800 p-4 rounded-md w-full max-w-4xl mb-4 text-base md:text-xl text-white">
            {/* PARTICIPANT TYPE : {participant_type || '' ''}</p> */}
            {/* TIPO DE PROVEEDOR: {participantData ? JSON.stringify(participantData[1]) : '' ''}</p> */}
            TIPO DE PROVEEDOR:{" "}
            {productData ? JSON.stringify(productData[3]) : ""}
          </p>
          {/* <p className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full max-w-4xl mb-4 text-base md:text-xl"> */}
          {/* PARTICIPANT TYPE : {participant_type || '' ''}</p> */}
          {/* CUENTA DEL PROVEEDOR: {participantData ? JSON.stringify(participantData[2]) : '' ''}</p> */}
        </div>

        <div className="flex justify-around gap-4 place-items-center">
          <img
            // src="supplychain_manufacturer.png"
            src="supplychainmanufacturer.png"
            // className={`w-52 h-28 rounded-md transform transition-transform duration-300 ${
            className={`w-20 md:w-36 lg:w-52 h-16 md:h-20 lg:h-28 rounded-md transform transition-transform duration-300 ${
              participant_type === "Manufacturer"
                ? "scale-120 filter-none h-36 border-2 border-stone-800 rounded-md"
                : ""
            }`}
            alt="Manufacturer"
          />
          <div
            className={`w-20 md:w-36 lg:w-52 h-16 md:h-20 lg:h-28 border-2 rounded-md transform transition-transform duration-300 ${
              participant_type === "Supplier"
                ? "border-[#ca0372] scale-110"
                : ""
            }`}
          >
            <img
              src="supplychainsupplier2.png"
              className={`w-full h-full rounded-md ${
                participant_type === "Supplier" ? "filter hue-rotate-90" : ""
              }`}
              alt="Supplier"
            />
          </div>

          <div
            className={`w-20 md:w-36 lg:w-52 h-16 md:h-20 lg:h-28 border-2 rounded-md transform transition-transform duration-300 ${
              participant_type === "Consumer"
                ? "border-[#ca0372] scale-110"
                : ""
            }`}
          >
            <img
              src="supplychaincustomer.png"
              className={`w-full h-full rounded-md ${
                participant_type === "Consumer" ? "filter hue-rotate-180" : ""
              }`}
              alt="Consumer"
            />
          </div>
        </div>
        <div className="flex flex-col place-items-center w-full m-auto mt-4 gap-4 ">
          <div className="bg-[#292d67] border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-white text-base md:text-xl">
            Datos del producto: NUMERO - {productData ? productData[0] : ""}{" "}
            &nbsp;|&nbsp; Nº DE SERIE - {productData ? productData[1] : ""}{" "}
            &nbsp;|&nbsp; COSTE -{" "}
            {productData
              ? productData[4]
                ? typeof productData[4] === "bigint"
                  ? productData[4].toString()
                  : productData[4].toString()
                : ""
              : ""}{" "}
            &nbsp;|&nbsp;
            {/* FECHA DE FABRICACION - {productData ? (typeof productData[5] === 'bigint' ? productData[5].toString() : productData[5].toString()) : '' ''} &nbsp;|&nbsp; */}
            FECHA DE FABRICACION -{" "}
            {productData
              ? productData[5]
                ? formatDate(productData[5])
                : ""
              : ""}{" "}
            &nbsp;|&nbsp; CUENTA DEL DUEÑO - {productData ? productData[6] : ""}
          </div>
          {/* <div className="flex flex-row bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full mb-2 text-base md:text-xl"> */}
          <div className="flex flex-row bg-[#292d67] border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-white text-base md:text-xl">
            <h2>Trazabilidad del producto:&nbsp;</h2>
            <div className="flex flex-wrap place-items-center justify-start">
              <span>TRASFERENCIAS-&nbsp;</span>
              {provenanceData && provenanceData.length > 0 ? (
                <span>
                  {provenanceData.map((item: number, index: number) => (
                    <span key={index} className="mx-2">
                      {item.toString()}
                      {index < provenanceData.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {/* <div className="bg-orange-100 border-2 border-stone-800 p-4 rounded-md w-full  mb-4 text-base md:text-xl">
        Ownership Data: {ownershipData ? JSON.stringify(ownershipData) : '' ''}
      </div> */}
        {/*Posibles nombres: Intermediario, agente, participante, componente, procesador, actor, comprador, adquiridor*/}
        <div className="flex flex-col  place-items-center justify-start  w-full m-auto p-2 m-2 mb-6 rounded-md border-2 border-stone-800">
          {ownershipData && ownershipId !== 0 && showOwnershipData && (
            <div className="flex justify-between bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full  mb-2 text-white text-base md:text-xl relative flex items-center">
              <div>
                <p className="text-sm md:text-xl">
                  {" "}
                  Datos de adquisición: ID DE PRODUCTO -{" "}
                  {ownershipData
                    ? typeof ownershipData[0] === "bigint"
                      ? ownershipData[0].toString()
                      : ownershipData[0].toString()
                    : ""}{" "}
                  &nbsp;|&nbsp; ID DEL PARTICIPANTE -{" "}
                  {ownershipData
                    ? typeof ownershipData[1] === "bigint"
                      ? ownershipData[1].toString()
                      : ownershipData[1].toString()
                    : ""}{" "}
                  &nbsp;|&nbsp; FECHA DE ADQUISICION -{" "}
                  {ownershipData
                    ? typeof ownershipData[3] === "bigint"
                      ? formatDate(ownershipData[3])
                      : formatDate(ownershipData[3])
                    : ""}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  // className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-800 rounded-full p-1"
                  className="ml-0.5 md:ml-4 text-white text-lg py-0 px-1.5 md:text-2xl bg-[#ca0372] hover:scale-105 rounded-sm md:rounded-md md:py-1 md:px-3"
                  onClick={() => setShowOwnershipData(false)}
                >
                  X
                </button>
              </div>
            </div>
          )}
          {participantData && participantId !== 0 && showParticipantData && (
            <div className="flex justify-between bg-[#292d67] border-2 border-stone-800 p-2 rounded-md w-full  mb-2 text-white text-base md:text-xl relative flex items-center">
              <div>
                <p className="text-sm md:text-xl">
                  Datos del proveedor: NOMBRE -{" "}
                  {participantData ? JSON.stringify(participantData[0]) : ""}{" "}
                  &nbsp;|&nbsp;
                  {/* NUMERO - {participantId ? participantId : ''}  &nbsp;|&nbsp; */}{" "}
                  {/*No puede ser participant, cambia con el input para obtener datos del participant*/}
                  TIPO -{" "}
                  {participantData ? JSON.stringify(participantData[1]) : ""}{" "}
                  &nbsp;|&nbsp; CUENTA -{" "}
                  {participantData ? JSON.stringify(participantData[2]) : ""}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  // className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-800 rounded-full p-1"
                  className="ml-0.5 md:ml-4 text-white text-lg py-0 px-1.5 md:text-2xl bg-[#ca0372] hover:scale-105 rounded-sm md:rounded-md md:py-1 md:px-3"
                  onClick={() => setShowParticipantData(false)}
                >
                  X
                </button>
              </div>
            </div>
          )}

          {/* Botones para obtener datos de trazabilidad y datos de proveedor */}
          <div className="flex flex-wrap md:flex-nowrap w-full justify-between gap-4 m-2">
            {/* Agrupamos el <p> y el <input> en un div */}
            {/* Contenedor para el <p> y el <input> */}
            <div className="flex gap-4 w-full md:w-2/5">
              <p className="flex w-4/6 h-12 bg-[#292d67] text-center text-white items-center justify-center border-2 border-stone-800 p-2 rounded-md text-base md:text-base lg:text-base xl:text-xl leading-none">
                ID de Transferencia o Proveedor
              </p>
              <input
                type="number"
                placeholder="ID de Transferencia o Proveedor"
                min="0"
                value={ownershipId}
                onChange={(e) => {
                  setOwnershipId(parseInt(e.target.value));
                  setParticipantId(parseInt(e.target.value));
                }}
                className="w-2/6 h-12 bg-[#ca0372] border-2 border-stone-800 px-2 rounded-md text-sm md:text-xs lg:text-xl text-white"
                style={{ fontSize: "18px" }}
              />
            </div>

            {/* Contenedor para los botones */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-3/5 text-sm md:text-xs lg:text-xl">
              <button
                onClick={() => {
                  setShowParticipantData(true);
                  fetchParticipantData();
                }}
                className="w-full h-12 bg-[#ca0372] text-white border-2 border-stone-800 p-2 rounded-md hover:bg-opacity-60 transition-all disabled:opacity-80 text-base md:text-base lg:text-base xl:text-xl leading-none font-semibold"
                disabled={isLoading || !ownershipId}
              >
                Datos de proveedor
              </button>
              <button
                onClick={() => {
                  setShowOwnershipData(true);
                  fetchOwnershipData();
                }}
                // className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 h-12 bg-[#ca0372] text-white border-2 border-stone-800 p-2 rounded-md hover:bg-opacity-60 transition-all disabled:opacity-80 text-base md:text-lg font-semibold"
                className="w-full h-12 bg-[#ca0372] text-white border-2 border-stone-800 px-2 rounded-md hover:bg-opacity-60 transition-all disabled:opacity-80 text-base md:text-base lg:text-base xl:text-xl leading-none font-semibold"
                disabled={isLoading || !participantId}
              >
                Transferencias de producto
              </button>
              {/* <button
          onClick={fetchParticipantData}
          className="py-2 px-3 w-full max-w-48 bg-fuchsia-700 text-white border-2 border-stone-800 p-4 rounded-md hover:bg-fuchsia-900 transition-all disabled:opacity-50 text-xl"
          >
          Datos de proveedor
        </button>

      <button
        onClick={fetchProductData}
        className="py-2 px-3 w-full max-w-48 bg-fuchsia-700 text-white rounded-lg hover:bg-fuchsia-900 transition-all disabled:opacity-50 text-xl"
      >
        Datos de producto
      </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataProvider;
