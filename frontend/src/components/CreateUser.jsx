import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Button, Card, Form} from 'react-bootstrap';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    managerId: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.post('/users', formData);
      navigate('/users');
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
      <Card className='shadow'>
        <Card.Body>
          <h2 className='text-center mb-2'>Create user</h2>
          <Form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor="username">Username:</label>
              <Form.Control
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="password">Password:</label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="role">Role:</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className='form-select'>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            {formData.role === 'user' && (
              <div className='mb-3'>
                <label htmlFor="managerId">Manager ID:</label>
                <Form.Control
                  type="number"
                  id="managerId"
                  name="managerId"
                  value={formData.managerId || ''}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className='d-flex justify-content-center'>
              <Button type="submit">Create User</Button>
            </div>
            {error && <div className="error d-flex justify-content-center">{error}</div>}
          </Form>
        </Card.Body>
      </Card>
    </div>
      );
};

export default CreateUser;