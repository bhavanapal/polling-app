import { create } from "zustand";
import type { Poll } from "../../../shared/types/poll";

interface PollState {
    polls:Poll[];
    setPolls:(polls:Poll[]) => void;
    addPoll:(poll:Poll) => void;
    updatePoll:(poll:Poll) => void;
    deletePoll:(id:string) => void;
}

export const usePollStore = create<PollState>((set) => ({
    polls: [],
    setPolls: (polls) => set({polls}),
    addPoll:(poll) => set((state) => ({polls:[...state.polls,poll] })),
    updatePoll:(poll) => set((state) => {
        const exists = state.polls.some((p) => p._id === poll._id);

        return{
            polls:exists
            ? state.polls.map((p) => p._id === poll._id ? poll:p)
            : [...state.polls,poll],
        };
    }),
    deletePoll:(id) => set((state) => ({
        polls:state.polls.filter((p) => p._id !== id),
    })),
}));











// setLoading:(loadig:boolean) => void;
// setError:(error: string | null) => void;
// import type { createcandidateInput } from "@/modules/polls/Schema/pollSchema";
// import type { PollState } from "@/modules/polls/Schema/types";
// import { pollApi } from "@/shared/services/candidateApi";
// import {voteCount} from "@/shared/services/candidateApi";
// import { candidateApi } from "@/shared/services/candidateApi";
// import {create} from "zustand";


// export const useCandidateStore=create((set)=>({
//     candidates:[],
//     fetchCandidates:async()=>{
//         const res=await candidateApi.voteCount();
//         set({candidates:res.data})
//     }
// }));

// interface PollState{ 
//     polls: Poll[]
//     fetchPolls:()=>Promise<void>
//     vote:(pollId: string, optionIndex:number) => Promise<void>
//     setPolls:(polls:Poll[]) =>void
// }

// export const useCandidateStore = create<PollState>((set)=>({
//     polls:[],
//     currentPoll: null,
//     loading:false,
//     error: null,

//     // fetch all polls
//     fetchPolls: async() => {
//         try{
//             set({loading: true});
//             const res = await pollApi.listPolls();

//             set({
//               polls: res.data,
//               loading: false,  
//             });
//         }catch(err:any){
//             set({
//                 error: err.message,
//                 loading:false,
//             });
//         }
//     },

//     // fetch single poll
//     fetchPoll: async(pollId: string) => {
//         try{
//             set({loading: true});
//             const res = await pollApi.getPoll(pollId);

//             set({
//                 currentPoll: res.data,
//                 loading:false,
//             });
//         } catch(err:any){
//             set({
//                 error:err.message,
//                 loading:false,
//             });
//         }
//     },

//     // create poll
//     createdPoll: async(data: createPollInput) => {
//         try{
//             set({loading:true});
//             await pollApi.createPoll(data);
//             const res = await pollApi.listPolls();

//             set({
//                 polls: res.data,
//                 loading:false,
//             });
//         } catch(err:any){
//             set({
//                 error:err.message,
//                 loading:false,
//             });
//         }
//     },

//     // vote poll
//     vote: async(pollId: string,optionId: string) => {
//        try{
//         await pollApi.vote(pollId, optionId);
//         const res = await pollApi.getPoll(pollId);

//         set({
//             currentPoll: res.data,
//         });
//        } catch(err:any){
//         set({
//             error: err.message,
//         });
//        }
//     },
//     setPolls:(polls:any)=>set({polls})
// }))