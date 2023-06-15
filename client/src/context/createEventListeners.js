import { ethers } from "ethers";
import { ABI } from "../contract";
import { playAudio , sparcle} from "../utils/animation";
import { defenseSound } from "../assets";

const AddNewEvent = (eventFilter, provider, cb) =>{
   provider.removeListener(eventFilter);

   provider.on(eventFilter, (logs) => {
      const parsedLogs = (new ethers.utils.Interface(ABI)).parseLog(logs);

      cb(parsedLogs);
   });
}


const getCoords = (cardRef) => {
const {left , top, width, height} = cardRef.current.getBoundClientRect();

return {
   pageX: left + width /2,
   pageY: top + height / 2,
};
};

const emptyAccount = '0x0000000000000000000000000000000000000000';



const getCoords = (cardRef) => {
   const {left , top, width, height} = cardRef.current.getBoundClientRect();
   
   return {
      pageX: left + width /2,
      pageY: top + height / 2,
   };
   };

   
//https://github.com/adrianhajdin/project_web3_battle_game/blob/main/client/src/context/createEventListeners.js
