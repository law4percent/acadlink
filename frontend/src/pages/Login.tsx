// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

const Login: React.FC = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(form);
      const { access, refresh, user } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user)); // optional for later use

      if (user.role === "instructor") {
        navigate("/office");
      } else if (user.role === "student") {
        navigate("/classroom");
      }
    } catch (err: any) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Login failed"
      );
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div
        className="row w-100 shadow-lg rounded overflow-hidden border"
        style={{ maxWidth: "700px" }}
      >
        {/* Left Greeting Section */}
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-4"
          style={{
            background: "linear-gradient(to bottom right, #1e88e5, #90caf9)",
          }}
        >
          <h2 className="fw-bold">Welcome Back!</h2>
          <p className="text-center">
            Log in to access your personalized dashboard and continue your
            learning journey.
          </p>
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 p-4 bg-light">
          <h3 className="text-center text-primary mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="identifier"
                type="text" // accept either email or username
                className="form-control"
                placeholder="Enter your email or username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <button type="submit" className="btn btn-primary w-100">
              Log In
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-1">
              Don't have an account?{" "}
              <a href="/signup-student" className="text-decoration-underline">
                Sign up as Student
              </a>{" "}
              or{" "}
              <a
                href="/signup-instructor"
                className="text-decoration-underline"
              >
                Sign up as Instructor
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
