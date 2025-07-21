import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Classroom = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  subjects: string[];
};

const Office: React.FC = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "classroom-a",
      name: "Room A",
      startYear: 2023,
      endYear: 2024,
      subjects: ["Math (1B)", "Science (1C)"],
    },
    {
      id: "classroom-b",
      name: "Room B",
      startYear: 2024,
      endYear: 2025,
      subjects: ["History (3B)"],
    },
    {
      id: "classroom-c",
      name: "Room C",
      startYear: 2025,
      endYear: 2026,
      subjects: [],
    },
  ]);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [yearLevel, setYearLevel] = useState<number | "">("");
  const [section, setSection] = useState("");
  const [startYear, setStartYear] = useState<number | "">("");
  const [endYear, setEndYear] = useState<number | "">("");
  const [isHomeView, setIsHomeView] = useState(true);
  const [recentClassrooms, setRecentClassrooms] = useState<Classroom[]>([]);
  const [recentSubjects, setRecentSubjects] = useState<string[]>([]);
  useEffect(() => {
    const storedClassrooms = JSON.parse(
      localStorage.getItem("recentClassrooms") || "[]"
    );
    const storedSubjects = JSON.parse(
      localStorage.getItem("recentSubjects") || "[]"
    );

    setRecentClassrooms(storedClassrooms);
    setRecentSubjects(storedSubjects);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const saveRecentClassroom = (classroom: Classroom) => {
    const existing = JSON.parse(
      localStorage.getItem("recentClassrooms") || "[]"
    );
    const updated = [
      classroom,
      ...existing.filter((c: Classroom) => c.id !== classroom.id),
    ].slice(0, 3);
    localStorage.setItem("recentClassrooms", JSON.stringify(updated));
  };

  const saveRecentSubject = (subject: string) => {
    const existing = JSON.parse(localStorage.getItem("recentSubjects") || "[]");
    const updated = [
      subject,
      ...existing.filter((s: string) => s !== subject),
    ].slice(0, 3);
    localStorage.setItem("recentSubjects", JSON.stringify(updated));
  };

  const handleHomeClick = () => {
    setSelectedClassroom(null);
    setIsHomeView(true);

    const storedClassrooms = JSON.parse(
      localStorage.getItem("recentClassrooms") || "[]"
    );
    const storedSubjects = JSON.parse(
      localStorage.getItem("recentSubjects") || "[]"
    );

    setRecentClassrooms(storedClassrooms);
    setRecentSubjects(storedSubjects);
  };

  const handleClassroomClick = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsHomeView(false);
    saveRecentClassroom(classroom);
  };

  const handleCreateClassroom = () => setShowClassModal(true);

  const handleSaveClassroom = () => {
    if (newClassName.trim() && startYear && endYear && startYear < endYear) {
      const newId = `classroom-${Date.now()}`;

      const newClassroom: Classroom = {
        id: newId,
        name: newClassName,
        startYear,
        endYear,
        subjects: [],
      };

      setClassrooms([...classrooms, newClassroom]);
      setSelectedClassroom(newClassroom);
      setNewClassName("");
      setStartYear("");
      setEndYear("");
      setShowClassModal(false);
    }
  };

  const handleAddSubject = () => setShowSubjectModal(true);

  const handleSaveSubject = () => {
    if (
      newSubjectName.trim() &&
      selectedClassroom &&
      yearLevel &&
      section.trim()
    ) {
      const subjectFullName = `${newSubjectName} (${yearLevel}${section})`;

      const updated = classrooms.map((cls) =>
        cls.id === selectedClassroom.id
          ? { ...cls, subjects: [...cls.subjects, subjectFullName] }
          : cls
      );

      setClassrooms(updated);

      // Update selected classroom reference
      const updatedClass = updated.find((c) => c.id === selectedClassroom.id);
      setSelectedClassroom(updatedClass || null);

      setNewSubjectName("");
      setYearLevel("");
      setSection("");
      setShowSubjectModal(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getClassLabel = (cls: Classroom) =>
    `${cls.name} (S.Y. ${cls.startYear}–${cls.endYear})`;

//   return (...);
// };
// export default Office;
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
          <h5 className="mb-0">
            Welcome instructor {user?.name || "Remalyn"}!
          </h5>

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
        <div
          className="bg-white border rounded p-4"
          style={{ minHeight: "80%" }}
        >
          {isHomeView ? (
            <>
              <div className="text-muted small mb-2">
                Recently open classroom
              </div>
              <div className="d-flex gap-3 mb-4">
                {recentClassrooms.map((cls) => (
                  <div
                    key={cls.id}
                    className="border p-3 rounded bg-light flex-grow-1 text-center"
                    style={{ minWidth: "180px", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedClassroom(cls);
                      setIsHomeView(false);
                    }}
                  >
                    <strong>{cls.name}</strong>
                    <div className="text-muted small">
                      S.Y. {cls.startYear} - {cls.endYear}
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              <div className="text-muted small mb-2">Recently open subject</div>
              <div className="d-flex flex-column gap-2">
                {recentSubjects.map((subject, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-light"
                    style={{ cursor: "pointer" }}
                  >
                    {subject}
                  </div>
                ))}
              </div>
            </>
          ) : selectedClassroom ? (
            <>
              <h3>
                {selectedClassroom.name} ({selectedClassroom.startYear} to{" "}
                {selectedClassroom.endYear})
              </h3>
              <button
                className="btn btn-primary mb-3"
                onClick={handleAddSubject}
              >
                + Add Subject
              </button>
              {selectedClassroom.subjects.length > 0 ? (
                <ul className="list-group">
                  {selectedClassroom.subjects.map((subject, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        saveRecentSubject(subject);
                        navigate(
                          `/${selectedClassroom.id}/${subject
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`
                        );
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {subject}
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
      <Modal
        show={showClassModal}
        onHide={() => setShowClassModal(false)}
        centered
      >
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
      <Modal
        show={showSubjectModal}
        onHide={() => setShowSubjectModal(false)}
        centered
      >
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
          <Button
            variant="secondary"
            onClick={() => setShowSubjectModal(false)}
          >
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
