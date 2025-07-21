// frontend/src/services/classroom.ts
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const createClassroom = async (data: {
  name: string;
  start_year: number;
  end_year: number;
}) => {
  const token = localStorage.getItem("access");
  return await axios.post(`${API}/api/instructors/classrooms/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getInstructorClassrooms = async () => {
  const token = localStorage.getItem("access");
  return await axios.get(`${API}/api/instructors/classrooms/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
