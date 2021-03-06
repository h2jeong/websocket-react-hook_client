import React, { useState } from 'react'
import { withRouter } from 'react-router-dom';

const Login = ({history}) => {
    const [userId, setUserId] = useState('')
    return (
        <div>
            <input type="text" placeholder="What is your name" onChange={e => setUserId(e.target.value)} />
            <button onClick={() => {
                fetch(`http://127.0.0.1:3001/users/${userId}`)
                .then(res => res.json())
                .then(json => localStorage.setItem('user', JSON.stringify(json)))
            }}>Ready?</button>
        </div>
    )
}

export default withRouter(Login)
