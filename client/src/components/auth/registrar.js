import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Registrar = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            if (!username || !password || !email) {
                setError('Please fill in all fields');
                return;
            }

            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email, rol })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
            setError('Network error. Please try again.');
        }
    };

    return (
        <div>
            <h2>Registrar</h2>
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
            <TextField 
                label="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <TextField 
                label="Rol" 
                value={rol} 
                onChange={(e) => setRol(e.target.value)} 
            />
            <Button onClick={handleRegister}>Registrar</Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Registrar;
