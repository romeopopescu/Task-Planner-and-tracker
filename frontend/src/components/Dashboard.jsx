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
    const [userRole, setUserRole] = useState(null); 
    const [loadingRole, setLoadingRole] = useState(true); 
    const [loadingTasks, setLoadingTasks] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRoleAndTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = jwt_decode(token);
                console.log(decodedToken);
                setUserRole(decodedToken.role); 
                
                setUsername(decodedToken.username);
                console.log(username);
                setLoadingRole(false); 

                setLoadingTasks(true); 
                let response;
                let toFilter;
                if (decodedToken.role === 'manager') {
                  toFilter = await api.get('/tasks');
                  response = toFilter;
                  response.data = toFilter.data.filter(task => task.state !== 'CLOSED');
                } else if (decodedToken.role === 'user') {
                  toFilter = await api.get(`/tasks?assignedUserId=${decodedToken.id}`);
                  response = toFilter;
                  response.data = toFilter.data.filter(task => task.state !== 'CLOSED');
                }

                setTasks(response?.data || []); 
            } catch (error) {
                console.error('Error fetching user role or tasks:', error);
            } finally {
                setLoadingTasks(false); 
            }
        };

        fetchUserRoleAndTasks();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
    try {
      if (searchId === '') {
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
        const response = await api.get(`/tasks/${searchId}`);
        setTasks([response.data]);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/${taskId}/edit`, { state: { userRole } }); 
  };


    const handleDelete = async (taskId) => {
        try {
          await api.delete(`/tasks/${taskId}`);
    
          setTasks(tasks.filter((task) => task.id !== taskId));
        } catch (error) {
          console.error("Error deleting task:", error);
        }
      };

    if (loadingRole) {
        return <div>Loading user role...</div>;
    }

    if (userRole === 'admin') {
        return (
            <div className=''>
                <h2 className='d-flex justify-content-center align-items-center mt-5'>Admin Dashboard</h2>
                <p className='d-flex justify-content-center align-items-center mt-5'>Welcome, Administrator!</p>
                
            </div>
        );
    }

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

              <h4 className="mb-3">All Tasks</h4>
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