
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CarteleraForm from "./components/cartelera/CarteleraForm"
import CarteleraList from "./components/cartelera/CarteleraList"
import  Menu from './components/Navbar'
import {Container} from '@mui/material'
import SalaForm from './components/salas/SalaForm'
import SalaList from './components/salas/SalaList'
import Login from './components/auth/login'
import Registrar from './components/auth/registrar'
import ForgotPassword from './components/auth/olvidarps'
import ResetPassword from './components/auth/reiniciarps'
import VerifyEmail from './components/auth/verificacion'
import CarteleraDetails from './components/cartelera/CarteleraDetails'

export default function App() {
  return (
    <BrowserRouter >
    <Menu/>
     <Container >

     
      <Routes>
       <Route path='/' element={<CarteleraList/>} /> 
       <Route path='/cartelera/new' element={<CarteleraForm/>} /> 
       <Route path='/cartelera/:id/edit' element={<CarteleraForm/>} />
       <Route path="/salas" element={<SalaList />} />
       <Route path="/sala/new" element={<SalaForm />} />
       <Route path="/sala/:id/edit" element={<SalaForm />} />
       <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Registrar/>} /> 
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/cartelera/:id/" element={<CarteleraDetails />} />
      </Routes>
     </Container>
    </BrowserRouter>

  )
}
