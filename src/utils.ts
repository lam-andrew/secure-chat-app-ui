import { Socket } from "socket.io-client";
import CryptoJS from 'crypto-js';
import { UserProfile } from "./types/UserProfile";


const secretKey = process.env.REACT_APP_SECRET_KEY;

export const addSystemMessage = (text: string, socket: Socket, user: UserProfile): void => {
  if (!socket || !user) return;
  const encryptedMessage = encryptMessage(text);
  const systemMessage = {
    text: encryptedMessage,
    googleId: 0,    // Useless to systemMessage but a required param
    username: user.name,          // Useless to systemMessage but a required param
    profilePicUrl: user.picture,  // Useless to systemMessage but a required param
    from: 'system',
    timestamp: Date.now()
  };
  socket.emit('data', systemMessage);
};

export const encryptMessage = (text: string) => {
  if (!secretKey) {
    console.error("Secret key is not set.");
    return '';
  }
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryptMessage = (cipherText: string) => {
  if (!secretKey) {
    console.error("Secret key is not set.");
    return '';
  }
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};