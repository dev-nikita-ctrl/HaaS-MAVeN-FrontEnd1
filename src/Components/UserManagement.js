
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';
import axios from 'axios';


const UserManagement = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { 
        user_id: userId,
        password: password,
      });

      console.log("sign in response", response)

      if (response.data.status === 'success') {
        // Assuming the API responds with a success flag
        navigate('/project-management'); // Redirect to the ProjectManagement component
      } else {
        console.error('Sign-in failed:', response.data.message || 'Unknown error');
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error);
      // Handle network errors or other issues
    }
  };

  const handleNewUser = async () => {
    try {
      // Make a POST request to the backend to create a new user
      const response = await axios.post('http://127.0.0.1:5000/add_user', { 
        user_id: userId,
        password: password,
      });

      console.log("handle new user response", response)
  
      if (response.data.status === 'success') {
        // Assuming the API responds with a success flag
        console.log('New user created:', response.data);
      } else {
        console.error('User creation failed:', response.data.message || 'Unknown error');
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('An error occurred during user creation:', error);
      // Handle network errors or other issues
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <button onClick={handleNewUser}>New User?</button>
      <button onClick={handleSignIn}>Sign in</button>
      <div>
        <label>User ID</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
    </div>
  );
};

export default UserManagement;