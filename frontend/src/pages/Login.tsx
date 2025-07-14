import React, { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // ✅ for redirecting

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/accounts/login/",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ This enables cookies & CORS credentials
        }
      );

      localStorage.setItem("access_token", res.data.access);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err.response?.data);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 100 }}>
      <h2>Instructor Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
