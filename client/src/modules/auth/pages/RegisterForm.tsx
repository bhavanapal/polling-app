import { useForm} from "react-hook-form";
import { zodResolver} from  "@hookform/resolvers/zod";
import { useAuthStore } from "../store/authStore.ts";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { signUpSchema, type SignUpInput } from "../Schema/authSchema.ts";
import { authApi } from "../../../shared/services/authApi.ts";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { motion } from "framer-motion";
import { useState } from "react";
import {EyeOff, Eye} from "lucide-react";


export const RegisterForm=() =>{
    const [showPassword , setShowPassword] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();
    const{register, handleSubmit, formState:{errors, isSubmitting},} = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async(data: SignUpInput) => {
        console.log("Form Data:", data);
        try{
          const res = await authApi.signUp(data);
          setAuth(res.data.user, res.data.token);
          localStorage.setItem('token', res.data.token);
          navigate('/login')
        } catch(err){
          if(axios.isAxiosError(err)){
            console.error("Signup error:", err.response?.data);
          } else{
            console.error("Signup error:", err);
          }
        }
    }

    return(
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
             {/* Animated wrapper */}
        <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
        >
       
          {/*glow background */}
          <div className="absolute -z-10 w-72 h-72 bg-indigo-600/20 blur-3xl rounded-full top-10 left-1/2 -translate-x-1/2"/>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                 Poll<span className="text-indigo-500">Verse</span>
                </h1>

              <p className="text-sm text-gray-400 mt-2">
               Vote instantly, see real-time results
              </p>
            </div>
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create Your Account</CardTitle>
                    <p className="text-sm text-gray-400">
                     Join PollVerse and start voting instantly
                    </p>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div className="space-y-1">
                <Label className="text-sm text-gray-300">User Name</Label>
                <Input type="text" placeholder="Enter your name" {...register('name')} required className="bg-white/5 border-white/10 focus:border-indigo-500"/>
                 {errors.name && (
                  <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p> )}
                </div>

                 <div className="space-y-1">
                 <Label className="text-sm text-gray-300">Email</Label>
                  <Input type="email" 
                  placeholder="Enter your email Id" 
                  {...register('email')} 
                  className="bg-white/5 border-white/10 focus:border-indigo-500"
                  />
                 {errors.email && (
                 <p className="text-red-500 text-sm">
                  {errors.email.message}
                 </p>
                 )}
                </div>

                <div className="space-y-1">
                <Label className="text-sm text-gray-300">Password</Label>
                <div className="relative">
                <Input type={showPassword ? "text" :"password"} 
                {...register('password')}
                className="bg-white/5 border-white/10 pr-10 focus:border-indigo-500"
                />
                <Button type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (<EyeOff className="w-4 h-4"/>):(
                    <Eye className="w-4 h-4"/>
                  )}
                </Button>
                </div>
                {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
                )}
                </div>
            {/* Button submit*/}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </Button>
            </form>
 
            <p className="text-center text-sm text-gray-400 mt-6">Already have a account?{""}
            <Link to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition"
            >Sign In
            </Link>
            </p>
            </CardContent>
            </Card>
            </motion.div>
            </div>    
    );
};
