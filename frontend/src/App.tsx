import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupInstructor from "./pages/SignupInstructor";
import SignupStudent from "./pages/SignupStudent";
import Office from "./pages/Office";
import Classroom from "./pages/Classroom";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup-instructor" element={<SignupInstructor />} />
        <Route path="/signup-student" element={<SignupStudent />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes - Instructor */}
        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/office" element={<Office />} />
          {/* You can also create a ClassroomDetailInstructor component for this */}
          <Route path="/office/classroom/:id" element={<Office />} />
        </Route>

        {/* Protected Routes - Student */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/classroom/:id" element={<Classroom />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
