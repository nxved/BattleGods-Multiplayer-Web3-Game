import React, { useContext, useEffect, useState, useRef, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { ABI, ADDRESS } from '../contract';
import { GetParams } from '../utils/onboard'

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
   const [walletAddress, setWalletAddress] = useState("");
   const [battleGround, setBattleGround] = useState('bg-astral')
   const [provider, setProvider] = useState("");
   const [contract, setContract] = useState("");
   const [step, setStep] = useState(1);
   const [gameData, setGameData] = useState({ players: [], pendingBattles: [], activeBattle: null });
   const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });
   const [battleName, setBattleName] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [updateGameData, setUpdateGameData] = useState(0);

   const player1Ref = useRef();
   const player2Ref = useRef();

   const navigate = useNavigate();

   useEffect(() => {
      const isBattleGround = localStorage.getItem("battleground")
      if (isBattleGround) {
         setBattleGround(isBattleGround);
      }
      else {
         localStorage.setItem('battleground', battleGround)
      }
   }, [])


   useEffect(() => {
      const resetParams = async () => {
         const currentParam = await GetParams();
         setStep(currentParam.step);
      };
      resetParams();
      window?.ethereum?.on('chainChanged', () => resetParams());
      window?.ethereum?.on('accountsChanged', () => resetParams());
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

      window.ethereum.on('accountsChanged', updateCurrentWalletAddress);
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

   useEffect(() => {
      if (step == -1 && contract) {
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
   }, [step])

   useEffect(() => {
      const fetchGameData = async () => {
         if (contract) {
            const fetchedBattles = await contract.getAllBattles();
            const pendingBattles = fetchedBattles.filter((battle) => battle.battleStatus === 0);
            let activeBattle = null;

            fetchedBattles.forEach((battle) => {
               if (battle.players.find((player) => player.toLowerCase() === walletAddress.toLowerCase())) {
                  if (battle.winner.startsWith('0x00')) {
                     activeBattle = battle;
                  }
               }
            })
         }
         setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle })
      };
      fetchGameData();
   }, [contract, updateGameData])

   useEffect(() => {
      if (showAlert?.status) {
         const timer = setTimeout(() => {
            setShowAlert({ status: false, type: 'info', message: '' });
         }, [5000])

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
         player1Ref,
         player2Ref,
         battleGround,
         setBattleGround,
         contract,
         gameData,
         walletAddress,
         updateCurrentWalletAddress,
         showAlert,
         setShowAlert,
         battleName,
         setBattleName,
         errorMessage,
         setErrorMessage
      }}>
         {children}
      </GlobalContext.Provider>
   )
}

export const useGlobalContext = () => useContext(GlobalContext);