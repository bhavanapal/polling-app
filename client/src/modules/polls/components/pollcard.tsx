import toast from "react-hot-toast";
import { pollApi } from "../../../shared/services/pollApi";
import { usePollStore } from "../store/pollStore";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "@/shared/utils/socket";
import type { Poll } from "@/shared/types/poll";
import {motion} from "framer-motion";

interface Props{
    poll:Poll;
}

const PollCard =({poll}:Props) =>{
    const {id} = useParams();
    const {updatePoll} = usePollStore();

    useEffect(() => {
        if(!id) return;
        pollApi.getPoll(id)
        .then((res) => {
            console.log("Fetched poll:", res.data);
            updatePoll(res.data);
        })
        .catch((err) => {
            console.error("Fetch error:", err);
        });
    },[id, updatePoll]);

    // real-time updates
    useEffect(() => {
        if(!poll._id) return;

        socket.emit("join_poll", poll._id);

        const handler = (updatedPoll: Poll) => {
            console.log("socket update:", updatedPoll);
            updatePoll(updatedPoll);
        };
          socket.on("pollUpdated", handler); 
              return() => {
            socket.off("pollUpdated", handler);
        };
    },[poll._id, updatePoll]);

    // handle vote
    const handleVote = async(optionId: string) => {
        if(!poll?._id){
            toast.error("Poll not loaded yet");
            return;
        }
        if(!optionId){
            toast.error("Invalid option");
            return;
        }

        try{
            console.log("Voting:",{pollId:poll._id, optionId});
            const res = await pollApi.votePoll(poll._id, optionId);
             updatePoll(res.data);
            console.log("Vote response:", res.data);
            toast.success("Vote submitted!");  
        }catch(err){
         if(axios.isAxiosError(err)){
            console.error("vote not submitted!", err.response?.data);
            toast.error(err.response?.data?.message || "Error")
          } else{
            console.error("voting failed:", err);
          }
    };
}

if(!poll) return <p className="text-center text-gray-400">Loading poll...</p>;

const totalVotes = poll.options?.reduce((sum,o) => sum + o.votes, 0) || 1;

return(
    <div className="max-w-md mx-auto p-4">
         <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
      >
    <h2 className="text-lg font-semibold mb-4">{poll.question}</h2>

    <div className="space-y-3">
        {poll.options?.map((opt) => {
            const percent = (opt.votes / totalVotes)*100;

            return(
                <div key={opt._id} className="space-y-1">
                    <Button disabled={poll.isClosed}
                    onClick={() => handleVote(opt._id)}
                     className="w-full justify-between bg-slate-800 hover:bg-indigo-600 transition text-left"
                    >
                        <span>{opt.option}</span>
                        <span className="text-xs text-gray-300">
                            {percent.toFixed(0)}%
                        </span>
                    </Button>

                      {/*Vote Animated Progress Bar */}
                <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-2 bg-indigo-500 rounded"
                  />
                </div>
                <p className="text-xstext-gray-400 text-right">{opt.votes} votes</p>
                </div>
            );
        })}
    </div>
    <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
          <span>Total votes: {totalVotes}</span>
          {poll.isClosed && (
         <span className="text-red-400">This poll is closed</span>
    )}
    </div> 
    </motion.div>
    </div>
);
};

export default PollCard




