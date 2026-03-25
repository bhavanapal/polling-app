import type { pollschemaInput } from '../../modules/polls/Schema/pollSchema.ts';
import api from './clientAxios.ts';

export const pollApi = {
    // get all polls
    getAllPolls: () => api.get('/polls'),
    // get single poll
    getPoll: (pollId:string) => api.get(`/polls/${pollId}`),
    //admin create poll
    createPoll:(data:pollschemaInput) => api.post('/polls/create', data),
    // vote poll
     votePoll:(pollId:string, optionId:string) => api.post(`/polls/vote/${pollId}`,{optionId}),
    // deletePoll
    deletePoll:(pollId:string) => api.delete(`/polls/${pollId}`),
    // closePoll
    closePoll:(pollId:string) => api.patch(`/polls/close/${pollId}`)
};