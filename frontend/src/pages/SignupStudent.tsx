import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../services/auth"; // use service function

const SignupStudent: React.FC = () => {
  const navigate = useNavigate();

  interface StudentFormData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
    student_id: string;
    year_level: number;
    section: string;
    gender: string;
    department: string;
    course: string;
  }

  const [formData, setFormData] = useState<StudentFormData>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    username: "",
    student_id: "",
    year_level: 1,
    section: "",
    gender: "",
    department: "",
    course: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerStudent(formData); // use service
      console.log("Student registered:", response.data);
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Registration failed."
      );
    }
  };
  
  return (
    <div className="container-fluid vh-100 d-flex">
      {/* Left Greeting Section */}
      <div
        className="col-md-6 d-flex align-items-center justify-content-center text-white"
        style={{
          background: "linear-gradient(to bottom right, #2e7d32, #66bb6a)", // green aesthetic
        }}
      >
        <div className="text-center p-4">
          <h1 className="display-5 fw-bold">Welcome Student!</h1>
          <p className="lead">
            Create your free student account and get started now.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
        <div className="w-75 shadow-lg p-4 rounded">
          <h2 className="mb-4 text-center text-success">Student Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="mb-3 col-md-6">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 col-md-6">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Student ID</label>
              <input
                type="text"
                className="form-control"
                name="student_id"
                required
                value={formData.student_id}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label>Year Level</label>
                <select
                  className="form-select"
                  name="year_level"
                  value={formData.year_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year_level: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div className="mb-3 col-md-6">
                <label>Section</label>
                <input
                  type="text"
                  className="form-control"
                  name="section"
                  required
                  value={formData.section}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label>Gender</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-3 col-md-6">
                <label>Course</label>
                <input
                  type="text"
                  className="form-control"
                  name="course"
                  required
                  value={formData.course}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Department</label>
              <input
                type="text"
                className="form-control"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Sign Up
            </button>
            {error && <p className="text-danger mt-3">{error}</p>}

            {/* Links */}
            <div className="col-12 text-center">
              <p className="mt-3 mb-1">
                Already have an account? <a href="/login">Sign in</a>
              </p>
              <p className="text-muted small">
                Not a student?{" "}
                <a
                  href="/signup-instructor"
                  className="text-decoration-underline"
                >
                  Sign up as Instructor
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupStudent;
