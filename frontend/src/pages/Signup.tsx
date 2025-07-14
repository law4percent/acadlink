import React, { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

interface SignupForm {
  username: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/api/accounts/register/", form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // ✅ Important for CORS
      });
      setSuccess(true);
    } catch (err: any) {
      console.error(err.response?.data);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", paddingTop: 100 }}>
      <h2>Instructor Signup</h2>
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
          name="email"
          type="email"
          placeholder="Email"
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
        <button type="submit">Sign Up</button>
      </form>
      {success && (
        <p style={{ color: "green" }}>Account created! You can now log in.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;
