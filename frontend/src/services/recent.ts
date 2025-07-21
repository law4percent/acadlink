// services/recent.ts

import axios from "axios";
import { getAuthHeaders, API_BASE_URL } from "./api";

const RECENT_API = `${API_BASE_URL}/instructors/recent`;

export const getRecentClassrooms = () =>
  axios.get(`${RECENT_API}/classrooms/`, getAuthHeaders());

export const getRecentSubjects = () =>
  axios.get(`${RECENT_API}/subjects/`, getAuthHeaders());

export const saveRecentClassroom = (classroomId: number) =>
  axios.post(`${RECENT_API}/classrooms/`, { classroom: classroomId }, getAuthHeaders());

// Fixed: subjectId should be number, and payload key should be 'subject'
export const saveRecentSubject = (classroomId: number, subjectId: number) =>
  axios.post(
    `${RECENT_API}/subjects/`,
    { 
      classroom: classroomId, 
      subject: subjectId  // Changed from 'subjectId' to 'subject'
    },
    getAuthHeaders()
  );