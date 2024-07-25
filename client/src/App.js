
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CarteleraForm from "./components/CarteleraForm"
import CarteleraList from "./components/CarteleraList"
import  Menu from './components/Navbar'
import {Container} from '@mui/material'
import SalaForm from './components/salas/SalaForm'
import SalaList from './components/salas/SalaList'
import Login from './components/auth/login'
import Registrar from './components/auth/registrar'



export default function App() {
  return (
    <BrowserRouter>
    <Menu/>
     <Container>

     
      <Routes>
       <Route path='/' element={<CarteleraList/>} /> 
       <Route path='/cartelera/new' element={<CarteleraForm/>} /> 
       <Route path='/cartelera/:id/edit' element={<CarteleraForm/>} />
       <Route path="/salas" element={<SalaList />} />
       <Route path="/sala/new" element={<SalaForm />} />
       <Route path="/sala/:id/edit" element={<SalaForm />} />
       <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Registrar/>} /> 
    
       
      </Routes>
     </Container>
    </BrowserRouter>

  )
}
