// src/pages/VerifyEmail.js

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            fetch(`http://localhost:4000/verify-email?token=${token}`)
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        console.log('Verification success:', data.message);
                        navigate('/login'); // Redirige al login después de la verificación exitosa
                    } else if (data.error) {
                        console.error('Verification failed:', data.error);
                        // Maneja el error (e.g., mostrar un mensaje)
                    }
                })
                .catch(error => {
                    console.error('Verification failed:', error);
                    // Maneja el error
                });
        }
    }, [token, navigate]);

    return (
        <div>
            <h2>Verificando email...</h2>
        </div>
    );
};

export default VerifyEmail;
