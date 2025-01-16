import React, { useState } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const {logout} = useAuth()
    const navigate = useNavigate()

    function handleLogOut() {
        try {
            await logout()
            navigate('/login')
        }        
    }
  return (
    <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={handleLogOut}>Log out</Button>
    </div>
  )
}
