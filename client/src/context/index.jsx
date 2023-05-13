import React, { useContext, useEffect, useState, useRef, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { ABI, ADDRESS } from '../contract';

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   const [walletAddress, setWalletAddress] = useState("");
   const [battleGround, setBattleGround] = useState('bg-astral')
   const [provider, setProvider] = useState("");
   const [contract, setContract] = useState("");

   useEffect(() => {
      const isBattleGround = localStorage.getItem("battleground")
    if  (isBattleGround){
      setBattleGround(isBattleGround);
    }
    else{
      localStorage.setItem('battleground' , battleGround)
    }
   }, [])

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

   useEffect(() =>{
if(step == -1 && contract){
   createEventListners({
      navigate,
      contract,
      provider,
      walletAddress,
      setShowAlert,
      player1Ref,
      player2Ref,
      setUpdateGameData,
   })
}
   },[step])

   useEffect(() => {

   })

   useEffect(() => {
      if(showAlert?.status){
         const timer = setTimeout(() => {
            setShowAlert({status: false, type : 'info', message: ''});
         },[5000])

      return () => clearTimeout(timer);
   }
   })

   useEffect(() => {
      if (errorMessage) {
        const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length).slice(0, -1);
  
        if (parsedErrorMessage) {
          setShowAlert({
            status: true,
            type: 'failure',
            message: parsedErrorMessage,
          });
        }
      }
    }, [errorMessage]);

   return (
      <GlobalContext.Provider value={{
         contract, walletAddress
      }}>
         {children}
      </GlobalContext.Provider>
   )
}


export const useGlobalContext = () => useContext(GlobalContext);