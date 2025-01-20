import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import jwt_decode from 'jwt-decode';
import { Card } from 'react-bootstrap';

const TaskDetails = () => {
  const { id } = useParams(); 
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
        const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // functia care se ocupa cu editarea taskului
  const handleEdit = () => {
    navigate(`/tasks/${id}/edit`); 
  };

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
        <Card className='shadow'>
            <Card.Body>
                <h2>Task Details</h2>

                {/* detaliile despre task */}
                <div>
                    <strong>ID:</strong> {task.id}
                </div>
                <div>
                    <strong>Manager ID:</strong> {task.managerId}
                </div>
                <div>
                    <strong>Description:</strong> {task.description}
                </div>
                <div>
                    <strong>State:</strong> {task.state}
                </div>
                <div>
                    <strong>Assigned User ID:</strong> {task.assignedUserId}
                </div>
                {task.closedAt && (
                    <div>
                    <strong>Closed At:</strong> {task.closedAt}
                    </div>
                )}
                {task.closedBy && (
                    <div>
                    <strong>Closed By:</strong> {task.closedBy}
                    </div>
                )}
                { 
                (userRole === 'manager' && task.managerId === jwt_decode(localStorage.getItem('token')).id) && (
                    <button onClick={handleEdit}>Edit Task</button>
                )}
            </Card.Body>
        </Card>
    </div>
  );
};

export default TaskDetails;