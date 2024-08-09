
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';
import axios from 'axios';


const UserLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };


  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { 
        user_id: userId,
        password: password,
      });

      console.log("sign in response", response);

      if (response.data.status === 'success') {
        // Save user_id to local storage
        localStorage.setItem('user_id', userId);
        
        // Show success message in popup
        setPopupMessage('Sign-in successful! Redirecting...');
        setShowPopup(true);
        
        // Redirect to ProjectManagement component after popup closes
        setTimeout(() => {
          setShowPopup(false); // Close the popup
          navigate('/project-management');
        }, 2000); // Adjust the timeout as needed
      } else {
        console.error('Sign-in failed:', response.data.message || 'Unknown error');
        // Show error message in popup
        setPopupMessage(`Sign-in failed: ${response.data.message || 'Unknown error'}`);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('An error occurred during sign-in:', error);
      // Show error message in popup
      setPopupMessage(`An error occurred during sign-in: ${error.message}`);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
    setPopupMessage(''); // Clear the popup message
  };

  return (
    <div className="user-management">
      {/* Popup message */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      <h2>User Login</h2>
      <button onClick={handleHome}>🏡 Home</button>
      <div>
        <label>User ID</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
};

export default UserLogin;