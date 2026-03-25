import { create } from "zustand";
import type { User } from "../../../shared/types/poll";


interface AuthState {
    user: User  | null;
    token: string | null;
    setAuth: (user: User , token: string) => void; 
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
user: JSON.parse(localStorage.getItem("auth-user") || "null"),
token:localStorage.getItem("auth-token"),
setAuth:(user,token) =>{
    localStorage.setItem("auth-user", JSON.stringify(user));
    localStorage.setItem("auth-token", token);
    set({user,token}) ;
},
logout: () =>{
    localStorage.removeItem("auth-user");
    localStorage.removeItem("auth-token");
    set({user:null, token:null})
},
}));

export const getToken =() => useAuthStore.getState().token;