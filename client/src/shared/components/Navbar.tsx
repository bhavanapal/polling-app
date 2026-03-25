import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../modules/auth/store/authStore";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export const Navbar=()=>{
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout=()=>{
        logout();
        localStorage.removeItem("token");
        navigate("/login");
    };
    return(
         <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
         <h1 className="text-xl font-bold tracking-tight">
          Poll<span className="text-indigo-500">Verse</span>
        </h1>
        <div className="flex items-center gap-3">
        <Button 
        variant="outline"
        onClick={handleLogout}
         className="flex items-center gap-2 border-white/20 hover:bg-red-500 hover:text-white transition"
        >
        <LogOut className="w-4 h-4"/>
            Logout
        </Button>
       </div>
        </div>
       </motion.nav>
    );
};