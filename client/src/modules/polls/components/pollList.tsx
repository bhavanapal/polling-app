import toast from "react-hot-toast";
import { pollApi } from "../../../shared/services/pollApi";
import { Button } from "../../../components/ui/button";
import { usePollStore } from "../store/pollStore";
import type { User } from "../../../shared/types/poll";
import { useEffect } from "react";
import { socket } from "../../../shared/utils/socket";
import { motion } from "framer-motion";

interface pollList{
    user: User | null;
}

export const PollList = ({user}:pollList) => {
    const {polls, deletePoll, updatePoll} = usePollStore();

    const handleDelete = async(id: string) => {
        if(!confirm("Are you sure you want to delete this poll?")) return;

        try{
            await pollApi.deletePoll(id);
            deletePoll(id);
            toast.success("Poll deleted");
        }catch{
            toast.error("Failed to delete");
        }
    };

    const handleClose = async(id:string) => {
        if(!confirm("Are you sure you want to close this poll?")) return;

        try{
            const res = await pollApi.closePoll(id);
            updatePoll(res.data);
            toast.success("Poll closed");
        } catch{
            toast.error("Failed to close poll");
        }
    };

    useEffect(() => {
        socket.on("poll_deleted", deletePoll);
        socket.on("poll_updated", updatePoll);

        return() => {
            socket.off("poll_deleted", deletePoll);
            socket.off("poll_updated",updatePoll);
        };
    },[deletePoll, updatePoll]);

    return(
        <div className="space-y-6 p-4">
            {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                return(
                     <motion.div
                      key={poll._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg"
                     >
                    <h2 className="text-lg font-semibold mb-4">{poll.question}</h2>
                    {/* vote options */}
                    <ul className="space-y-3">
                        {poll.options.map((opt,i) => {
                            const widthPercent = (opt.votes/totalVotes)*100;

                            return(
                                <li key={`${poll._id}-${i}`}>
                                    <div className="flex justify-between text-sm mb-1">
                                     <span>{opt.option}</span>
                                     <span>{opt.votes}</span>
                                    </div>
                                <div className="w-full bg-white/10 h-3 rounded overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${widthPercent}%` }}
                                   transition={{ duration: 0.6 }}
                                   className={`h-3 rounded bg-indigo-500`}
                                />
                                     <div></div> 
                                </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Admin controls */}
                    {user?.role === "admin" && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                            <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(poll._id)}
                            className="bg-red-400 text-white rounded"
                            >
                            Delete
                            </Button>

                            {!poll.isClosed && (
                                <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleClose(poll._id)}
                                className="bg-gray-400 text-white rounded"
                                >
                                    Close Poll
                                </Button>
                            )}

                 {poll.isClosed && (
                  <span className="text-red-400 text-sm font-medium">
                    Closed
                  </span>
                )}
                        </div>
                    )}
                  </motion.div>
                );
            })}
        </div>
    );
    };