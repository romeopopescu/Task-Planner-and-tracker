import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../api';
import { Card, Form, Button } from 'react-bootstrap';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = location.state || { userRole: null }; 
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    assignedUserId: null,
    state: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        setFormData({
          description: response.data.description,
          assignedUserId: response.data.assignedUserId,
          state: response.data.state,
        });
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
      
    setFormData({
      ...formData,
      [name]: name === 'assignedUserId' ? parseInt(value, 10) || null : value,
    });
    console.log('state:', formData.state);
  };

  const handleCloseTask = async () => {
    try {
      await api.put(`/tasks/${id}`, { state: 'CLOSED' });
      navigate('/');
    } catch (error) {
      console.error('Error closing task:', error);
      setError('Failed to close task');
    }
  };

  const handleCompleteTask = async () => {
    try {
      await api.put(`/tasks/${id}`, { state: 'COMPLETED' });
      navigate('/');
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      
      console.log(formData);
      if (userRole === 'manager' && formData.assignedUserId) {
        
        if (formData.state === 'OPEN') {
          formData.state = 'PENDING';
        }
      }
      await api.put(`/tasks/${id}`, formData);
      console.log('Submitting formData:', formData);
      navigate(-1); // te intoarce la pagina anterioara
    } catch (error) {
      console.error('Error updating task:', error);
      setError(
        <div className="d-flex justify-content-center align-items-center vh-100"> 
          <div className="text-danger">Failed to update task</div> 
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading task...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
    <Card className='shadow'>
      <Card.Body>
        <h2 className='text-center mb-3'>Edit task</h2>
        <Form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="description">Description:</label>
            <Form.Control
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {/* aratam assignedUserId doar pt managers */}
          {userRole === 'manager' && (
            <div className='mb-3'>
              <label htmlFor="assignedUserId">Assigned User ID:</label>
              <Form.Control
                type="number" 
                id="assignedUserId"
                name="assignedUserId"
                value={formData.assignedUserId || ''} 
                onChange={handleChange}
              />
            </div>
          )}
          <div className='mb-3'>
                <label htmlFor="state">State:</label>
                <p>{formData.state}</p> 
          </div>

          {userRole === 'manager' && formData.state === 'COMPLETED' && (
              <Button variant="primary"className='m-3' onClick={handleCloseTask}>
                Close Task
              </Button>
            )}
            {userRole === 'user' && formData.state === 'PENDING' && (
              <Button variant="primary"className='m-3' onClick={handleCompleteTask}>
                Complete Task
              </Button>
            )}

          {isLoading ? (
            <Button type="submit"className='m-3' disabled>Updating...</Button>
          ) : (
            <Button className='m-3' type="submit">Update Task</Button>
            
          )}
          {error && <div className="error">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
};

export default TaskEdit;