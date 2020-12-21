import React, { useState, useEffect } from 'react';
import './style.css';
import { withRouter } from 'react-router-dom';
import useWebsocket from './useWebsocket'

const Chat = ({ match }) => {
    const { socket, reconnecting, messages, setMessages } = useWebsocket({
        url: 'ws://127.0.0.1:3002',
        onConnected
    })
    const [message, setMessage] = useState('')
    const [recipient, setRecipient] = useState(undefined)
    const user = JSON.parse(localStorage.getItem('user'));
    const { recipientId } = match.params;
    useEffect(() => {
    console.log(recipientId)

    fetch(`http://127.0.0.1:3001/users/${recipientId}`)
      .then((res) => res.json())
      .then((json) => setRecipient(json));

    fetch(`http://127.0.0.1:3001/chats/${recipientId}/${user._id}`)
      .then((res) => res.json())
      .then((json) =>
        setMessages(
          json.map((message) => {
            return {
              type: 'say',
              ...message,
            };
          }),
        ),
      );
  }, [recipientId]);

    function onConnected(socket) {
        socket.send(
            JSON.stringify({
            type: 'connect',
            userId: user._id
        }))
    }

    function sendMessage (e) {
        // const { recipient } = match.params;
        e.preventDefault();
        // if (message.length < 1) return;
        console.log(user, recipient)
        // recipient is null error
        socket.send(
            JSON.stringify({
                type: 'say',
                sender: user._id,
                recipient: recipientId,
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
                            {msg.sender === user._id ? 'You' : recipient.name} : {''}
                            {msg.text}
                        </div>
                    ))}
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                    <input type="submit" value="Send" />
                </div>
            </div>
            {recipient && (<div> Chatting with {recipient.name}</div>)}
        </form>
    )
}

export default withRouter(Chat)
