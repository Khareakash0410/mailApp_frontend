import {io} from "socket.io-client";
import { setOnline } from "../slice/SocketSlice";


// if working with non react component and want react hookes then get through passing as parameter in function -------


let socket = null;

let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

function connectToSocket (dispatch, userId) {
   socket = io(url, {transports:["websocket"]});


   socket.on("connect", () => {
    dispatch(setOnline(true));
    socket.emit("addUser", userId);
   });


   socket.on("disconnect", () => {
    dispatch(setOnline(false));
   });

   return socket
}

export const getSocket = () => socket;


export default connectToSocket;