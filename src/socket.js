import { io } from "socket.io-client";

const socket = io("https://qback-l4yd.onrender.com"); // backend Node.js

export default socket;
