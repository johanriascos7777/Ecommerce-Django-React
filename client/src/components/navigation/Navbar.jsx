import React from 'react'
import { Link } from 'react-router-dom'
import Alert from '../../components/Alert'

export const Navbar = () => {
  return (
    <>
    <div className='w-full bg-slate-500'>
      <ul className='flex justify-between text-white p-3'>
        <li>elemento 1</li>
        <li>elemento 2</li>
        <li>elemento 3</li>
        <li>elemento 4</li>
        <li><Link to="/login">Ingresar</Link></li>
        <li><Link to="/signup" >Registrarse</Link></li>
      </ul>
    </div>
    <Alert/>
    </>
  )
}
