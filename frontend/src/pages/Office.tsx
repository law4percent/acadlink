// src/pages/Office.tsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  createClassroom,
  getInstructorClassrooms,
  addSubjectToClassroom,
  getClassroomSubjects,
} from "../services/classroom";
import {
  getRecentClassrooms,
  getRecentSubjects,
  saveRecentClassroom as apiSaveRecentClassroom,
  saveRecentSubject as apiSaveRecentSubject,
} from "../services/recent";
import dayjs from "dayjs";

type Subject = {
  id: number;
  name: string;
  year_level: number;
  section: string;
};

type Classroom = {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  subjects: Subject[]; // Store full subject objects instead of strings
};

type RawClassroom = {
  id: number;
  name: string;
  start_year: number;
  end_year: number;
};

interface RecentClassroom {
  id: number;
  classroom: Classroom;
  accessed_at: string;
}

interface RecentSubjectItem {
  id: number;
  accessed_at: string;
  subject_display: string;
  classroom_display: {
    id: number;
    name: string;
    start_year: number;
    end_year: number;
  };
}

const Office: React.FC = () => {
  const navigate = useNavigate();
  
  const formatSubject = (subject: Subject) => {
    return `${subject.name} (${subject.year_level}${subject.section})`;
  };
  
  const getClassLabel = (room: any) => {
    const name = room.name || "Unnamed";
    const startYear = room.startYear || "????";
    const endYear = room.endYear || "????";
    return `${name} (S.Y. ${startYear}–${endYear})`;
  };

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [yearLevel, setYearLevel] = useState<number | "">("");
  const [section, setSection] = useState("");
  const [startYear, setStartYear] = useState<number | "">("");
  const [endYear, setEndYear] = useState<number | "">("");
  const [isHomeView, setIsHomeView] = useState(true);
  const [recentClassrooms, setRecentClassrooms] = useState<RecentClassroom[]>([]);
  const [recentSubjects, setRecentSubjects] = useState<RecentSubjectItem[]>([]);

  const fetchRecentClassrooms = async () => {
    try {
      const response = await getRecentClassrooms();
      const transformed = await Promise.all(
        response.data.map(async (item: any) => {
          const subjectRes = await getClassroomSubjects(item.classroom.id);
          return {
            id: item.id,
            accessed_at: item.accessed_at,
            classroom: {
              id: item.classroom.id,
              name: item.classroom.name,
              startYear: item.classroom.start_year,
              endYear: item.classroom.end_year,
              subjects: subjectRes.data, // Store full subject objects
            },
          };
        })
      );
      setRecentClassrooms(transformed);
    } catch (error) {
      console.error("Failed to fetch recent classrooms", error);
    }
  };

  const fetchRecentSubjects = async () => {
    try {
      const response = await getRecentSubjects();
      console.log("Recent subjects response:", response.data); // Debug log
      setRecentSubjects(response.data);
    } catch (error) {
      console.error("Error fetching recent subjects", error);
    }
  };

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await getInstructorClassrooms();
        const transformed = await Promise.all(
          res.data.map(async (cls: RawClassroom) => {
            const subjectRes = await getClassroomSubjects(cls.id);
            return {
              id: cls.id,
              name: cls.name,
              startYear: cls.start_year,
              endYear: cls.end_year,
              subjects: subjectRes.data, // Store full subject objects
            };
          })
        );
        setClassrooms(transformed);
      } catch (error) {
        console.error("Error loading classrooms with subjects:", error);
      }
    };

    fetchRecentSubjects();
    fetchRecentClassrooms();
    fetchClassrooms();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const saveRecentClassroom = (classroom: Classroom) => {
    apiSaveRecentClassroom(classroom.id).catch((err) =>
      console.error("Failed to sync recent classroom to backend:", err)
    );
  };

  // Fixed: Now accepts subject ID instead of subject string
  const saveRecentSubject = (subjectId: number, classroomId: number) => {
    apiSaveRecentSubject(classroomId, subjectId).catch((err) =>
      console.error("Failed to sync recent subject to backend:", err)
    );
  };

  const handleHomeClick = () => {
    setSelectedClassroom(null);
    setIsHomeView(true);
  };

  const handleClassroomClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsHomeView(false);
    saveRecentClassroom(classroom);
  };

  const handleCreateClassroom = () => setShowClassModal(true);

  const handleSaveClassroom = async () => {
    if (newClassName.trim() && startYear && endYear && startYear < endYear) {
      try {
        const res = await createClassroom({
          name: newClassName,
          start_year: startYear,
          end_year: endYear,
        });

        const newClassroom = {
          id: res.data.id,
          name: res.data.name,
          startYear: res.data.start_year,
          endYear: res.data.end_year,
          subjects: [],
        };

        setClassrooms([...classrooms, newClassroom]);
        setSelectedClassroom(newClassroom);
        setNewClassName("");
        setStartYear("");
        setEndYear("");
        setShowClassModal(false);
      } catch (error) {
        console.error("Failed to create classroom:", error);
        alert("Failed to create classroom.");
      }
    }
  };

  const handleAddSubject = () => setShowSubjectModal(true);

  const handleSaveSubject = async () => {
    if (newSubjectName.trim() && selectedClassroom && yearLevel && section.trim()) {
      const subjectPayload = {
        name: newSubjectName,
        year_level: yearLevel,
        section: section,
      };

      try {
        const response = await addSubjectToClassroom(selectedClassroom.id, subjectPayload);
        const newSubject = response.data; // This should contain the new subject with ID

        const updated = classrooms.map((cls) =>
          cls.id === selectedClassroom.id
            ? { ...cls, subjects: [...cls.subjects, newSubject] }
            : cls
        );

        setClassrooms(updated);
        const updatedClass = updated.find((c) => c.id === selectedClassroom.id);
        setSelectedClassroom(updatedClass || null);

        // Now save with subject ID
        saveRecentSubject(newSubject.id, selectedClassroom.id);
        
        setNewSubjectName("");
        setYearLevel("");
        setSection("");
        setShowSubjectModal(false);
        
        // Refresh recent subjects
        fetchRecentSubjects();
      } catch (error) {
        console.error("Failed to add subject:", error);
        alert("Failed to add subject.");
      }
    }
  };

  const handleSubjectClick = (subject: Subject, classroom: Classroom) => {
    saveRecentSubject(subject.id, classroom.id);
    navigate(
      `/${classroom.id}/${formatSubject(subject)
        .replace(/\s+/g, "-")
        .toLowerCase()}`
    );
    // Refresh recent subjects after navigation
    setTimeout(fetchRecentSubjects, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-light border-end p-3" style={{ width: "260px" }}>
        <h4 className="d-flex align-items-center mb-4">
          <i className="bi bi-book me-2 fs-4 text-primary" />
          <strong>AcadLink</strong>
        </h4>

        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-secondary" onClick={handleCreateClassroom}>
            Create classroom
          </button>
          <button
            className="btn btn-link text-start text-dark"
            onClick={handleHomeClick}
          >
            Home
          </button>
        </div>

        <hr />
        <div className="text-muted small mb-2">Classrooms</div>
        <div className="d-grid gap-2">
          {classrooms.map((cls) => (
            <button
              key={cls.id}
              className="btn btn-outline-secondary text-start"
              onClick={() => handleClassroomClick(cls)}
            >
              {getClassLabel(cls)}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-light p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Welcome {user?.name}!</h5>

          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bell-fill text-warning fs-5" />
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="dark"
                className="rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: 36, height: 36 }}
              >
                <i className="bi bi-person text-white" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Display Area */}
        <div className="bg-white border rounded p-4" style={{ minHeight: "80%" }}>
          {isHomeView ? (
            <>
              {/* Recently Open Classroom Section */}
              <div className="text-muted small mb-2">Recently open classroom</div>
              {recentClassrooms.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-2 mb-2 bg-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClassroomClick(item.classroom)}
                >
                  <div className="fw-bold">{getClassLabel(item.classroom)}</div>
                  <small className="text-muted">
                    Last accessed: {dayjs(item.accessed_at).format("MMMM D, YYYY h:mm A")}
                  </small>
                </div>
              ))}

              <hr />

              {/* Recently Open Subject Section - Fixed */}
              <div className="text-muted small mb-2">Recently open subject</div>
              <div className="d-flex flex-column gap-2">
                {recentSubjects.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-light rounded shadow-sm border"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // Find the classroom and subject to navigate properly
                      const classroom = recentClassrooms.find(
                        (rc) => rc.classroom.id === item.classroom_display.id
                      )?.classroom;
                      
                      if (classroom) {
                        handleClassroomClick(classroom);
                        navigate(
                          `/${classroom.id}/${item.subject_display
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`
                        );
                      }
                    }}
                  >
                    <div>{item.subject_display}</div>
                    <small className="text-muted">
                      {item.classroom_display.name} (S.Y. {item.classroom_display.start_year}–{item.classroom_display.end_year}) • Last accessed:{" "}
                      {dayjs(item.accessed_at).format("MMMM D, YYYY h:mm A")}
                    </small>
                  </div>
                ))}
                {recentSubjects.length === 0 && (
                  <p className="text-muted">No recent subjects.</p>
                )}
              </div>
            </>
          ) : selectedClassroom ? (
            <>
              <h3>
                {selectedClassroom.name} ({selectedClassroom.startYear} to{" "}
                {selectedClassroom.endYear})
              </h3>
              <button className="btn btn-primary mb-3" onClick={handleAddSubject}>
                + Add Subject
              </button>
              {selectedClassroom.subjects.length > 0 ? (
                <ul className="list-group">
                  {selectedClassroom.subjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSubjectClick(subject, selectedClassroom)}
                      style={{ cursor: "pointer" }}
                    >
                      {formatSubject(subject)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No subjects yet.</p>
              )}
            </>
          ) : (
            <h5 className="text-muted text-center">
              Select or create a classroom to manage subjects.
            </h5>
          )}
        </div>
      </div>

      {/* Create Classroom Modal */}
      <Modal show={showClassModal} onHide={() => setShowClassModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Classroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="classroomName">
              <Form.Label>Classroom Name</Form.Label>
              <Form.Control
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter classroom name"
              />
            </Form.Group>

            <Form.Label>School Year</Form.Label>
            <div className="d-flex gap-2">
              <Form.Select
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value))}
              >
                <option value="">Start Year</option>
                {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
              >
                <option value="">End Year</option>
                {Array.from({ length: 31 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClassModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveClassroom}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Subject Modal */}
      <Modal show={showSubjectModal} onHide={() => setShowSubjectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="subjectName">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="yearLevel">
              <Form.Label>Year Level</Form.Label>
              <Form.Select
                value={yearLevel}
                onChange={(e) => setYearLevel(parseInt(e.target.value))}
              >
                <option value="">Select year level</option>
                {[1, 2, 3, 4].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="section">
              <Form.Label>Section</Form.Label>
              <Form.Control
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Enter section"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubjectModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveSubject}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Office;