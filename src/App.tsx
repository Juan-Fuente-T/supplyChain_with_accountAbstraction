import { useEffect, useState } from 'react';
import Web3 from "web3";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Contract, ethers, hashMessage, JsonRpcProvider, Wallet } from 'ethers';
import { abi } from "./assets/abis/supplyChainModSigner";
import { CONTRACT_ADDRESS } from "./assets/constants";
import DataProvider from './components/DataProvider';
import DataEntry from './components/DataEntry';
// import truncateEthAddress from 'truncate-eth-address';
// import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
// import { waitForTransactionReceipt } from 'wagmi/actions';
// import { config } from './main';
// import { Client, createClient, Transport } from 'viem';

import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import 'react-toastify/dist/ReactToastify.css';

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

// IMP END - SDK Initialization
function App(): JSX.Element {
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
  const [user1, setUser1] = useState(0);
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
          console.log("USER", user);
          setUser(user);
          
          const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
            web3auth.provider
          );
          console.log("w3aProvider", w3aProvider);
          
          const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
          setSigner(w3aSigner);
          console.log("w3aSigner", w3aSigner);

          const web3 = new Web3(web3auth.provider as any);
        
          let initAddress: any = await web3.eth.getAccounts();
          initAddress = initAddress[0];
          
          console.log("initAddress", initAddress);
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
  
          const initContract = new Contract(CONTRACT_ADDRESS, abi, signer);
          setContract(initContract);
          console.log("Contract", initContract);

          if (productId > 0 || provenanceData) {
            // console.log("Prueba");
            fetchProductData();
            console.log("product", productData);
            fetchProvenanceData();
          }
  
          console.log("Provider", web3auth.provider);
          setIsLoading(false);
        }else {
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

  const login = async () => {
    // IMP START - Login
    const web3authProvider = await web3auth.connect();
    // IMP END - Login
    setProvider(web3authProvider);
    

    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    // IMP START - Get User Information
    const user: Partial<UserInfo> = await web3auth.getUserInfo();

    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };


  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const signMessage = async (message: string) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      message,
      fromAddress,
      "test password!" // configure your own password here.
    );
    // uiConsole(signedMessage);

    if (!signedMessage) {
      throw new Error("Failed to sign message");
    }

    return signedMessage;
  };

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
    const result: any = await contract?.getParticipant(participantId);
    setParticipantData(result);
  };

  // const fetchProductData = async () => {
  //   const result = await contract?.getProduct(productId);
  //   console.log("PRODUCT DATA", result.data);
  //   setProductData(result.data);
  // };

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
      } else {
        console.error("No data found for product ID:", productId);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const fetchProvenanceData = async () => {
    const result = await contract?.getProvenance(productId);
    setProvenanceData(result);
  };

  const fetchOwnershipData = async () => {
    const result = await contract?.getOwnership(ownershipId);
    setOwnershipData(result);
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

 const addParticipant = async () => {
    try {
      setIsLoading(true);
      const message = "Hola, TraZableDLT pagará el gas por ti";
      const hash = hashMessage(message);
      // console.log("HASH", hash);
      const signature = await signMessage(message);
      // console.log("SIGNATURE", signature);

      if (!contract) {
        throw new Error("Contract not found");
      }

      const addParticipantTx = await contract.addParticipant(address, hash, signature, name, pass, participantType, participantAddress,{
        gasLimit: 5000000,
      });
      await addParticipantTx.wait();

      setParticipantData(await contract.getParticipant(participantId));

      toast("Participant added successfully");
    } catch (error) {
      console.error(error);
      toast.error('Error while adding participant. Try again.')
    } finally {
      setIsLoading(false);
    }
    console.log("ParticipantAddress", participantAddress);
    console.log("Adress", address);
    setName('');
    setPass('');
    setParticipantAddress('');
    setParticipantType('');
    setIsLoading(true)
  };
  //Solo podria dar de alta un producto el manufacturer conectado
  const addProduct = async () => {
    try {
      setIsLoading(true);
      const message = "Hola, TraZableDLT pagará el gas por ti";
      const hash = hashMessage(message);
      const signature = await signMessage(message);

      if (!contract) {
        throw new Error("Contract not found");
      }

      const addProductTx = await contract.addProduct(address, hash, signature, ownerId, modelNumber, partNumber, serialNumber, productCost,{
        gasLimit: 5000000,
      });
      await addProductTx.wait();

      setProductData(await contract.getProduct(productId));

      toast("Product added successfully");
    } catch (error) {
      console.error(error);
      toast.error('Error while adding product. Try again.')
    } finally {
      setIsLoading(false);
    }
    console.log("ParticipantAddress", participantAddress);
    console.log("Adress", address);
    setOwnerId(0);
    setModelNumber('');
    setSerialNumber('');
    setProductCost(0);
    // console.log("Adress", address);
  };
  console.log("Product Data", productData);

  const newOwner = async () => {
    try {
      setIsLoading(true);
      const message = "Hola, TraZableDLT pagará el gas por ti";
      const hash = hashMessage(message);
      const signature = await signMessage(message);

      if (!contract) {
        throw new Error("Contract not found");
      }

      const newOwnerTx = await contract.newOwner(address, hash, signature, user1, user2, theProductId,{
        gasLimit: 5000000,
      });
      await newOwnerTx.wait();

      setOwnershipData(await contract.getOwnership(ownershipId));

      toast('Product transfered successfully')
    } catch (error) {
      console.error(error);
      toast.error('Error while transfering product. Try again.')
    } finally {
      setIsLoading(false);
    }
    console.log("ParticipantAddress", participantAddress);
    console.log("Adress", address);
    setUser1(0);
    setUser2(0);
    setTheProductId(0);
  };

  const unloggedInView = (
      // <button onClick={login} className="card">
      <button className="bg-orange-300 p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-orange-200 transition-all disabled:opacity-80 text-xl font-semibold" onClick={login}>
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

      <button  className="bg-orange-300 p-2 text-xl font-bold text-center w-1/5 m-auto mt-4 mb-4 border-2 border-stone-800 rounded-md hover:bg-orange-200 transition-all disabled:opacity-80 text-xl font-semibold"  onClick={logout}>
        Log Out
      </button>
      {/* </div> */}
      {/* </div> */}
    </>
  );


  return (
    // <div className="flex flex-col items-center p-4">
    <div id="container" className="flex flex-col flex-center m-auto bg-orange-50 text-stone-800 bg-[url('../public/logistica_app.png')]  bg-no-repeat bg-center bg-contain">
    <div className="flex flex-col justify-between m-auto w-2/3 border-2 border-stone-800 rounded-md">

    {/* // <div id="container" className="flex flex-col flex-center m-auto bg-orange-50 text-stone-800  bg-no-repeat bg-center bg-contain"> */}
      {/* <ConnectButton /> */}
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
      {loggedIn && (
        <div className="flex flex-col items-center rounded-md">
          <div className="flex flex-row gap-5 w-full justify-center items-center">
            <img src={user?.profileImage} alt="TraZableDLT" />
            <div className="flex flex-row gap-3 items-left">
              <h2 className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-stone-800">
                name: {user?.name}</h2>
              <h2 className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-stone-800">
                email: {user?.email}</h2>
              <h2 className="bg-orange-100 border-2 border-stone-800 p-2 rounded-md w-auto mb-4 text-base md:text-xl text-stone-800">
                cuenta: {address}</h2>
            </div>
          </div>
          <DataEntry
            name={name}
            pass={pass}
            participantAddress={participantAddress}
            participantType={participantType}
            ownerId={ownerId}
            modelNumber={modelNumber}
            serialNumber={serialNumber}
            productCost={productCost}
            user1={user1}
            user2={user2}
            theProductId={theProductId}
            setName={setName}
            setPass={setPass}
            setParticipantAddress={setParticipantAddress}
            setParticipantType={setParticipantType}
            setOwnerId={setOwnerId}
            setModelNumber={setModelNumber}
            setSerialNumber={setSerialNumber}
            setProductCost={setProductCost}
            setUser1={setUser1}
            setUser2={setUser2}
            setTheProductId={setTheProductId}
            addParticipant={addParticipant}
            addProduct={addProduct}
            newOwner={newOwner}
            isLoading={isLoading}
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
        </div>
      )}
      {/* <p className="mt-4">ProductId: {actualProductId}</p>
    <p className="mt-4">ParticipantId: {actualParticipantId}</p> */}
    </div>
    </div>
  );


};
export default App

