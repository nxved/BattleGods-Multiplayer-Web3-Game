import React from 'react';
import { PageHOC } from '../components';
import { useGlobalContext } from '../context';


const Home = () => {
const {contract, walletAddress} = useGlobalContext()
  return (
    <div>
<h1 className='text-xl'>{contract}</h1>
    </div>
  )
};

export default PageHOC(
  Home, <>Welcome to Battle Gods <br/> a NFT card Game</>,
  <>Conntect Your Wallet <br />The Ultimate Battle Card Game</>

);