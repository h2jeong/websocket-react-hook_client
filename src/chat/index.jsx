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
    }
    function onClose(e) {}
    function onMessage(e) {
        console.log(e.data)
    }

    const sendMessage = (e) => {
        e.preventDefault();

        console.log(match.params)
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
