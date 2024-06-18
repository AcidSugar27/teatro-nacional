import React from 'react'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import {Box} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {

    const navigate = useNavigate()

  return (
    <Box sx={{flexGrow: 1}}>
        <AppBar position='static' color='transparent'>
            <Container>
                <Toolbar>
                    <Typography variant='h6' sx={{ flexGrow: 1}}>
                        <Link to='/' style={{textDecoration:'none', color:'#eee'}}>TEATRO NACIONAL</Link>
                    </Typography>

                    <Button 
                    variant='contained' 
                    colors='primary' 
                    onClick={() => navigate("/cartelera/new")}
                    >
                       Agregar a cartelera
                    </Button>
                    <Button color="inherit" component={Link} to="/login">
                     Login
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                     Register
                    </Button>

                </Toolbar>
       
            </Container>
        </AppBar>
    </Box>
  )
}
