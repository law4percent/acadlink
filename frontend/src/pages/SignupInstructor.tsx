import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { registerInstructor } from "../services/authregister";

const SignupInstructor: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    username: "",
    title: "",
    employee_id: "",
    gender: "",
  });

  const [error, setError] = useState("");

  const academicTitles = [
    { value: "Prof.", label: "Professor" },
    { value: "Assoc. Prof.", label: "Associate Professor" },
    { value: "Asst. Prof.", label: "Assistant Professor" },
    { value: "Inst.", label: "Instructor" },
    { value: "Dr.", label: "Doctor" },
    { value: "Engr.", label: "Engineer" },
    { value: "Ar.", label: "Architect" },
    { value: "Atty.", label: "Attorney" },
    { value: "Mr.", label: "Mr." },
    { value: "Ms.", label: "Ms." },
    { value: "Mrs.", label: "Mrs." },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerInstructor(formData);
      console.log("Instructor registered:", response.data);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 shadow-lg rounded overflow-hidden border">
        {/* Left Greeting Side */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-4"
          style={{
            background: "linear-gradient(to bottom right, #1565c0, #42a5f5)", // Blue aesthetic
          }}
        >
          <h2 className="fw-bold">Welcome Instructor!</h2>
          <p className="text-center mt-2">
            Join our platform and share your knowledge.
            <br />
            Let’s build a better learning community together!
          </p>
        </div>

        {/* Right Form Side */}
        <div className="col-md-6 p-4 bg-light">
          <div className="w-100">
            <h3 className="mb-4 text-center text-primary">Instructor Signup</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">First Name:</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Last Name:</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Title:</label>
                <select
                  className="form-select"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Title</option>
                  {academicTitles.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Employee ID:</label>
                <input
                  type="text"
                  name="employee_id"
                  className="form-control"
                  required
                  value={formData.employee_id}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gender:</label>
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

              {error && <p className="text-danger">{error}</p>}

              <button type="submit" className="btn btn-primary w-100 mt-2">
                Sign Up
              </button>

              <div className="text-center mt-3">
                <p className="mb-1">
                  Already have an account? <a href="/login">Sign in</a>
                </p>
                <p className="text-muted small">
                  Not an instructor?{" "}
                  <a
                    href="/signup-student"
                    className="text-decoration-underline"
                  >
                    Sign up as Student
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupInstructor;
