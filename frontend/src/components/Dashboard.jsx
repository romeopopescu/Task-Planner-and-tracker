import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [username, setUsername] = useState('');
    const [searchId, setSearchId] = useState('');
    const [userRole, setUserRole] = useState(null); // Default to `null` instead of an empty string
    const [loadingRole, setLoadingRole] = useState(true); // State to track role loading
    const [loadingTasks, setLoadingTasks] = useState(false); // State to track task fetching
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRoleAndTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwt_decode(token);
                console.log(decodedToken);
                setUserRole(decodedToken.role); // Set user role
                
                setUsername(decodedToken.username);
                console.log(username);
                setLoadingRole(false); // Mark role as loaded

                setLoadingTasks(true); // Start fetching tasks
                let response;
                if (decodedToken.role === 'manager') {
                    response = await api.get('/tasks');
                } else if (decodedToken.role === 'user') {
                    response = await api.get(`/tasks?assignedUserId=${decodedToken.id}`);
                }

                setTasks(response?.data || []); // Set tasks or empty array
            } catch (error) {
                console.error('Error fetching user role or tasks:', error);
            } finally {
                setLoadingTasks(false); // Stop task loading
            }
        };

        fetchUserRoleAndTasks();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
    try {
      if (searchId === '') {
        // If searchId is empty, refetch the initial task list
        let response;
        if (userRole === 'manager') {
          response = await api.get('/tasks');
        } else if (userRole === 'user') {
          const token = localStorage.getItem('token');
          const decodedToken = jwt_decode(token);
          response = await api.get(`/tasks?assignedUserId=${decodedToken.id}`);
        }
        setTasks(response?.data ||'');
      } else {
        // Otherwise, search for the task with the given ID
        const response = await api.get(`/tasks/${searchId}`);
        setTasks([response.data]);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleEdit = (taskId) => {
    // Use navigate to redirect to the edit page with the task ID
    navigate(`/tasks/${taskId}/edit`, { state: { userRole } }); // Pass userRole as state
  };


    const handleDelete = async (taskId) => {
        try {
          // Make API call to delete the task
          await api.delete(`/tasks/${taskId}`);
    
          // Update the task list
          setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
          console.error("Error deleting task:", error);
          // ... (handle error, e.g., display error message)
        }
      };

    // Delay rendering until userRole is loaded
    if (loadingRole) {
        return <div>Loading user role...</div>;
    }

    // Render admin-specific content if userRole is 'admin'
    if (userRole === 'admin') {
        return (
            <div>
                <h2>Admin Dashboard</h2>
                <p>Welcome, Administrator!</p>
                
            </div>
        );
    }

    // Render tasks and search for 'manager' and 'user'
    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
  <Card style={{ width: '30rem' }} className="shadow">
    <Card.Body>
      {loadingTasks ? (
        <div className="text-center">
          <span className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading tasks...</p>
        </div>
      ) : (
        <>
          {userRole !== 'admin' && (
            <>
              <h3 className="text-center mb-4">Welcome, {username}!</h3>
              <Form onSubmit={handleSearch} className="d-flex mb-4">
                <Form.Control
                  type="text"
                  placeholder="Enter Task ID"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button type="submit" variant="primary" className="ms-2">
                  Search
                </Button>
              </Form>

              <h4 className="mb-3">Your Tasks</h4>
              {tasks.length === 0 ? (
                <p className="text-muted">No tasks found.</p>
              ) : (
                <ListGroup>
                  {tasks.map((task) => (
                    <ListGroup.Item
                      key={task.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <Link to={`/tasks/${task.id}`} className="text-decoration-none">
                          <strong>{task.description}</strong> - <span className="text-muted">{task.state}</span>
                        </Link>
                      </div>
                      <div>
                        {userRole === 'manager' && task.managerId === jwt_decode(localStorage.getItem('token')).id && (
                          <>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEdit(task.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(task.id)}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        {userRole === 'user' && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(task.id)}
                          >
                            Edit
                          </Button> 
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </>
      )}
    </Card.Body>
  </Card>
</div>

            
    );
};

export default Dashboard;