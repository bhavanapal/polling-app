export interface User {
    id: string;
    name: string;
    email: string;
    role:"voter" | "admin";
}

export interface Option {
    _id:string;
   option: string;
   votes: number;
}

export interface Poll {
    _id: string;
    question: string;
    options: Option[];
    voteCount: number;
    createdAt: string;
    isClosed:boolean;
}