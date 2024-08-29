//https://www.linkedin.com/posts/pablockchain_productmanager-activity-7225404645286768640-6z8o?utm_source=share&utm_medium=member_desktop
import { SetStateAction, useEffect, useState } from 'react';
import { useUserContext } from './contexts/UserContext';
import ProductModal from './components/ProductModal';
import ParticipantModal from './components/ParticipantModal';
import TraceabilityModal from './components/TraceabilityModal';
import NewOwnerModal from './components/NewOwnerModal';
import { addParticipant, addProduct, newOwner } from './utils/NewItemsFunctions';
import { uiConsole } from './utils/SignMessageFunction';


import { Participant, Product, Ownership } from './utils/Types';

import Web3 from "web3";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Contract, ethers, hashMessage, JsonRpcProvider, Wallet } from 'ethers';
import { abi } from "./assets/abis/supplyChainModSigner";
import { CONTRACT_ADDRESS } from "./assets/constants";
import DataProvider from './components/DataProvider';
import DataEntry from './components/DataEntry';
import { addItemToLocalStorage, initializeExistingPrefixes, findItemsByInitialNumbers }from './utils/StorageFuntions';
// import truncateEthAddress from 'truncate-eth-address';
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
// import { waitForTransactionReceipt } from 'wagmi/actions';
// import { config } from './main';
// import { Client, createClient, Transport } from 'viem';

import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import 'react-toastify/dist/ReactToastify.css';
import { UploadNFT } from './components/UploadNFT';

// Firebase libraries for custom authentication
// import { initializeApp } from "firebase/app";
// import { GoogleAuthProvider, getAuth, signInWithPopup, UserCredential } from "firebase/auth";


// const clientId = "BGpGpXliyOvZqqOiBsC3il_LS37PYXTTWLmOFpU3aQFI7EseTEIoAR0TmFzcwkloA2gR6x2MYX9BCMcqzztt0faf0V0FquDt69peT6lhGcTJK2UoF2mCUo4ZJaILzd2bEShs6nQfV5YBOffL5VsnC8KPv7c49vkd24"; // get from https://dashboard.web3auth.io
// const clientId =
//    "BCrqDXodbfN-LAcUdfhNLc7CPeMVup9CrljBTrgOx9oOSlOGfPAkV9O_NfLlxts4ooEorHaJxftFSCgyP16m0sI"; // get from https://dashboard.web3auth.io

const clientId = process.env.REACT_APP_CLIENT_ID; // get from https://dashboard.web3auth.io

// const verifier = "w3a-firebase-demo";
// IMP END - Dashboard Registration
const chainConfig = {
  chainId: "0x66eee", // Please use 0x1 for Mainnet
  rpcTarget: process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL || "",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  displayName: "Arbitrum Sepolia",
  blockExplorerUrl: "https://arbiscan.io/",
  ticker: "AETH",
  tickerName: "AETH",
  logo: "https://images.toruswallet.io/eth.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

if (!clientId) {
  throw new Error('ClientId not found')
}

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider: privateKeyProvider,
});


// Your web app's Firebase configuration
// const firebaseConfig = {
  //   apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
  //   authDomain: "web3auth-oauth-logins.firebaseapp.com",
  //   projectId: "web3auth-oauth-logins",
//   storageBucket: "web3auth-oauth-logins.appspot.com",
//   messagingSenderId: "461819774167",
//   appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
// };
initializeExistingPrefixes();


// const addProductToLocalStorage = (product: Product, productId: string) => {
//   console.log("ProductId en addProductToLocalStorage", productId);
//   const productKey = product.id;
//   let productIds = new Set(JSON.parse(localStorage.getItem("productIds") || "[]"));

//   // const existingProduct = localStorage.getItem("productIds");
//   console.log("ProductKey en addProductToLocalStorage", productKey);

//   if (productIds.has(productKey)) {
//     console.log("Product with ID", productKey, "already exists!");
//     // toast.error("Duplicate product detected. Try a different ID.");
//     return;
//   }
//   // productIds.add(productKey);
//   const initialNumber = productKey.split("-")[1];
//   productIndex[initialNumber] = productIndex[initialNumber] || []; // Si no existe, crea un array vacío
//   productIndex[initialNumber].push(productKey);
//   console.log("initialNumber en addProductToLocalStorage", initialNumber);
//   console.log("productIndex[initialNumber] en addProductToLocalStorage", productIndex[initialNumber]);

