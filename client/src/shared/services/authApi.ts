import api from "./clientAxios.ts";
import type {SignUpInput, SignInInput}  from "../../modules/auth/Schema/authSchema.ts";

export const authApi = {
    signUp: (data: SignUpInput) => api.post('/user/register', data),
    signIn: (data: SignInInput) => api.post('/user/login', data),
}