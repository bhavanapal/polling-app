import { Server } from "socket.io";

let io;

export const socketLoader = (server) =>{
    io = new Server(server,{
        cors:{
            // origin:"*",
            origin:[
                process.env.FRONTEND_URL_LOCAL,
                process.env.FRONTEND_URL_PROD,
            ].filter(Boolean),
            methods:['GET', 'POST'],
            credentials:true,
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

// access anywhere
export const getIO = () => {
    if(!io){
        throw new Error("Socket.IO not initialized");
    }
    return io;
};