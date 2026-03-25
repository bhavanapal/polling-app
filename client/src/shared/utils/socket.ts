import {io} from "socket.io-client"

// const BASE_URL = import.meta.env.VITE_API_URL
const SOCKET_URL = import.meta.env.VITE_API_URL.replace("/api/v1", "");


export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials:true,
});