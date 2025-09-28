import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechList from "../components/TechList";
import TechAdd from "../components/TechAdd";
import "./../styles/admin.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("technologies");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "CTO" && role !== "TECH_LEAD") {
      navigate("/tech");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="brand">
          <h2>Administrationsbereich</h2>
        </div>

        <div className="nav-buttons">
          <button
            className={activeTab === "technologies" ? "active" : ""}
            onClick={() => setActiveTab("technologies")}
          >
            📦 Technologien
          </button>

          <button
            className={activeTab === "drafts" ? "active" : ""}
            onClick={() => setActiveTab("drafts")}
          >
            📝 Entwürfe
          </button>

          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            ➕ Neue Technologie
          </button>
        </div>

        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Abmelden
          </button>
        </div>
      </div>

      <main className="admin-main">
        {activeTab === "technologies" && <TechList onlyPublished />}
        {activeTab === "drafts" && <TechList onlyDrafts />}
        {activeTab === "add" && (
          <TechAdd
            onSuccess={() => {
              setActiveTab("drafts"); // nach erfolgreicher Speicherung zu "Entwürfe" wechseln
            }}
          />
        )}
      </main>
    </div>
  );
}
