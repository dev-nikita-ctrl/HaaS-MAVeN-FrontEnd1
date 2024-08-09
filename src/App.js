import './App.css';
import React from 'react';
import ResourceManagement from './Components/ResourceManagement';
import ProjectManagement from './Components/ProjectManagement';
import UserHome from './Components/UserHome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLogin from './Components/UserLogin';
import UserRegister from './Components/UserRegister';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/new-user-register" element={<UserRegister />} /> {/* New user Register route */}
        <Route path="/new-user-login" element={<UserLogin />} /> {/* New user Login Route */}
        <Route 
          path="/project-management" 
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          } 
        /> {/* New route for ProjectManagement */}
        <Route 
          path="/resource-management"
          element={
            <ProtectedRoute>
              <ResourceManagement />
            </ProtectedRoute>
          } 
        /> {/* New route for ResourceManagement */}
      </Routes>
    </Router>
  );
}

export default App;
