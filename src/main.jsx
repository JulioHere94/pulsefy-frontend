import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Main from "./components/Main/main";
import EditUser from "./components/User/edit_user";

const App = () => {
  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/editar-usuario" element={<EditUser />} />
        </Routes>
      </Router>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<App />);
