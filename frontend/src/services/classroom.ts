import axios from "axios";
import { getAuthHeaders, API_BASE_URL } from "./api";

const CLASSROOM_API = `${API_BASE_URL}/instructors/classrooms`;

export const createClassroom = (data: {
  name: string;
  start_year: number;
  end_year: number;
}) => axios.post(`${CLASSROOM_API}/`, data, getAuthHeaders());

export const getInstructorClassrooms = () =>
  axios.get(`${CLASSROOM_API}/`, getAuthHeaders());

export const addSubjectToClassroom = (
  classroomId: number,
  subjectData: any
) =>
  axios.post(
    `${CLASSROOM_API}/${classroomId}/subjects/`,
    subjectData,
    getAuthHeaders()
  );

export const getClassroomSubjects = (classroomId: number | string) =>
  axios.get(`${CLASSROOM_API}/${classroomId}/subjects/`, getAuthHeaders());
