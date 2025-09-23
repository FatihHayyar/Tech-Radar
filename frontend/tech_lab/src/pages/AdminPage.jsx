import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TechList from "../components/TechList";
import TechAdd from "../components/TechAdd";
import AddUser from "../components/AddUser"; // ✅ sadece bu satır eklendi

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("technologies");

  // ✅ sadece CTO / TECH_LEAD girebilsin
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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#222",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2>Admin Panel</h2>
        <button onClick={() => setActiveTab("technologies")}>
          📦 Technologien
        </button>
        <button onClick={() => setActiveTab("add")}>
          ➕ Neue Technologie
        </button>

        {/* ---------- BURAYA TEK BUTON EKLENDİ ---------- */}
        <button onClick={() => setActiveTab("addUser")}>
          👤 Kullanıcı Ekle
        </button>
        {/* ---------------------------------------------- */}

        <hr style={{ borderColor: "#444" }} />
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {activeTab === "technologies" && <TechList />}
        {activeTab === "add" && <TechAdd />}
        {activeTab === "addUser" && <AddUser />} {/* ve burada render ediliyor */}
      </div>
    </div>
  );
}
