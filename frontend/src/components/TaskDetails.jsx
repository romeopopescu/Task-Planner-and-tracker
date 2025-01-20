// TaskDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import jwt_decode from 'jwt-decode';

const TaskDetails = () => {
  const { id } = useParams(); // Get the task ID from the URL parameters
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the task details using the task ID
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

  // Function to handle editing the task
  const handleEdit = () => {
    navigate(`/tasks/${id}/edit`); // Navigate to the edit page for the task
  };

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Task Details</h2>

      {/* Display task ID, manager ID, and other details */}
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
      {/* Conditionally display closedAt and closedBy */}
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
      { /* Show edit button if the user is a manager and created the task */
      (userRole === 'manager' && task.managerId === jwt_decode(localStorage.getItem('token')).id) && (
        <button onClick={handleEdit}>Edit Task</button>
      )}
    </div>
  );
};

export default TaskDetails;