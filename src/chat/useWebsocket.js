import React, { useEffect, useState } from 'react'

const useWebsocket = ({ url, onConnected }) => {
    const socket = useRef(null);
    const [messages, setMessages] = useState([]);
    const [reconnecting, setReconnecting] = useState(false)

    useEffect(() => {
        console.log('running socket hook');
        socket.current = new WebSocket(url);

        socket.current.onopen = () => {
            console.log('socket ready state', socket.current.readyState)
            onConnected(socket.current);
        };
        socket.current.onclose = () => {
            console.log('closed');
            if (socket.current) {
                if (reconnecting) return;
                setReconnecting(true);
                setTimeout(() => setReconnecting(false), 2000);
            }
        };
        socket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('message received ', data);
            
            setMessages((prev) => [...prev, data]);
        }

        return () => {
            socket.current.close();
            socket.current = null;
        }
    }, [reconnecting, url])

    function readyState() {
        switch (socket.current.readyState) {
            case 0:
                return 'CONNECTING';
            case 1:
                return 'OPEN';
            case 2:
                return 'CLOSING';
            case 3:
                return 'CLOSED';
            default:
                return;
        }
    }

    return {
        socket: socket.current,
        readyState,
        reconnecting,
        messages
    }
}

export default useWebsocket
