import React, { useContext, useEffect, useState, useRef, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   const [walletAddress, setWalletAddress] = useState("");

   const updateCurrentWalletAddress = async () => {
      const accounts = await window.ethereum.request({
         method: 'eth_requestAccounts'
      });
      console.log(accounts)
   }

   useEffect(() => {
      updateCurrentWalletAddress();
   },[]);

   useEffect(() => {
      const setSmartContractAndProvider = async () => {
         const web3modal = new Web3Modal();
         const connection = await web3modal.connect();
         const newProvider = new ethers.providers.Web3Provider(connection);
         const signer = newProvider.signer();
         const newContract = new ethers.Contract();

      }
      setSmartContractAndProvider();
   },[]);
   return (
      <GlobalContext.Provider value={{
         demo: 'naved'
      }}>
         {children}
      </GlobalContext.Provider>
   )
}


export const useGlobalContext = () => useContext(GlobalContext);