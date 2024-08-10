import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResourceManagement.css'; 
import { useNavigate } from 'react-router-dom';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');
  const projectId = localStorage.getItem('project_id');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const onLogOut = () => {
    navigate('/');
    localStorage.clear()
  };

  useEffect(() => {
    // Fetch hardware names and project info
    const fetchHardwareAndProjectInfo = async () => {
      try {
        const hardwareResponse = await axios.get('https://haas-maven-backend-d0f245db3484.herokuapp.com/get_all_hw_names');
        if (hardwareResponse.data.status === 'success') {
          const hardwareNames = hardwareResponse.data.hardware_names;

          // Fetch information for each hardware name
          const hardwareInfoPromises = hardwareNames.map(hwName =>
            axios.get(`https://haas-maven-backend-d0f245db3484.herokuapp.com/get_hw_info?hw_name=${hwName}`)
          );

          // Fetch project info
          const projectResponse = await axios.get(`https://haas-maven-backend-d0f245db3484.herokuapp.com/get_project_info?project_id=${projectId}`);
          const hardwareData = projectResponse.data.project.hardware || {};

          const hardwareInfoResponses = await Promise.all(hardwareInfoPromises);
          const hardwareInfo = hardwareInfoResponses.map(res => res.data);

          // Map the responses to the resources state
          const resourcesData = hardwareInfo.map(info => {
            const checkedOutQuantity = hardwareData[info.hw_name] ?? 0;
            return {
              name: info.hw_name,
              capacity: info.total_quantity,
              available: info.available_quantity,
              checked_out_quantity: checkedOutQuantity,
              request: 0,
            };
          });

          setResources(resourcesData);
        } else {
          console.error('Failed to fetch hardware names');
        }
      } catch (error) {
        console.error('Error fetching hardware names or info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHardwareAndProjectInfo();
  }, [projectId]);

  const handleCheckIn = async () => {
    try {
      console.log('Check-in with', resources);
  
      for (let resource of resources) {
        const payload = {
          user_id: userId,
          project_id: projectId,
          hw_name: resource.name,
          quantity: parseInt(resource.request),
        };
  
        if (payload.quantity > 0) {
          console.log("check-in payload", payload);
  
          try {
            const response = await axios.post('https://haas-maven-backend-d0f245db3484.herokuapp.com/check_in', payload);
            console.log("response", response);
            if (response.data.status === 'success') {
              console.log('Check-in successful for', resource.name, ':', response.data);
  
              // Fetch updated project info
              const projectResponse = await axios.get(`https://haas-maven-backend-d0f245db3484.herokuapp.com/get_project_info?project_id=${projectId}`);
              const updatedHardwareData = projectResponse.data.project.hardware || {};
  
              console.log("Updated hardware data after check-in", updatedHardwareData);
  
              // Update the resources state
              setResources(prevResources =>
                prevResources.map(r => {
                  const updatedCheckedOutQuantity = updatedHardwareData[r.name] ?? 0;
                  return r.name === resource.name
                    ? {
                        ...r,
                        available: r.available + parseInt(r.request, 10),
                        checked_out_quantity: updatedCheckedOutQuantity,
                        request: 0,
                      }
                    : {
                        ...r,
                        checked_out_quantity: updatedHardwareData[r.name]?.checked_out_quantity || r.checked_out_quantity,
                      };
                })
              );

              // Show success message in popup
              setPopupMessage(`Check-in successful for ${resource.name}!`);
              setShowPopup(true);

            } else {
              console.error('Check-in failed for', resource.name, ':', response.data.message || 'Unknown error');
              // Show error message in popup
              setPopupMessage(`Check-in failed for ${resource.name}: ${response.data.message || 'Unknown error'}`);
              setShowPopup(true);
            }
          } catch (error) {
            console.error('An error occurred during check-in for', resource.name, ':', error);
            // Show error message in popup
            setPopupMessage(`An error occurred during check-in for ${resource.name}: ${error.response.data.message}`);
            setShowPopup(true);
          }
        }
      }
    } catch (error) {
      console.error('An error occurred during check-in:', error);
      // Show error message in popup
      setPopupMessage(`An error occurred during check-in: ${error.response.data.message}`);
      setShowPopup(true);
    }
  };
  
  

  const handleCheckOut = async () => {
    try {
      console.log('Check-out with', resources);
  
      for (let resource of resources) {
        const payload = {
          user_id: userId,
          project_id: projectId,
          hw_name: resource.name,
          quantity: parseInt(resource.request),
        };
  
        if (payload.quantity > 0) {
          console.log("check-out payload", payload);
  
          try {
            const response = await axios.post('https://haas-maven-backend-d0f245db3484.herokuapp.com/check_out', payload);
            if (response.data.status === 'success') {
              console.log('Check-out successful for', resource.name, ':', response.data);

              // Fetch updated project info
              const projectResponse = await axios.get(`https://haas-maven-backend-d0f245db3484.herokuapp.com/get_project_info?project_id=${projectId}`);
              const updatedHardwareData = projectResponse.data.project.hardware || {};
  
              console.log("Updated hardware data after checkout", updatedHardwareData);
  
              // Update the resources state
              setResources(prevResources =>
                prevResources.map(r => {
                  const updatedCheckedOutQuantity = updatedHardwareData[r.name] ?? 0;
                  return r.name === resource.name
                    ? {
                        ...r,
                        available: r.available - parseInt(r.request, 10),
                        checked_out_quantity: updatedCheckedOutQuantity,
                        request: 0,
                      }
                    : {
                        ...r,
                        checked_out_quantity: updatedHardwareData[r.name]?.checked_out_quantity || r.checked_out_quantity,
                      };
                })
              );

              // Show success message in popup
              setPopupMessage(`Check-out successful for ${resource.name}!`);
              setShowPopup(true);

            } else {
              console.error('Check-out failed for', resource.name, ':', response.data.message || 'Unknown error');
              // Show error message in popup
              setPopupMessage(`Check-out failed for ${resource.name}: ${response.data.message || 'Unknown error'}`);
              setShowPopup(true);
            }
          } catch (error) {
            console.error('An error occurred during check-out for', resource.name, ':', error);
            // Show error message in popup
            setPopupMessage(`An error occurred during check-out for ${resource.name}: ${error.response.data.message}`);
            setShowPopup(true);
          }
        }
      }
    } catch (error) {
      console.error('An error occurred during check-out:', error);
      // Show error message in popup
      setPopupMessage(`An error occurred during check-out: ${error.response.data.message}`);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
    setPopupMessage(''); // Clear the popup message
  };

  // Check if any resource has a non-empty, non-zero request
  const isCheckInCheckOutDisabled = resources.every(resource => !resource.request || parseInt(resource.request) === 0);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div class="container">
    <button class="btn" onClick={onLogOut}> Log Out</button> 
    </div>
    <div className="resource-management">
      <h2>Resource Management for Project ID: {projectId}</h2>
      {/* Popup message */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Resource Name</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Checked-Out Quantity</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <tr key={index}>
              <td>{resource.name}</td>
              <td>{resource.capacity}</td>
              <td>{resource.available}</td>
              <td>{resource.checked_out_quantity}</td>
              <td>
              <input
                type="number"
                value={resource.request || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input
                  if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
                    setResources(prevResources =>
                      prevResources.map((res, i) =>
                        i === index ? { ...res, request: value } : res
                      )
                    );
                  }
                }}
                min="0"
                step="1"
              />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        <button disabled={isCheckInCheckOutDisabled} onClick={handleCheckIn}>Check-in</button>
        <button disabled={isCheckInCheckOutDisabled} onClick={handleCheckOut}>Check-out</button>
      </div>
    </div>
    </>
  );
};

export default ResourceManagement;
