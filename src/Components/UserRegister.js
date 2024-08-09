
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRegister.css';
import axios from 'axios';



const UserRegister = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };


  const handleNewUser = async () => {
    try {
      // Make a POST request to the backend to create a new user
      const response = await axios.post('http://127.0.0.1:5000/add_user', { 
        user_id: userId,
        password: password,
      });

      console.log("handle new user response", response);

      if (response.data.status === 'success') {
        // Assuming the API responds with a success flag
        console.log('New user created:', response.data);
        
        // Show success message in popup
        setPopupMessage('New user created successfully!');
        setShowPopup(true);
        
        // Redirect to home page after popup closes
        setTimeout(() => {
          setShowPopup(false); // Close the popup
          navigate('/');
        }, 2000); // Adjust the timeout as needed
      } else {
        console.error('User creation failed:', response.data.message || 'Unknown error');
        // Show error message in popup
        setPopupMessage(`User creation failed: ${response.data.message || 'Unknown error'}`);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('An error occurred during user creation:', error);
      // Show error message in popup
      setPopupMessage(`An error occurred during user creation: ${error.message}`);
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
      <h2>User Register</h2>
      <button onClick={handleHome}>🏡 Home</button>
      <div>
        <label>User ID</label>
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button class="register" onClick={handleNewUser}>Register</button>
    </div>
  );
};

export default UserRegister;