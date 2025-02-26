import React, { useState } from "react";
import axios from "axios";
import './Dashboard.css'; // Import custom CSS file for styling

function Dashboard({ token, setToken }) {
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/dashboard", {
        headers: { "x-access-token": token },
      });
      setMessage(response.data.message);
    } catch (err) {
      setMessage("Authentication failed");
    }
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-content">
        <button className="fetch-btn" onClick={fetchData}>Fetch Protected Data</button>
        {message && <p className="dashboard-message">{message}</p>}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
