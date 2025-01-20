// ViewUsers.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { ListGroup, Card } from 'react-bootstrap';

const ViewUsers = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  },);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
      <Card className='shadow'>
        <Card.Body>
          <h2 className='text-center'>Users</h2>
          <ListGroup>
            {users.map((user) => (
              <ListGroup.Item key={user.id}>
                {}{user.username} - {user.role}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewUsers;