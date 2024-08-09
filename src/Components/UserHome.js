import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserHome.css'; 

function UserHome() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/new-user-register');
  };

  const handleSignInClick = () => {
    navigate('/new-user-login');
  };

  return (
    <div className="home-container">
        
      <div className="button-box">
      <h2>User Home</h2>
        <button className="button" onClick={handleRegisterClick}> Register as new user </button>
        
        <button className="button" onClick={handleSignInClick}> Sign in </button>
      </div>
    </div>
  );
}

export default UserHome;
