import { io } from "socket.io-client";

const socket = io("https://qback-l4yd.onrender.com:3001"); // backend Node.js

export default socket;
