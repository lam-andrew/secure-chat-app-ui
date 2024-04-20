import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import HttpCall from "../components/HttpCall";
import WebSocketCall from "../components/WebSocketCall";

function SocketTest() {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [buttonStatus, setButtonStatus] = useState<boolean>(false);

    const handleClick = () => {
        setButtonStatus(!buttonStatus);
    };

    useEffect(() => {
        // Ensure to attempt connection only when buttonStatus is true
        if (buttonStatus) {
            console.log('Attempting to connect to socket...');
            const socket = io(`${process.env.REACT_APP_API_BASE_URL}`, {
                transports: ["websocket"]
            });
            
            console.log("SOCKET: ", socket)
            setSocketInstance(socket);

            socket.on("connect", () => {
                console.log("Socket connected:", socket);
                setLoading(false);
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                setLoading(true); // Consider setting loading back to true on connection error
            });

            socket.on('message', (msg) => {
                console.log('Message from server:', msg);
            });

            // Cleanup on unmount or buttonStatus change
            return () => {
                console.log('Disconnecting socket...');
                socket.disconnect();
            };
        }
    }, [buttonStatus]);

    return (
        <div className="App min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <h1 className="text-3xl font-bold mb-4">React/Flask App + socket.io</h1>
            <div className="line w-full max-w-4xl px-4">
                <HttpCall />
            </div>
            <div className="flex justify-center mt-4">
                {!buttonStatus ? (
                    <button
                        onClick={handleClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Turn Chat On
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleClick}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Turn Chat Off
                        </button>
                        <div className="line w-full max-w-4xl px-4 mt-4">
                            {!loading && socketInstance && <WebSocketCall socket={socketInstance} />}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SocketTest;
