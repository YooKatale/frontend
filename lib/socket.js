/**
 * Socket.IO client singleton.
 * Connects directly to the API server (not through Vercel proxy) because
 * WebSocket connections cannot be proxied by Vercel rewrites.
 *
 * Usage:
 *   import { connectSocket, disconnectSocket } from "@lib/socket"
 *   const socket = connectSocket(userJwtToken)
 */

import { io } from "socket.io-client";

// The Render server URL — used for WebSocket connections (bypasses Vercel proxy)
const SOCKET_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_ORIGIN) ||
  "https://yookatale-server.onrender.com";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }
  return socket;
};

/**
 * Connect (or return already-connected) socket.
 * @param {string} [token] - Optional JWT. Pass user token for auth'd rooms.
 */
export const connectSocket = (token) => {
  const s = getSocket();
  if (token) s.auth = { token };
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
