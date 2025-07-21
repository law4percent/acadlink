import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/accounts';

export const registerInstructor = (data: any) => {
  return axios.post(`${BASE_URL}/register/instructor/`, data);
};

export const registerStudent = (data: any) => {
  return axios.post(`${BASE_URL}/register/student/`, data);
};

type LoginData = {
  identifier: string;
  password: string;
};

export const login = async ({ identifier, password }: LoginData) => {
  return await axios.post(`${BASE_URL}/login/`, {
    identifier,
    password,
  });
};
