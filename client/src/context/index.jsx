import React, {useContext, useEffect, useState, useRef, createContext} from 'react';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal';

const GlobalContext = createContext();

export const GlobalContextProvider = ({children}) => {
   return (
      <GlobalContext.Provider value={{}}></GlobalContext.Provider>
   )
}