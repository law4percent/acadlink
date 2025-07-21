import React from 'react';
import { Link } from 'react-router-dom';
// Optional: for animation effects
// import Fade from 'react-reveal/Fade';

const Home: React.FC = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 shadow-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            <span className="text-primary">Acad</span>
            <span className="text-success">Link</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-fluid">
        <div className="row vh-100">
          
          {/* Left Introduction Section */}
          <div className="col-md-8 d-flex flex-column justify-content-center p-5">
            {/* <Fade left> */}
              <h1 className="display-4 fw-bold text-primary mb-3">Welcome to AcadLink</h1>
              <p className="lead fs-5 text-muted">
                AcadLink bridges the academic connection between instructors and students. It empowers instructors to create modules, quizzes, and exams, while students engage and learn through a structured, easy-to-use platform.
              </p>
              <p className="text-muted mt-2 fst-italic">
                Your academic journey begins here.
              </p>
            {/* </Fade> */}
          </div>

          {/* Right Sidebar */}
          <div className="col-md-4 bg-light d-flex flex-column justify-content-center align-items-center shadow-lg px-4">
            {/* <Fade right> */}
              <h4 className="mb-4 fw-semibold text-dark">Get Started</h4>
              <div className="d-flex flex-column gap-3 w-100">
                <Link to="/login" className="btn btn-primary py-2">
                  Login to Your Account
                </Link>
                <Link to="/signup-instructor" className="btn btn-outline-primary py-2">
                  Register as Instructor
                </Link>
                <Link to="/signup-student" className="btn btn-outline-success py-2">
                  Register as Student
                </Link>
              </div>
            {/* </Fade> */}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 bg-white text-muted small">
        &copy; {new Date().getFullYear()} <strong>AcadLink</strong>. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
