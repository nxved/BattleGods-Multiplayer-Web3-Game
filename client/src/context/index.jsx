import React, { useContext, useEffect, useState, useRef, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { ABI, ADDRESS } from '../contract';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   const [walletAddress, setWalletAddress] = useState("");
   const [provider, setProvider] = useState("");
   const [contract, setContract] = useState("");

   const updateCurrentWalletAddress = async () => {
      const accounts = await window.ethereum.request({
         method: 'eth_requestAccounts'
      });
      if (accounts) setWalletAddress(accounts[0]);
      console.log(accounts)
   }

   useEffect(() => {
      updateCurrentWalletAddress();

      window.ethereum.on('account changed', updateCurrentWalletAddress);
   }, []);

   useEffect(() => {
      const setSmartContractAndProvider = async () => {
         const web3modal = new Web3Modal();
         const connection = await web3modal.connect();
         const newProvider = new ethers.providers.Web3Provider(connection);
         console.log(newProvider)
         const signer = newProvider.signer();
         const newContract = new ethers.Contract(ADDRESS, ABI, signer);
         console.log(newContract)

         setProvider(newProvider);
         setContract(newContract);
      }
      setSmartContractAndProvider();
   }, []);

   return (
      <GlobalContext.Provider value={{
         contract, walletAddress
      }}>
         {children}
      </GlobalContext.Provider>
   )
}


export const useGlobalContext = () => useContext(GlobalContext);