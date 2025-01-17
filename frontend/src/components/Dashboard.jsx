import React, { useState, useRef } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const {logout} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleLogOut() {
        try {
            setError('')
            setLoading(true)
            await logout()
            navigate('/login')
        }catch {
            setError('Failed to log out')
        } 

        setLoading(false)

    }
  return (
    <div className='w-100 text-center mt-2'>
        <Button variant='link' onClick={handleLogOut} to='/login'>Log out</Button>
    </div>
  )
}
