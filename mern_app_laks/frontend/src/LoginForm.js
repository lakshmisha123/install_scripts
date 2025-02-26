import React, { useState } from "react";
import axios from "axios";
import './LoginForm.css'; // Import custom CSS file for styling

function LoginForm({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/login/', {
        username: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json', // Explicitly set Content-Type
        },
      });
      setToken(response.data.token);
    } catch (err) {
      console.log(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
