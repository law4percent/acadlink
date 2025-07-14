// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        {/* ✅ Dashboard route */}
      </Routes>
    </Router>
  );
}

export default App;
