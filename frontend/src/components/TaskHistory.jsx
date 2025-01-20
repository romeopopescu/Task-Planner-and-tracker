import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import api from "../api";
import { Card, Form, Button, ListGroup, Badge } from 'react-bootstrap';

const TaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(""); 
  const [noTasksFound, setNoTasksFound] = useState(false);

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role);

        const response = await api.get(`/tasks/history/${decodedToken.id}`);
        setTasks(response?.data || []);
      } catch (error) {
        console.error("Error fetching task history:", error);
        setError("Failed to fetch task history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskHistory();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/tasks/history/${userId}`);
      const fetchedTasks = response?.data || [];
      setTasks(fetchedTasks);
      setNoTasksFound(fetchedTasks.length === 0);
      setError(null); 
    } catch (error) {
      console.error("Error fetching task history:", error);
      setError("Failed to fetch task history.");
    }
  };

  if (loading) {
    return <div>Loading task history...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <Card className="shadow">
        <Card.Body>
      <h2 className="text-center mb-3">Task History</h2>

      {userRole === "manager" && (
        <Form onSubmit={handleSearch} className="d-flex mb-4">
          <Form.Control
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button type="submit" className="ms-2">Search</Button>

        </Form>
      )}

      {error && <div className="error">{error}</div>}

      {noTasksFound && <p>No tasks found for the specified user.</p>}

        {Array.isArray(tasks) && tasks.length > 0 && (
        <ListGroup>
          {tasks.map((task) => (
            <ListGroup.Item key={task.id} className="d-flex justify-content-between">
              <span>{task.description}</span>
              <Badge bg={task.state === "COMPLETED" ? "success" : "warning"}>
                {task.state}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
 
        </Card.Body>
      </Card>
   </div>
  );
};

export default TaskHistory;
