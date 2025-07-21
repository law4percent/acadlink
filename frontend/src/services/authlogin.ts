import axios from 'axios';
import { API_BASE_URL } from "./api";

const LOGIN_API = `${API_BASE_URL}/accounts/login`;

type LoginData = {
  identifier: string;
  password: string;
};

export const login = async ({ identifier, password }: LoginData) => {
  return await axios.post(`${LOGIN_API}/`, {
    identifier,
    password,
  });
};
