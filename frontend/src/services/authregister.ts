import axios from 'axios';
import { API_BASE_URL } from "./api";

const REGISTER_API = `${API_BASE_URL}/accounts/register`;


export const registerInstructor = (data: any) => {
  return axios.post(`${REGISTER_API}/instructor/`, data);
};

export const registerStudent = (data: any) => {
  return axios.post(`${REGISTER_API}/student/`, data);
};