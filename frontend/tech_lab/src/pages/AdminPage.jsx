import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechList from "../components/TechList";
import TechAdd from "../components/TechAdd";
import AddUser from "../components/AddUser";
import "./../styles/admin.css"; // <-- import admin css

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("technologies");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // login yoksa
      return;
    }
    if (role !== "CTO" && role !== "TECH_LEAD") {
      navigate("/tech"); // employee admin'e girmesin
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
      {/* Sidebar / Topbar */}
      <div className="admin-sidebar" role="navigation" aria-label="Admin navigation">
        <div className="brand">
          <h2>Admin Panel</h2>
        </div>

        <div className="nav-buttons">
          <button
            className={activeTab === "technologies" ? "active" : ""}
            onClick={() => setActiveTab("technologies")}
          >
            📦 Technologien
          </button>

          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            ➕ Neue Technologie
          </button>

          <button
            className={activeTab === "addUser" ? "active" : ""}
            onClick={() => setActiveTab("addUser")}
          >
            👤 Kullanıcı Ekle
          </button>
        </div>

        {/* logout container (desktop: bottom of sidebar, mobile: moved to top-right by CSS) */}
        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === "technologies" && <TechList />}
        {activeTab === "add" && <TechAdd />}
        {activeTab === "addUser" && <AddUser />}
      </main>
    </div>
  );
}
