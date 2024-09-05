import React, { useState } from 'react';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            return setMessage('Las contraseñas no coinciden');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        try {
            const response = await fetch(`http://localhost:4000/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Contraseña restablecida exitosamente');
            } else {
                setMessage(data.error || 'Error al restablecer la contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error al restablecer la contraseña');
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar Nueva Contraseña:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Restablecer Contraseña</button>
            </form>
        </div>
    );
};

export default ResetPassword;
