import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <TextField 
                label="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <TextField 
                type="password" 
                label="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
};

export default Login;
