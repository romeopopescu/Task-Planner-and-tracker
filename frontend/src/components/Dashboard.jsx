import React, { useState, useRef } from 'react'
import { Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const { logout, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    //functia pentru a face logout-ul cu succes, 
    // este called de buttonul de jos
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
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Profile</h2>
          {error && <Alert variant='danger'>{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
          <Button variant='link' onClick={handleLogOut} to='/login'>Log out</Button>
      </div>
    </>
    
  )
}
