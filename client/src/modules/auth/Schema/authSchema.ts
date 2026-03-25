import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(3,"Username must be at least 3 characters"),
    email : z.string().email('Invalid email format'),
    password:z.string().min(6 , 'Password must be at least 6 characters log'),
    })

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters log')
});

export type SignInInput = z.infer<typeof signInSchema>;