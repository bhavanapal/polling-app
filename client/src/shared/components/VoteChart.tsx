import type { Poll } from "../types/poll";
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface Props{
    polls:Poll[];
}
const VoteChart = ({polls}:Props) => {
  // transform data
  const chartData = polls.map((poll) => ({
    _id: poll._id,
    question: poll.question,
    voteCount: poll.options?.reduce(
     (sum, opt) => sum + opt.votes,
     0) || 0,
  }));

  return(
   <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
        <XAxis dataKey="question"  stroke="#94a3b8"
            tick={{ fontSize: 12 }}/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="voteCount" fill="#4f46e5"/>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VoteChart;