import React, { useState, useEffect } from 'react';
import './style.css';
import { withRouter } from 'react-router-dom';
import useWebsocket from './useWebsocket'

const Chat = ({match}) => {
    const { socket, readyState, reconnecting, messages } = useWebsocket({
        url: 'ws://127.0.0.1:3002',
        onConnected
    })
    const [message, setMessage] = useState('')
    const user = localStorage.getItem('userId')

    function onConnected(socket) {
        socket.send(JSON.stringify({
            type: 'connect',
            user
        }))
    }

    const sendMessage = (e) => {
        const { recipient } = match.params;
        console.log(recipient);
        e.preventDefault();
        socket.send(
            JSON.stringify({
                type: 'say',
                sender: user,
                recipient,
                text: message
            })
        );
        setMessage('')
    }

    return reconnecting ? (
        <div>reconnectiong!</div>
    ) : (
        <form onSubmit={sendMessage}>
            <div className="chat">
                <div className="inner">
                    {messages
                    .filter((msg) => msg.type === 'say')
                    .map((msg, i) => (
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
