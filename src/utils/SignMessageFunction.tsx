import { Signer } from 'ethers';
// import Web3 from "web3";

/**
 * Logs messages to the console and updates the UI.
 * 
 * @param args - The arguments to be logged
 */
export function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
  console.log(...args);
}

/**
 * Signs a message using the provided signer.
 * 
 * @param message - The message to be signed
 * @param signer - The signer object used to sign the message
 * @returns A promise that resolves to the signed message
 * @throws Error if the signer is not initialized or if signing fails
 */
export const signMessage = async (message: string, signer: Signer) => {
  // const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL);
    if (!signer) {
      uiConsole("provider not initialized yet");
      return;
    }
    // console.log("Signer en SignMessage:", signer);

    // Get the signer from provider using web3
    // const web3 = new Web3(provider as any);
  
    // Get user's Ethereum public address using web3
    // const fromAddress = (await web3.eth.getAccounts())[0];
    
    // Sign the message
    const signedMessage = await signer.signMessage(message);
    // Sign the message using web3
    // const signedMessage = await web3.eth.personal.sign(
    //   message,
    //   fromAddress,
    //   "TraZableDLT_Wave-Labs_24" // configure your own password here.
    // );
    // uiConsole(signedMessage);

    if (!signedMessage) {
      throw new Error("Failed to sign message");
    }

    return signedMessage;
  };
