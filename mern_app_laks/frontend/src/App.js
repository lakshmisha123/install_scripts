import React, { useState } from "react";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {token ? (
        <Dashboard token={token} setToken={setToken} />
      ) : (
        <LoginForm setToken={setToken} />
      )}
    </div>
  );
}

export default App;