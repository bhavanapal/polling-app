import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "../Schema/authSchema";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { authApi } from "../../../shared/services/authApi";
import axios from "axios";
import { motion} from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


export const SignIn=()=>{
    const login = useAuthStore((state) => state.setAuth);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const{register, handleSubmit,formState:{errors}}=useForm<SignInInput>({resolver: zodResolver(signInSchema),
    });

    const onSubmit=async(data:SignInInput) => {
        console.log("Login Data:", data);
         try{
            const res = await authApi.signIn(data);
            login(res.data.user, res.data.token);
            localStorage.setItem('token', res.data.token);
            if(res.data.user.role === "admin"){
                navigate("/admin");
            } else{
                navigate("/dashboard");
            }
        }catch(err){
          if(axios.isAxiosError(err)){
            console.log("Signup error:", err.response?.data);
            alert(err.response?.data?.message || "Login failed");
          } else{
            console.error("Signup error:", err);
          }
        }
         }


 return(
       <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
              {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-3xl rounded-full top-10 left-1/2 -translate-x-1/2" />
        {/* Animated container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
          <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Poll<span className="text-indigo-500">Verse</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Welcome back — sign in to continue
          </p>
        </div>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                <Label className="text-gray-300">Email</Label>
                <Input 
                type="email" 
                placeholder="Enter your email id"
                {...register('email')}
                 className="bg-white/5 border-white/10 focus:border-indigo-500"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
                 <div className="space-y-1">
                <Label className="text-gray-300">Password</Label>
                <div className="relative">
                 <Input 
                 type={showPassword ? "text": "password" }
                 {...register('password')}
                  className="bg-white/5 border-white/10 pr-10 focus:border-indigo-500"
                 />
                 <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>
                <Button type = "submit" className="w-full bg-indigo-600 hover:bg-indigo-500 transition">Login</Button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">Don't have account?{""}
                    <Link to="/register"
                 className="text-indigo-400 hover:text-indigo-300"
                    >Sign Up</Link></p>
                </CardContent>
            </Card>
            </motion.div>
        </div>    
    );

}