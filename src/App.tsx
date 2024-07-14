import { useEffect, useState } from "react";
// IMP START - Quick Start
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, UserInfo, WEB3AUTH_NETWORK } from "@web3auth/base";
// IMP END - Quick Start

import "./App.css";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Contract, ethers, hashMessage, JsonRpcProvider, Wallet } from "ethers";
import { abi } from "./assets/abis/erc1155";
import { CONTRACT_ADDRESS } from "./assets/constants/index";
import { toast } from "react-toastify";
import Web3 from "web3";
import truncateEthAddress from 'truncate-eth-address';
 

// IMP START - SDK Initialization
// IMP START - Dashboard Registration
// const clientId = process.env.REACT_APP_CLIENT_ID; // get from https://dashboard.web3auth.io
// const clientId = "BGpGpXliyOvZqqOiBsC3il_LS37PYXTTWLmOFpU3aQFI7EseTEIoAR0TmFzcwkloA2gR6x2MYX9BCMcqzztt0faf0V0FquDt69peT6lhGcTJK2UoF2mCUo4ZJaILzd2bEShs6nQfV5YBOffL5VsnC8KPv7c49vkd24"; // get from https://dashboard.web3auth.io

const clientId =
  "BCrqDXodbfN-LAcUdfhNLc7CPeMVup9CrljBTrgOx9oOSlOGfPAkV9O_NfLlxts4ooEorHaJxftFSCgyP16m0sI"; // get from https://dashboard.web3auth.io

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
// IMP END - SDK Initialization

