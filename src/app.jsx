import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Main from "./components/Main/main";
import EditUser from "./components/User/edit_user";
import Login from "./components/Login/login";
import Signup from "./components/Signup/signup";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import NotFound from "./components/NotFound/notfound";
import SpotifyCallback from "./components/SpotifyCallback/SpotifyCallback";
import { AuthProvider } from "./context/AuthContext";
import { SpotifyProvider } from "./context/SpotifyContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <StrictMode>
    <AuthProvider>
      <SpotifyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<SpotifyCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editar-usuario"
              element={
                <ProtectedRoute>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sobre"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contato"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SpotifyProvider>
    </AuthProvider>
  </StrictMode>
);

createRoot(document.getElementById("root")).render(<App />);
