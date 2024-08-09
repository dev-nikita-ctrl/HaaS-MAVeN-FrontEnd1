import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectManagement.css';
import axios from 'axios';

const ProjectManagement = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [existingProjectId, setExistingProjectId] = useState('')
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const onLogOut = () => {
    navigate('/');
    localStorage.clear()
  };


  const handleCreateProject = async () => {
    try {
      // Make a POST request to create a new project
      const response = await axios.post('https://haas-maven-backend-d0f245db3484.herokuapp.com/create_project', { 
        project_name: projectName,
        description: description,
        project_id: projectId
      });

      if (response.data.status === 'success') {
        // Show a success message in the popup
        setPopupMessage('Project created successfully!');
      } else {
        // Show an error message in the popup
        setPopupMessage(`Project creation failed: ${response.data.message || 'Unknown error'}`);
      }
      setShowPopup(true); // Show the popup

    } catch (error) {
      // Handle network errors or other issues and show an error message in the popup
      setPopupMessage(`An error occurred during project creation: Project ID already exists`);
      setShowPopup(true); // Show the popup
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
    setPopupMessage(''); // Clear the popup message
  };

  const handleUseExistingProject = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      localStorage.setItem('project_id', existingProjectId);

      // Make a POST request to join the existing project
      const response = await axios.post(`https://haas-maven-backend-d0f245db3484.herokuapp.com/join_project`, {
        project_id: existingProjectId,
        user_id: userId
      }); 

      if (response.data.status === 'success') {
        // Show success message in popup
        setPopupMessage('Successfully joined the existing project!');
        setShowPopup(true);
        
        // After showing the popup, navigate to ResourceManagement component
        setTimeout(() => {
          setShowPopup(false); // Close the popup
          navigate('/resource-management');
        }, 2000); // Adjust timeout as needed

      } else {
        // Show error message in popup
        setPopupMessage(`Failed to use existing project: ${response.data.message || 'Unknown error'}`);
        setShowPopup(true);
      }
    } catch (error) {
      // Handle network errors or other issues and show an error message in the popup
      setPopupMessage(`An error occurred while fetching the existing project: ${error.message}`);
      setShowPopup(true);
    }
  };

  return (
    <>
    <div class="container">
    <button class="btn" onClick={onLogOut}> Log Out</button> 
    </div>

    <div className="project-management">
      {/* Popup message */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      <div>
      <h2>Project Management</h2>
      </div>
      
      <div>
      <button onClick={handleCreateProject}>Create New Project</button>
      <div>
        <label>Project ID</label>
        <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
      </div>
      <div>
        <label>Project Name</label>
        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      </div>
      
      <button onClick={handleUseExistingProject}>Use Existing Project</button>
      <div>
        <label>Existing Project ID</label>
        <input type="text" value={existingProjectId} onChange={(e) => setExistingProjectId(e.target.value)} />
      </div>
    </div>
    </>
  );
};

export default ProjectManagement;