function App() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isApprove, setIsApprove] = useState<string | null>(null);
  const [balanceOf, setBalanceOf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const [provider, setProvider] = useState<IProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [address, setAddress] = useState<string>("");
  const [eth, setEth] = useState<string>("");
  const [destinyAddress, setDestinyAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(1);


  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       // IMP START - SDK Initialization
  //       await web3auth.initModal();
  //       // IMP END - SDK Initialization
  //       setProvider(web3auth.provider);

  //       if (web3auth.connected) {
  //         setLoggedIn(true);
  //       }
  //       if (!web3auth.provider) {
  //         throw new Error("Provider not initialized");
  //       }

  //       // const user = await web3auth.getUserInfo();
  //       // setUser(user);

  //       // const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
  //       //   web3auth.provider
  //       // );

  //       // const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
  //       // setSigner(w3aSigner);
  //       const user: Partial<UserInfo> = await web3auth.getUserInfo();
  //       setUser(user);

  //       const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
  //         web3auth.provider
  //       );

  //       const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
  //       setSigner(w3aSigner);

  //       const web3 = new Web3(web3auth.provider as any);

        
  //       let initAddress: any = await web3.eth.getAccounts();
  //       initAddress = initAddress[0];
        
  //       setAddress(initAddress);
        
      
  //       setEth(
  //         web3.utils.fromWei(
  //           await web3.eth.getBalance(initAddress as string), // Balance is in wei
  //           "ether"
  //         )
  //       );
  //       // console.log("isLoading", isLoading);
  //       // console.log("balanceOf", balanceOf);
        
  //       const provider: JsonRpcProvider = new JsonRpcProvider(
  //         process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL
  //       );

  //       const signer: ethers.Wallet = new Wallet(
  //         process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
  //         provider
  //       );
        
  //       const initContract = new Contract(CONTRACT_ADDRESS, abi, signer);
  //       setContract(initContract);

  //       setBalanceOf(await initContract.balanceOf(initAddress, 1));
  //       // console.log("balanceOf", balanceOf);

  //       // const balanceTx = await initContract.balanceOf(initAddress);
  //       // await balanceTx.wait();
  //       // setBalanceOf(balanceTx);
  useEffect(() => {
    const init = async () => {
      try {
        // IMP START - SDK Initialization
        await web3auth.initModal();
        // IMP END - SDK Initialization

        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }

        if (!web3auth.provider) {
          throw new Error("Provider not initialized");
        }

        const user: Partial<UserInfo> = await web3auth.getUserInfo();
        setUser(user);

        const w3aProvider: ethers.BrowserProvider = new ethers.BrowserProvider(
          web3auth.provider
        );

        const w3aSigner: ethers.JsonRpcSigner = await w3aProvider.getSigner();
        setSigner(w3aSigner);

        const web3 = new Web3(web3auth.provider as any);

        let initAddress: any = await web3.eth.getAccounts();
        initAddress = initAddress[0];
        // initAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

        setAddress(initAddress);
        // setAddress("0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
        console.log("Address", address);

        setEth(
          web3.utils.fromWei(
            await web3.eth.getBalance(initAddress as string), // Balance is in wei
            "ether"
          )
        );

        const provider: JsonRpcProvider = new JsonRpcProvider(
          process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL
        );

        const signer: ethers.Wallet = new Wallet(
          process.env.REACT_APP_WALLET_PRIVATE_KEY || "",
          provider
        );

        const initContract = new Contract(CONTRACT_ADDRESS, abi, signer);
        setContract(initContract);

        setBalanceOf(await initContract.balanceOf(initAddress, 1));

  
        setIsApprove(
          await initContract.isApprovedForAll(
            initAddress,
            CONTRACT_ADDRESS
          )
        );
      
        setIsLoading(false);
        console.log("isLoading_last", isLoading);
        // initContract.on('Transfer', async (from, to, value) => {
        // if (address === from || address === to){
        //   setBalanceOf(await initContract.balanceOf(initAddress, 1));
        // }
        //})

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  
  // useEffect(() => {
  //   if (balanceOf !== null) {
  //     console.log("balanceOf", balanceOf);
  //   }
  // }, [balanceOf]);

  // useEffect(() => {
  //   if (isLoading === false) {
  //   console.log("isLoading aun en true", isLoading);
  //   }
  // }, [isLoading]);
  const handleMint = async () => {
    try {
      setIsMinting(true);
      // if (!ethers.isAddress(address)) {
      //   throw new Error('Invalid recipient address');
      // }
      const message = "Hola, EducatETH pagará el gas por ti";
      const hash = hashMessage(message);
      const signature = await signMessage(message);
      console.log("Hash", hash);
      console.log("address", address);
      console.log("Signature", signature);
      //hash 0x3073e9989ac6f090ebb98c322ca55ab133c1de6e5ad787f0c9161ff4a89106b6
      //signature 0x0c0cfd41ffca4d767f7637740964e654147a9fe9f8edace6f1923bfea604088b04029a29ed6311cadb3c632837c9a34367c8ec1b85a96e59d5b10e03dded7e611b
      if (!contract) {
        throw new Error("Contract not found");
      }
     
      const mintTx = await contract.mint(hash, signature, address, 1, 1);
      await mintTx.wait();
      
      console.log("Prueba");
      setBalanceOf(await contract.balanceOf(address, 1));

      toast("Minted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while minting. Try again.");
    } finally {
      setIsMinting(false);
    }
  };

  // const handleApprove = async () => {
  //   try {
  //     setIsApproving(true);
      
  //     const contractUser = new Contract(CONTRACT_ADDRESS, abi, signer);
  //     const transferFromTx = await contractUser.approve(
  //       destinyAddress,
  //       amount
  //     );
  //     await transferFromTx.wait();

  //     setIsApprove(
  //       await contractUser.isApprovedForAll(
  //         address,
  //         destinyAddress
  //       )
  //     );

  //     toast("Approved successfully");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error while approving. Try again.");
  //   } finally {
  //     setIsApproving(false);
  //   }
  // };

  const onTransfer = async () => {
    if (!contract) {
      throw new Error("Contract not found");
    }
    if (!ethers.isAddress(destinyAddress)) {
      throw new Error('Invalid recipient address');
    }
    if(!isApprove){
      try {
        setIsApproving(true);
        
        const contractUser = new Contract(CONTRACT_ADDRESS, abi, signer);
        const approvalForAllTx = await contractUser.setApprovalForAll(
        CONTRACT_ADDRESS,
        true
      );
      await approvalForAllTx.wait();

      setIsApprove(
        await contractUser.isApprovedForAll(
          address,
          CONTRACT_ADDRESS
        )
      );

      toast("Approved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while approving. Try again.");
    } finally {
      setIsApproving(false);
    }
  }
    
    try {
      setIsTransferring(true);
      const transferFromTx = await contract.safeTransferFrom(
        address,
        destinyAddress,
        BigInt("1"), 
        BigInt(amount.toString()),
        "0x",
        {
          gasLimit: 1000000,
        }
      );
      await transferFromTx.wait();

      setBalanceOf(await contract.balanceOf(address, 1));
      // setIsApprove(
      //   await contract.isApprovedForAll(
      //     address,
      //     destinyAddress
      //   )
      // );

      toast("Minted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error while minting. Try again.");
    } finally {
      setIsTransferring(false);
    }
  };
  
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
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  };

  const logout = async () => {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // IMP START - Blockchain Calls
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

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  };

  const signMessage = async (message: string) => {
  // const signMessage = async () => {
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
  // IMP END - Blockchain Calls

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log("Args: ",...args);
    //antiguo y erroneo signMessage: 0x561acaecb5479e9cf043f1963307fb497666cd8b5ac907024ca99d385a913d835d642712d98c60d978cbd6a5daaface6fa5febdab3dafa15b599b058b773dd931b
  }                           //otro:0x0a53478d601643e22e65347f143fe631aab81a05107fb1d3d177f48b62e2a31a3c17c695e2ba0127ec91259b8b7e419a3e2d92cf096ab6bab8fd76da8cdd68161b

  const loggedInView = (
    <>
      <div className="flex items-center justify-center mx-auto ">
        {/* <div>
          <button onClick={getUserInfo} className="card">
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
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div> */}
        <div>
          <button onClick={logout} className="w-96 border border-zinc-500 bg-slate-900 rounded-lg flex items-center justify-center mx-auto my-4 p-3 text-2xl">
          {/* <button onClick={logout}  className="w-48 bg-red-500 font-bold text-center mt-24"> */}
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="w-96 border border-zinc-500 bg-slate-900 rounded-lg flex items-center justify-center mx-auto my-4 p-3 text-2xl">
      Login
    </button>
  );
  return (
    // <main className="flex min-h-screen flex-col items-center justify-center w-full  my-24" style={{ backgroundColor: '#08050d'}}>
    <main className="bg-slate-900 text-slate-200 flex min-h-screen flex-col items-center justify-center w-full h-full my-24 pb-24 mb-96 "> 
      <section className="space-y-5">
        <h1 className="text-4xl font-bold text-center mt-24">
          🚀 Mint your ERC1155 EducatETH NFT 🚀
        </h1>
        <h2 className="text-2xl font-semibold text-center my-36">
           in Arbitrum Sepolia
        </h2>
        <div id="log" className="w-120 border border-zinc-500 rounded-lg flex flex-row items-center justify-content-center mx-auto my-auto" style={{ backgroundColor: '#131524'}}>
          {loggedIn ? loggedInView : unloggedInView}</div>
        <div  style={{ whiteSpace: "pre-line" }} >
        <p style={{ whiteSpace: "pre-line" }}></p> 
        </div>
        {/* <div className="w-140 h-120 m-auto flex items-center justify-center rounded-lg" style={{ width: "600px", height: "600px", backgroundColor: '#5e606d' }}> */}
        <div className="bg-slate-600 w-140 h-140 m-auto flex items-center justify-center rounded-lg" style={{ width: "600px", height: "600px"}}>
          <img src="EducatETH.jpg" alt="Imagen del NFT de EducatETH" className="w-120 h-120 border border-slate-200 rounded-lg justify-content-center"/>
        </div>
        <div className="p-4 border border-zinc-500 flex flex-col gap-5 items-center rounded-xl" style={{ backgroundColor: '#131524'}}>
        {/* <div className="p-4 bg-slate-800 border border-zinc-500 flex flex-col gap-5 items-center rounded-xl"> */}
          {/* <ConnectButton showBalance={false} accountStatus={'avatar'} /> */}
          {!loggedIn? (
            <>
              <h2>First make sure your wallet is connected</h2>
            </>
          ) : (
            <>
            <div className="flex flex-col gap-5 items-center">
              <p className="text-xl  text-center">
                {/* 📇 <span className="font-bold">Address:</span>  {truncateEthAddress(address)} */}
                📇 <span className="font-bold">Address:</span>  {address}
              </p>
              <p className="text-xl  text-center">
                📊 <span className="font-bold">You own this number of NFTs:</span>{' '}
                {/* {isLoading? ( */}
                {isMinting? (
                  <span className="opacity-50">loading...</span>
                ) : (
                  balanceOf? balanceOf.toString() : "No NFTs"
                )}
              </p>
              <button
                // className="py-1 px-3 bg-zinc-800 rounded-lg hover:scale-105 transition-all disabled:opacity-50 text-xl"
                className="py-1 px-3 bg-slate-600 border-2 border-gray-300 rounded-lg hover:scale-105  hover:bg-slate-900 transition-all disabled:opacity-50 text-xl"
                onClick={handleMint}
                disabled={isMinting}
              >
                {isMinting? 'Minting...' : '📤 Mint token'}
              </button>
            </div>
          
      
        <div className="p-4 border border-zinc-500 flex flex-col gap-5 items-center rounded-xl" style={{ backgroundColor: '#131524'}}>
  
        <div className="flex flex-row gap-4">
          <div className="flex flex-col">
          <label htmlFor="DestinationAddress">Destination address:</label>
          <input
            type="text"
            placeholder="Destination Address"
            value={destinyAddress}
            onChange={(e) => setDestinyAddress(e.target.value)}
            className="border-2 border-gray-300 bg-slate-600 p-2 rounded-md w-full mb-4 text-base md:text-xl"
            // style={{ backgroundColor: '#5e606d', fontSize: '20px', width: '430px' }}
            />
          </div>
          <div className="flex flex-col">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            placeholder="Amount"
            min="1" 
            value={amount}
            // onChange={(e) => setAmount(Number(e.target.value))}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-slate-600 border-2 p-2 rounded-md w-24 mb-4 text-base md:text-xl"
            // style={{ backgroundColor: '#5e606d', fontSize: '20px' }}
            />
          </div>
          </div>
          <div>
          <button
            className="py-1 px-3 bg-slate-600 border-2 border-2 border-gray-300 text-white rounded-lg hover:bg-slate-900 hover:scale-105 transition-all disabled:opacity-60 text-xl"
            onClick={onTransfer}
            disabled={isTransferring ||!destinyAddress ||!amount}
          >
            {isTransferring? 'Transferring...' : '📤 Transfer tokens'}
          </button>
        </div>
      </div>
      </>
      )}
      </div>
      </section>
    </main>
  )
  // return (
  //   <div className="container">
  //     <h1 className="title">
  //       <a target="_blank" href="https://web3auth.io/docs/sdk/pnp/web/modal" rel="noreferrer">
  //         Web3Auth{" "}
  //       </a>
  //       & ReactJS (Webpack) Quick Start
  //     </h1>

  //     <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
  //     <div id="console" style={{ whiteSpace: "pre-line" }}>
  //       <p style={{ whiteSpace: "pre-line" }}></p>
  //     </div>

  //     <footer className="footer">
  //       <a
  //         href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/react-modal-quick-start"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Source code
  //       </a>
  //       <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fquick-starts%2Freact-modal-quick-start&project-name=w3a-evm-modal&repository-name=w3a-evm-modal">
  //         <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  //       </a>
  //     </footer>
  //   </div>
  // );
}

export default App;
