import React, { useState } from 'react';
import { Avatar, Link, Button, CssBaseline, TextField, Box, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
      event.preventDefault();
      setError('');
  
      if (!email || !password) {
          setError('Por favor, ingrese email y contraseña');
          return;
      }
  
      try {
          const response = await fetch('http://localhost:4000/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });
          const data = await response.json();
  
          if (response.ok) {
              localStorage.setItem('token', data.token);
              navigate('/');
          } else {
              setError(data.error || 'Credenciales inválidas');
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
              Iniciar sesión
              </Typography>
              <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Direccion de correo"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error" align="center">{error}</Typography>}
                <Grid item xs>
                  <Button variant="text" onClick={() => navigate('/forgot-password')}>
                                    ¿Olvidaste tu contraseña?
                  </Button>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                >
                  Loguearse
                </Button>
                <Grid container justifyContent="flex-end">       
                  <Grid item>
                  <Link href="/register" variant="body2">
                      ¿No tienes una cuenta? Registrate
                  </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      );
    }
export default Login;
