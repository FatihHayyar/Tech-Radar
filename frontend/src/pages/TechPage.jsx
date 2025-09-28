// src/pages/TechPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TechList from "../components/TechList";

export default function TechPage() {
  const [activeMenu, setActiveMenu] = useState("list");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/"); // Zurück zur Login-Seite
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#2c3e50",
          color: "white",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h3 style={{ borderBottom: "1px solid gray", paddingBottom: "0.5rem" }}>
          Technologien
        </h3>

        <button
          style={{ background: "transparent", color: "white", textAlign: "left" }}
          onClick={() => setActiveMenu("list")}
        >
          📌 Technologien
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleLogout}
          style={{
            background: "#b93b3b",
            color: "white",
            border: "none",
            padding: "0.5rem",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          🚪 Abmelden
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {activeMenu === "list" && <TechList onlyPublished />}
      </div>
    </div>
  );
}
