import { useAuthStore } from "../../modules/auth/store/authStore"
import { CreatePoll } from "../../modules/polls/components/createPoll"
import { PollList } from "../../modules/polls/components/pollList"
import { Navbar } from "../components/Navbar"
import { motion } from "framer-motion"

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar/>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            Admin Dashboard ⚡
          </h1>
          <p className="text-gray-400 mt-1">
            Create polls, manage voting, and analyze results
          </p>
        </motion.div>

           <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT: Create Poll */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <CreatePoll />
          </motion.div>

          {/* RIGHT: Poll List */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <PollList user={user} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard