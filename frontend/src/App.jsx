import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./components/Tasks";
import MyProfile from "./pages/MyProfile";
import Profiles from "./pages/Profiles";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <Profiles />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
