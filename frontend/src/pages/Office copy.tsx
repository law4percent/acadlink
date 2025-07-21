import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaClipboardList, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import "./Classroom.css";

const Office: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="classroom-container">
      <aside className="sidebar">
        <div className="logo">AcadLink</div>
        <nav>
          <ul>
            <li>
              <Link to="/materials"><FaFileAlt /> Materials</Link>
            </li>
            <li>
              <Link to="/quizzes"><FaClipboardList /> Quizzes</Link>
            </li>
            <li>
              <Link to="/exams"><FaBook /> Exams</Link>
            </li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="main-content">
        <h1>Welcome, {user?.first_name || "Instructor"}!</h1>
        <p>Select a feature from the left panel to begin.</p>
      </main>
    </div>
  );
};

export default Office;
