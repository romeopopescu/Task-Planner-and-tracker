import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/auth/login', { username, password });
      // Store the JWT in localStorage
      localStorage.setItem('token', response.data.accessToken);
      // Redirect to the dashboard
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <Card className="shadow">
  <Card.Body>
    <h2 className="text-center mb-4">Log In</h2>
    {error && <Alert variant="danger">{error}</Alert>}
    <Form onSubmit={handleSubmit}>
      <Form.Group id="username">
        <Form.Label>Username</Form.Label>
        <Form.Control 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </Form.Group>
      <Form.Group id="password">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </Form.Group>
      <Button className="w-100 mt-2" type="submit">
        Log In
      </Button>
    </Form>
  </Card.Body>
  
</Card>


    </div>
  );
};

export default Login;