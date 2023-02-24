import React from 'react';
import { PageHOC } from '../components';

const Home = () => {
  return (
    <div>
      <h1 className="text-5xl p-3">Battle Gods</h1>
      <h2 className="text-3xl p-3">NFT Battle Card Game</h2>
      <p className="text-xl p-3">Made with</p>
    </div>
  )
};

export default PageHOC(
  Home, <>Welcome to Battle Gods <br/> a NFT card Game</>,
  <>Conntect Your Wallet <br />The Ultimate Battle Card Game</>

);