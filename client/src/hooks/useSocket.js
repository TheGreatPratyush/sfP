import { useEffect, useRef, useState } from "react";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const useSocket = (eventName, onEvent) => {
    const socketRef = useRef(null);
    const callbackRef = useRef(onEvent);

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        callbackRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        let socket;

        const connect = async () => {
            try {
                const { io } = await import("socket.io-client");

                socket = io(SOCKET_URL, {
                    transports: ["websocket"],
                });

                socketRef.current = socket;

                socket.on("connect", () => {
                    setConnected(true);
                });

                socket.on("disconnect", () => {
                    setConnected(false);
                });

                if (eventName) {
                    socket.on(eventName, (data) => {
                        callbackRef.current?.(data);
                    });
                }
            } catch (error) {
                console.error(
                    "Unable to connect to Socket.IO:",
                    error
                );

                setConnected(false);
            }
        };

        connect();

        return () => {
            if (socket) {
                socket.disconnect();
            }

            socketRef.current = null;
            setConnected(false);
        };
    }, [eventName]);

    return {
        socket: socketRef.current,
        connected,
    };
};

export default useSocket;