//   // Agrega el ID del producto al set de IDs
//   productIds.add(productKey);
//   localStorage.setItem("productIds", JSON.stringify(Array.from(productIds))); // Update set with new ID
//   localStorage.setItem(productKey, JSON.stringify(product)); // Store product data 

//   console.log("Producto añadido:", productKey);

// };

// const addItemToLocalStorage = (product: Product, productId: string, participant: Participant, participantId: string, ownership: Ownership, ownershipId: string) => {



// Inicializar los conjuntos de prefijos existentes al cargar la aplicación


// IMP END - SDK Initialization
function App(): JSX.Element {
  // const { user1, setUser1, _ownershipId, set_OwnershipId} = useUserContext()
  // const { address, isConnected } = useAccount();
  // const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  // const safeAddress = address?? 'Please, connect your wallet'; // Se utiliza este string como placeholder
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');//Mejorar esto, asegurar, guardar, etc
  const [participantType, setParticipantType] = useState('');
  const [participantAddress, setParticipantAddress] = useState("");
  const [productId, setProductId] = useState(0);
  const [ownershipId, setOwnershipId] = useState(0);
  const [ownerId, setOwnerId] = useState(0);//deberia ser la address conectada si solo puede dar de alta producto un manufacturer conectado
  const [modelNumber, setModelNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [productCost, setProductCost] = useState(0);
  const [partNumber, setPartNumber] = useState("0");
  // const [user1, setUser1] = useState(0);
  const [user2, setUser2] = useState(0);
  const [theProductId, setTheProductId] = useState(0);
  const [participantId, setParticipantId] = useState(0);//Esta bien como cero???

  // Estados para almacenar los datos leídos del contrato
  const [participantData, setParticipantData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [provenanceData, setProvenanceData] = useState<any>(null);
  const [ownershipData, setOwnershipData] = useState<any>(null);
  const [participant_type, setParticipant_type] = useState('');
  // const [actualProductId, setActualProductId] = useState<any>(null);
  // const [actualParticipantId, setActualParticipantId] = useState<any>(null);
  // const [actualOwnerIdData, setActualOwnerIdData] = useState<any>(0);

  const [provider, setProvider] = useState<IProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);

  const [isTraceabilityModalOpen, setIsTraceabilityModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  
  const {theOwnershipId, setTheOwnershipId} = useUserContext();
  // const app = initializeApp(firebaseConfig);
  
  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        // Verificar si el web3auth ya está conectado
        if (!web3auth.connected && !web3auth.provider) {
          await web3auth.initModal();
          setProvider(web3auth.provider);
        }
        // Verificar si provider está inicializado
        if (web3auth.provider) {
          setProvider(web3auth.provider);
          const user: Partial<UserInfo> = await web3auth.getUserInfo();
          // console.log("USER", user);
          setUser(user);

          const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
            web3auth.provider
          );
          // console.log("w3aProvider", w3aProvider);

          const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
          setSigner(w3aSigner);
          // console.log("w3aSigner", w3aSigner);

          const web3 = new Web3(web3auth.provider as any);

          let initAddress: any = await web3.eth.getAccounts();
          initAddress = initAddress[0];

          // console.log("initAddress", initAddress);
          setAddress(initAddress);

          if (web3auth.connected) {
            setLoggedIn(true);
          }

          const provider: JsonRpcProvider = new JsonRpcProvider(
            process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL
          );

          const signer: ethers.Wallet = new Wallet(
            process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
            provider
          );
          
          console.log("INIT productData", productData);
          
          const initContract = new Contract(CONTRACT_ADDRESS, abi, signer);
          setContract(initContract);
          // console.log("Contract", initContract);

          if (productId > 0 || provenanceData) {
            console.log("PRUEBA");
            fetchProductData();
            console.log("product", productData);
            fetchProvenanceData();
            console.log("PROVENANCE", provenanceData);
          }

          // console.log("Provider", web3auth.provider);
          setIsLoading(false);
        } else {
          throw new Error("Provider not initialized");
        }

        // setEth(
        //   web3.utils.fromWei(
        //     await web3.eth.getBalance(initAddress as string), // Balance is in wei
        //     "ether"
        //   )
        // );

        // setBalanceOf(await initContract.balanceOf(initAddress));

        // setAllowance(
        //   await initContract.allowance(
        //     initAddress,
        //     "0xD96B642Ca70edB30e58248689CEaFc6E36785d68"
        //   )
        // );

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [productId]);

    useEffect(() => {
    if (signer && address && contract) {
        UploadNFT(signer, address, contract)
            .then(result => {
              if(result){
                console.log('NFT uploaded successfully:', result);
              }else{
                console.log('No uploaded NFT:', result);
              }
            })
            .catch(error => {
                console.error('Error uploading NFT:', error);
            });
    }
}, [signer, address, contract]);

  const login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    setProvider(web3authProvider);


    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // const getUserInfo = async () => {
  //   // IMP START - Get User Information
  //   const user: Partial<UserInfo> = await web3auth.getUserInfo();

  //   uiConsole(user);
  // };  


  // const getAccounts = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const web3 = new Web3(provider as any);

  //   // Get user's Ethereum public address
  //   const address = await web3.eth.getAccounts();
  //   uiConsole(address);
  // };

 
  //   const { data: actualOwnerId, refetch: refetchActualOwnerId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'owner_id',
  // })
  //   const { data: actual_ParticipantId, refetch: refetchActualParticipantId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'participant_id',
  // })
  //   const { data: actual_productId, refetch: refetchActualProductId } = useReadContract({
  //   abi,
  //   address: CONTRACT_ADDRESS,
  //   functionName: 'product_id',
  // })


  const fetchParticipantData = async () => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result: any = await contract?.getParticipant(participantId);
      if (result && result.length === 3) {
        const [participantName, participantType, productOwnerAddress] = result;
        console.log("Participant Name:", participantName);
        console.log("Participant Type:", participantType);
        console.log("Product Owner Address:", productOwnerAddress);
        if (participantName.trim() !== '' && participantType.trim() !== '' && productOwnerAddress !== '0x0000000000000000000000000000000000000000') {
          setParticipantData(result);
  
          let participant = new Participant(
            participantName.toString(),
            participantType.toString(),
            productOwnerAddress.toString(),
            participantId.toString()
          );
          console.log("Participant Object:", participant);
          if (participant.name.trim() !== '' && participant.participantType.trim() !== '' && participant.participantAddress !== '0x0000000000000000000000000000000000000000') {           
             addItemToLocalStorage(participant, "participant");
          } else {
            console.error("Invalid participantId data:", participant);
          }
        } else {
          console.error("Invalid data received from contract:", result);
        }
      } else {
        console.error("No valid data found for participant ID:", ownershipId);
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
    }
  };

  const fetchProductData = async () => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result = await contract.getProduct(productId);
      if (result) {
        setProductData(result);
        setParticipant_type(result ? (result[3]).toString() : '');
       
        // let product = new Product( 
        //   result ? (result[0]).toString() : '',
        //   result ? (result[1]).toString() : '',
        //   result ? (result[2]).toString() : '',
        //   result ? (result[3]).toString() : '',
        //   result ? (result[4]).toString() : 0,
        //   result ? (result[5]).toString() : 0, 
        //   result ? (result[6]).toString() : '',
        //   productId.toString())
        // console.log("SET_ITEM_DATA:", product.id, JSON.stringify(product));
        // addItemToLocalStorage(product, "product");
      } else {
        console.error("No data found for product ID:", productId);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchProvenanceData = async () => {
    console.log("INICIO fetchProvenanceData");
    const result = await contract?.getProvenance(productId);
    // fetchProductData()
    setProvenanceData(result);
    console.log("PROVENANCE RESULT", result);
    console.log("PROVENANCE DATA", provenanceData);
    setIsTraceabilityModalOpen(true);
    console.log("isTraceabilityModalOpen", isTraceabilityModalOpen);
  };

  const fetchOwnershipData = async () => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    try {
      const result = await contract?.getOwnership(ownershipId);
      if (result && result.length === 4) {
      const [productId, productOwnerId, productOwnerAddress, trxTimeStamp] = result;

      // Validar que los valores no sean 0 o la dirección no sea la dirección nula
      if (productId !== 0 && productOwnerId !== 0 && productOwnerAddress !== '0x0000000000000000000000000000000000000000') {

        setOwnershipData(result);
        let ownership = new Ownership(
          parseInt(productId.toString()),
          parseInt(productOwnerId.toString()),
          productOwnerAddress.toString(),
          trxTimeStamp,
          ownershipId.toString()
        );
        // Validar que ownership no sea vacío
        if (ownership.productId !== 0 && ownership.productOwnerId !== 0 && ownership.productOwnerAddress && ownership.trxTimeStamp) {
          
          addItemToLocalStorage(ownership, "ownership");
          // return ownership;
        } else {
          console.error("Invalid ownership data:", ownership);
        }
      } else {
        console.error("No data found for ownership ID:", productId);
      }
      } else {
        console.error("No valid data found for ownership ID:", ownershipId);
      }
    }catch (error) {
      console.error("Error fetching ownership data:", error);
    }
    // localStorage.setItem(ownership.id, JSON.stringify(ownership));
  }

  function handleClick(itemId: number, itemType: string) {
    if (itemType === "product") {
      findItemsByInitialNumbers([itemId], "product"); // Llama a tu función
    } else if (itemType === "participant") {
      findItemsByInitialNumbers([itemId], "participant"); // Llama a tu función
    } else {
      findItemsByInitialNumbers([itemId], "ownership"); // Llama a tu función
    }
  }

  // const fetchActualOwnerIdData = async () => {
  //   const result = await contract?.owner_id();
  //   setActualOwnerIdData(result.data);
  // };
  // const fetchActualParticipantIdData = async () => {
  //   const result = await contract?.participant_id();
  //   setActualParticipantId(result.data);
  // };
  // const fetchActualProductId = async () => {
  //   const result = await contract?.product_id();
  //   setActualProductId(result.data);
  // };

  

  const unloggedInView = (
    // <button onClick={login} className="card">
    <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] bg-opacity-50 transition-all disabled:opacity-80 text-xl font-semibold" onClick={login}>
      Login
    </button>
  );

  const loggedInView = (
    <>
      {/* <div className="flex-container"> */}
      {/* <div> */}
      {/* <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div> */}
      {/* <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div> */}
      {/* <div> */}
      {/* <button onClick={logout} className="card"> */}

      <button className="bg-[#ca0372] p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-[#ca0372] hover:opacity-50  transition-all disabled:opacity-80 text-xl font-semibold " onClick={logout}>
        Log Out
      </button>
      {/* </div> */}
      {/* </div> */}
    </>
  );


  return (
    // <div className="flex flex-col items-center p-4">
    <div id="container" className="flex flex-col flex-center m-auto text-stone-100 bg-[#292d67] bg-opacity-10"
    /* }bg-[url('../public/logistica_app.png')]  bg-no-repeat bg-center bg-contain" */
    // style={{backgroundColor: '#292d67'}} >
    > 
    {/*COLORES:#292d67 azul grisaceo web // rojo: bg-[#ca0372] //turquesa #11c5c5
     #818a91 gris /#007bff azul mas claro 
    #0069d9 azul medio #6c757d gris mas oscuro #5a6268 gris aun mas oscuro
    #28a745 verde #218838 verde mas oscuro #17a2b8 turquesa?
    #138496 turquesa mas claro #ffc107 naranja #e0a800 naranja mas oscuro
    #dc3545 rojo #c82333 rojo mas oscuro #343a40 grafito #23272b grafito mas oscuro
    #212529 casi negro(letra) #f8f9fa casi blanco #e2e6ea casi blanco mas apagado
    /#ffffff #000000*   extraer de aqui; https://exitflow.cl/wp-content/plugins/pagelayer-pro/css/givecss.php?give=pagelayer-frontend.css%2Cnivo-lightbox.css%2Canimate.min.css%2Cowl.carousel.min.css%2Cowl.theme.default.min.css%2Cfont-awesome5.min.css&premium=%2Cpremium-frontend.css&ver=1.8.5 */}
    
      <div className="flex flex-col justify-between m-auto w-2/3 border-2 border-stone-800 rounded-md mb-4">

        {/* // <div id="container" className="flex flex-col flex-center m-auto bg-orange-50 text-stone-800  bg-no-repeat bg-center bg-contain"> */}
        {/* <ConnectButton /> */}
        <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
        {loggedIn && (
          <div className="flex flex-col items-center rounded-md">
            {/* <button onClick={recoverProduct(productId)}>RECUPERAR</button> */}
            {/* <button onClick={() => handleClick(productId, "product")}>RECUPERAR</button>
            <button onClick={() => handleClick(participantId, "participant")}>PART</button>
            <button onClick={() => handleClick(ownershipId, "ownership")}>OWNER</button> */}
            <div className="flex flex-row gap-5 w-full justify-center items-center">
              {/* <img src={user?.profileImage} alt="TraZableDLT" /> */}
              <div className="flex flex-row gap-3 items-left">
                <h2 className=" bg-[#11c5c5] border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-[#292d67]">
                  name: {user?.name}</h2>
                <h2 className=" bg-[#11c5c5] border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-[#292d67]">
                  email: {user?.email}</h2>
                <h2 className=" bg-[#11c5c5] border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-[#292d67]">
                  cuenta: {address}</h2>
              </div>
            </div>
            <DataEntry
              provider={provider}
              contract={contract}
              address={address}
              name={name}
              pass={pass}
              participantAddress={participantAddress}
              participantType={participantType}
              modelNumber={modelNumber}
              serialNumber={serialNumber}
              partNumber={partNumber}
              productCost={productCost}
              theOwnershipId={theOwnershipId}
              user2={user2}
              theProductId={theProductId}
              ownerId={ownerId}
              isLoading={isLoading}
              setParticipantData={setParticipantData}
              setProductData={setProductData}
              setOwnershipData={setOwnershipData}
              setProvenanceData={setProvenanceData}
              setName={setName}
              setPass={setPass}
              setParticipantAddress={setParticipantAddress}
              setParticipantType={setParticipantType}
              setOwnerId={setOwnerId}
              setModelNumber={setModelNumber}
              setSerialNumber={setSerialNumber}
              setProductCost={setProductCost}
              setIsLoading={setIsLoading}
              setTheOwnershipId={setTheOwnershipId}
              setUser2={setUser2}
              setTheProductId={setTheProductId}
              setIsProductModalOpen={setIsProductModalOpen}
              setIsParticipantModalOpen={setIsParticipantModalOpen}
              setIsNewOwnerModalOpen={setIsNewOwnerModalOpen}
              // addParticipant={addParticipant}
              // fetchProvenanceData={fetchProvenanceData}
              addParticipant={addParticipant}
              addProduct={addProduct}
              newOwner={newOwner} user1={0} setUser1={function (value: SetStateAction<number>): void {
                throw new Error('Function not implemented.');
              } }            
              // fetchParticipantData={fetchParticipantData}
            />
            <DataProvider
              productData={productData}
              participantData={participantData}
              ownershipData={ownershipData}
              provenanceData={provenanceData}
              ownershipId={ownershipId}
              productId={productId}
              participantId={participantId}
              participant_type={participant_type}
              isLoading={isLoading}
              setProductData={setProductData}
              setParticipantData={setParticipantData}
              setOwnershipData={setOwnershipData}
              setProvenanceData={setProvenanceData}
              setProductId={setProductId}
              setOwnershipId={setOwnershipId}
              setParticipantId={setParticipantId}
              fetchOwnershipData={fetchOwnershipData}
              fetchParticipantData={fetchParticipantData}
            />
             {/* <button onClick={() => showTraceability(1)}>Mostrar Trazabilidad</button> */}
             {/* <ProductModal product={product} isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} /> */}
             {/* <div className="my-8"> */}
             <TraceabilityModal ids={provenanceData} isTraceabilityModalOpen={isTraceabilityModalOpen} productId={productId} productData={productData} provenanceData={provenanceData} onRequestClose={() => setIsTraceabilityModalOpen(false)} />
             <ProductModal isProductModalOpen={isProductModalOpen} productId={productId} productData={productData} onRequestClose={() => setIsProductModalOpen(false)} />
             <ParticipantModal isParticipantModalOpen={isParticipantModalOpen} participantId={participantId} participantData={participantData} onRequestClose={() => setIsParticipantModalOpen(false)} />
             <NewOwnerModal isNewOwnerModalOpen={isNewOwnerModalOpen} ownershipId={ownershipId} ownershipData={ownershipData} onRequestClose={() => setIsNewOwnerModalOpen(false)} />
             {/* </div> */}
          </div>
        )}
        {/* <p className="mt-4">ProductId: {actualProductId}</p>
    <p className="mt-4">ParticipantId: {actualParticipantId}</p> */}
      </div>
      {!loggedIn && (
        <div  className='p-96 flex-col rounded-md m-auto place-content-center bg-[#292d67]' >
        {/* <h1 className="m-auto text-6xl text-center">EXIT FLOW</h1> */}
        <img className=' w-72' src="/exitflow_logo_600X600.png" alt="Logotipo de la expresa de logistica inversa Exit Flow" />
        <h2 className="m-auto mt-8 text-4xl text-center text-white">-- Cadena de suministro --</h2>

        </div>
      )}
    </div>
  );


};
export default App
