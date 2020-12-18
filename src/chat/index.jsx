import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { withRouter } from 'react-router-dom';

const Chat = ({match}) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([]);
    const socket = useRef(null);
    const user = localStorage.getItem('userId')

    useEffect(() => {
        connect();

        socket.current.onopen = onOpen;
        socket.current.onclose = onClose;
        socket.current.onmessage = onMessage;

        return () => {
            socket.current.close();
        }

    }, [])

    function connect() {
        socket.current = new WebSocket('ws://127.0.0.1:3002');
    }

    function onOpen(e) {
        console.log('socket ready state', socket.current.readyState)
        socket.current.send(
            JSON.stringify({
                type: 'connect',
                user
            })
        )
    }
    function onClose(e) {}
    function onMessage(e) {
        const data = JSON.parse(e.data);
        console.log(data);
        switch (data.type) {
            case 'say':
                setMessages((prev) => [...prev, data]);
                break;
            default:
                break;
        }
    }

    const sendMessage = (e) => {
        const { recipient } = match.params;
        console.log(recipient);
        e.preventDefault();
        socket.current.send(
            JSON.stringify({
                type: 'say',
                sender: user,
                recipient,
                text: message
            })
        );
        setMessage('')
    }

    return (
        <form onSubmit={sendMessage}>
            <div className="chat">
                <div className="inner">
                    {messages.map((msg, i) => (
                        <div key={i} className="message">
                            {msg.sender === user ? 'You' : msg.sender} : {msg.text}
                        </div>
                    ))}
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                    <input type="submit" value="Send" />
                </div>
            </div>
        </form>
    )
}

export default withRouter(Chat)
