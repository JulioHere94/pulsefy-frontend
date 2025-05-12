import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Main from "./components/Main/main";
import EditUser from "./components/User/edit_user";
import { useState } from "react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("main"); // Estado para controlar a página atual

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <StrictMode>
      {currentPage === "editUser" ? (
        <EditUser onEditUser={() => navigateTo("main")} />
      ) : (
        <Main onNavigateToEditUser={() => navigateTo("editUser")} />
      )}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<App />);
