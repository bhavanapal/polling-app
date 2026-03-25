import { useEffect } from "react";
import { usePollStore } from "../../modules/polls/store/pollStore"
import { pollApi } from "../services/pollApi";
import { socket } from "../utils/socket";
import VoteChart from "../components/VoteChart";
import { Navbar } from "../components/Navbar";
import PollCard from "@/modules/polls/components/pollcard";
import {motion} from "framer-motion"


export const Dashboard=() => {
    const polls = usePollStore((state) => state.polls);
    const setPolls = usePollStore((state) => state.setPolls);

   const fetchPolls = async() => {
       const res = await pollApi.getAllPolls();
       setPolls(res.data);
     }

  useEffect(() => {
    fetchPolls();
    socket.connect();
    socket.on("pollUpdated", (updatedPolls) => {
        usePollStore.getState().updatePoll(updatedPolls)
    });
    return () => socket.disconnect();
  },[]);

  return(
    <div className="min-h-screen bg-slate-950 text-white">
        <Navbar/>
        <div className="max-w-7xl mx-auto px-4 py-6">
           {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
             <h1 className="text-3xl font-bold">
            Dashboard 📊
          </h1>
           <p className="text-gray-400 mt-1">
            Vote on polls and explore real-time results
          </p>
        </motion.div>
   
<div className="grid lg:grid-cols-3 gap-6">
            {/* left:polls */}
             <div className="lg:col-span-2 space-y-6">
              {polls.map((poll,index) => (
                <motion.div
                key={poll._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PollCard key={poll._id || index} poll={poll}/>
                </motion.div>
            ))}
             </div>

               {/* RIGHT: Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
               Vote Analytics 📈
              </h2>
              <p className="text-xs text-gray-400">
                 Total votes per poll
               </p>
              <VoteChart polls={polls} />
            </div>
          </motion.div>
          </div>
          </div>
    </div>
  );
};

