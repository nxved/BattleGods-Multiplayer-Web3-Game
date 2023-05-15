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