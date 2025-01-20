import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import api from '../api';
import { Card, Form, Button } from 'react-bootstrap';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = location.state || { userRole: null }; // Get userRole from props
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
      [name]: name === 'assignedUserId' ? parseInt(value, 10) || null : value, // Ensure assignedUserId is a number or null
    });
    console.log('state:', formData.state);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      
      await api.put(`/tasks/${id}`, formData);
      console.log('Submitting formData:', formData);
      navigate(-1); // Go back to the previous page after updating
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
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
          {/* Only show assignedUserId field for managers */}
          {userRole === 'manager' && (
            <div className='mb-3'>
              <label htmlFor="assignedUserId">Assigned User ID:</label>
              <Form.Control
                type="number" // Use type="number" for numeric input
                id="assignedUserId"
                name="assignedUserId"
                value={formData.assignedUserId || ''} // Ensure a valid value for the input field
                onChange={handleChange}
              />
            </div>
          )}
          <div className='mb-3'>
            <label htmlFor="state">State:</label>
            <select id="state" className="form-select" name="state" value={formData.state} onChange={handleChange}>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              {/* Only allow managers to set the state to CLOSED */}
              {userRole === 'manager' && <option value="CLOSED">CLOSED</option>}
            </select>
          </div>
          {isLoading ? (
            <Button type="submit" disabled>Updating...</Button>
          ) : (
            <Button className='' type="submit">Update Task</Button>
          )}
          {error && <div className="error">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
    </div>
  );
};

export default TaskEdit;