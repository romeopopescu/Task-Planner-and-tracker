import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar.jsx';
import TaskEdit from './components/TaskEdit';
import CreateUser from './components/CreateUser';
import ViewUsers from './components/ViewUsers';
import TaskForm from './components/TaskForm';
import TaskHistory from './components/TaskHistory';
import TaskDetails from './components/TaskDetails.jsx';
// ... other imports for TaskList, TaskForm, etc. (we'll add these later)

const Layout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element:<PrivateRoute> <Layout /> </PrivateRoute>,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/tasks/:id', 
        element: <TaskDetails />,
      },
      {
        path: '/tasks/:id/edit',
        element: <TaskEdit />, 
      },
      {
        path: '/users/create',
        element: <CreateUser />,
      },
      {
        path: '/users',
        element: <ViewUsers />,
      },
      {
        path: '/tasks/new',
        element: <TaskForm />,
      },
      {
        path: '/history',
        element: <TaskHistory />,
      },
      
      
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  
  // ... other routes like 404 Not Found (we'll add these later)
]);



const App = () => {
  return (
    <main>
      
      <RouterProvider router={router} />
    </main>
  );
};

export default App;