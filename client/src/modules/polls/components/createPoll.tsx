import { useCallback, useEffect, useState } from "react";
import { usePollStore } from "../store/pollStore";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { pollApi } from "../../../shared/services/pollApi";
import { pollSchema, type pollschemaInput } from "../Schema/pollSchema";
import toast from "react-hot-toast";
import axios from "axios";
import { socket } from "../../../shared/utils/socket";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";


export const CreatePoll =() => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const setPolls = usePollStore((state) => state.setPolls);
  const addPollToStore = usePollStore((state) => state.addPoll); 


  const fetchPolls = useCallback(async() => {
    try{
     const res = await pollApi.getAllPolls();
     setPolls(res.data);
    } catch(err){
      console.error("Fetch polls error:", err);
    }  
  },[setPolls]);

  const addPoll = async(data:pollschemaInput) => {
    try{
      const res = await pollApi.createPoll(data);
       if(addPollToStore){
        addPollToStore(res.data);
       } else{
        await fetchPolls();
       }
       toast.success("Poll created!");
        } catch(err){
            if(axios.isAxiosError(err)){
            console.error("Create poll error:", err.response?.data);
            toast.error(err.response?.data?.message || "Error creating poll");
          } else{
            console.error("Create poll error:", err);
            toast.error("Something went wrong")
          }
           
        }
  };

//   wrapper for button
const handleCreatePoll = async() => {
  const data={
        question,
        options:options
        .filter((opt) => opt.trim() !== "")
        .map((opt) => ({
          option:opt,
        })),
    };
    const result = pollSchema.safeParse(data);

    // validate
    if(!result.success){
      toast.error(result.error.issues[0].message || "Invalid input");
      return;
    }
    await addPoll(result.data);
    // reset form
    setQuestion("");
    setOptions(["",""]);
};

  useEffect(() => {
    fetchPolls();
    socket.on("Poll_created", (newPoll) => {
      addPollToStore(newPoll);
    });
    socket.on("vote_update", (updatedPoll) => {
      usePollStore.getState().updatePoll(updatedPoll);
    });
    return() => {
      socket.off("poll_created");
      socket.off("vote_update");
    };
  },[fetchPolls, addPollToStore]);


  return(
    <div className="max-w-2xl mx-auto p-4">
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
              Create New Poll 🗳️
            </CardTitle>
            <p className="text-sm text-gray-400">
              Ask a question and let users vote in real-time
            </p>
          </CardHeader>
      
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Poll Question</Label>
             <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Poll Question ?"
              className="bg-white/5 border-white/10 focus:border-indigo-500"
            />
          </div>
       
       <div>
        <Label className="text-sm text-gray-300">Options</Label>
        {options.map((opt, i) => (
          <motion.div
          key={i}
          initial={{opacity:0, x:-10}}
          animate={{opacity:1, x:0}}
          className="flex-gap-2 p-2"
          >
            <Input
            key={i}
            type="text"
            value={opt}
            onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
            }}
            placeholder={`Option ${i + 1}`}
            className="bg-white/5 border-white/10 focus:border-indigo-500"
            />
            {/* Remove button */}
            {options.length > 2 && (
              <Button type="button"
              variant="ghost"
              onClick={() => {
                const newOptions = options.filter((_, index:number) => index !== i);
                setOptions(newOptions);
              }}
              className="text-red-400 hover:text-red-300"
              >
               <Trash2 className="w-4 h-4"/>
              </Button>
            )}
            </motion.div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
           <Button 
           type="button"
           variant="outline"
           onClick={() => 
           {if(options[options.length - 1].trim() === ""){
            return toast.error("Fill current option first");
           }
            setOptions([...options, ""]);
          }}
           className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
            >
              <Plus className="w-4 h-4"/>
            Add Options
        </Button>
        <Button onClick={handleCreatePoll}
        disabled={
          !question.trim() || options.filter((o) => o.trim()).length < 2
        }
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
        >
            Create Poll
        </Button>
        </div>
        </CardContent>
        </Card>
        </motion.div>
    </div>
  )
}