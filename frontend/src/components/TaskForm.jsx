// TaskForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Card, Form, Button} from 'react-bootstrap';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    assignedUserId: '', // Use a text input for assignedUserId
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
      // Convert assignedUserId to a number before sending the request
      const numericAssignedUserId = parseInt(formData.assignedUserId, 10) || null; // Handle empty input
      await api.post('/tasks', { ...formData, assignedUserId: numericAssignedUserId });
      navigate('/');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-50 mt-5">
      <Card className='shadow'>
        <Card.Body>
          <h2 className="text-center mb-3">Create task</h2>
          <Form onSubmit={handleSubmit} className='d-flex mb-4'>
                <Form.Control
                  type="text"
                  id="description"
                  name="description"
                  placeholder='Enter description'
                  value={formData.description}
                  onChange={handleChange}
                />
            <Button style={{minWidth: "120px"}}type="submit" className="ms-2">Create Task</Button>
            {error && <div className="error">{error}</div>}
          </Form>
        </Card.Body>
      </Card>
    
    </div>
  );
};

export default TaskForm;