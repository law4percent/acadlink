import axios from "axios";
import { getAuthHeaders, API_BASE_URL } from "./api";

const RECENT_API = `${API_BASE_URL}/instructors/recent`;

export const getRecentClassrooms = () =>
  axios.get(`${RECENT_API}/classrooms/`, getAuthHeaders());

export const getRecentSubjects = () =>
  axios.get(`${RECENT_API}/subjects/`, getAuthHeaders());

export const saveRecentClassroom = (classroomId: number) =>
  axios.post(`${RECENT_API}/classrooms/`, { classroom: classroomId }, getAuthHeaders());

export const saveRecentSubject = (classroomId: number, subject: string) =>
  axios.post(
    `${RECENT_API}/subjects/`,
    { classroom: classroomId, subject },
    getAuthHeaders()
  );
