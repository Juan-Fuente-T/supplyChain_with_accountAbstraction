import { IProvider } from '@web3auth/base';
import { ethers, Provider, Signer } from 'ethers';

import Web3 from "web3";

export function uiConsole(...args: any[]): void {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
  }
  console.log(...args);
}

// export const signMessage = async (message: string, provider: any) => {
export const signMessage = async (message: string, signer: Signer) => {
  // const provider = new ethers.JsonRpcProvider(process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL);
    if (!signer) {
      uiConsole("provider not initialized yet");
      return;
    }
    console.log("Signer en SignMessage:", signer);
    // Obtén el signer del provider
    // const web3 = new Web3(provider as any);
  
    // Get user's Ethereum public address
    // const fromAddress = (await web3.eth.getAccounts())[0];
    
    // Firma el mensaje
    // Sign the message
    const signedMessage = await signer.signMessage(message);
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
