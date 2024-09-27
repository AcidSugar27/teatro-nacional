import * as React from 'react';
import { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link,  Box, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';



const defaultTheme = createTheme();

const Registrar = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
      event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
      setError('');
  
      if (!nombre || !apellido || !email || !password) {
          setError('Todos los campos son obligatorios');
          return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setError('Ingrese un email válido');
          return;
      }
  
      if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
      }
  
      try {
          const response = await fetch('http://localhost:4000/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ nombre, apellido, password, email, rol })
          });
          const data = await response.json();
  
          if (response.ok) {
              alert('Registro exitoso. Ahora puedes iniciar sesión.');
              navigate('/login');
          } else {
              setError(data.error || 'Ocurrió un error durante el registro');
          }
      } catch (error) {
          console.error('Error de red:', error);
          setError('Error de conexión. Por favor, intente de nuevo.');
      }
  };
  

    return (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Registrarse
              </Typography>
              <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="nombre"
                      required
                      fullWidth
                      id="nombre"
                      label="Nombre"
                      autoFocus
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="apellido"
                      label="Apellido"
                      name="apellido"
                      autoComplete="family-name"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Direccion de correo"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="contraseña"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Registrarse
                </Button>
                {error && <Typography color="error" align="center">{error}</Typography>}
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login" variant="body2">
                      ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
           
          </Container>
        </ThemeProvider>
      );
    }

export default Registrar;
