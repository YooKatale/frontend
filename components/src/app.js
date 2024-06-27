import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ManagerPage from './pages/ManagerPage'; 
import ProductEditorPage from './pages/ProductEditorPage'; 
import CustomerServicePage from './pages/CustomerServicePage'; 
import Unauthorized from './pages/Unauthorized'; 

const socket = io('http://localhost:4400');  // ensure url matches backend server's url

function App() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('newUser', (newUser) => {
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    socket.on('newNotification', (newNotification) => {
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    });

    return () => {
      socket.off('connect');
      socket.off('newUser');
      socket.off('newNotification');
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <h1>Real-Time Data</h1>
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.username}</li>
            ))}
          </ul>
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id}>{notification.message}</li>
            ))}
          </ul>
          <Switch>
            <ProtectedRoute path="/manager" component={ManagerPage} allowedRoles={['Manager']} />
            <ProtectedRoute path="/product-editor" component={ProductEditorPage} allowedRoles={['ProductEditor']} />
            <ProtectedRoute path="/customer-service" component={CustomerServicePage} allowedRoles={['CustomerService']} />
            <Route path="/unauthorized" component={Unauthorized} />
            {/* other routes */}
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
