import { useState } from "react";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || !role) {
      setMessage({ type: "error", text: "Lütfen tüm alanları doldurun." });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "error", text: "Parola en az 6 karakter olmalı." });
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Kullanıcı oluşturuldu: ${data.email}` });
        setEmail("");
        setPassword("");
        setRole("EMPLOYEE");
      } else {
        setMessage({ type: "error", text: data.error || "Kullanıcı oluşturulamadı." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Ağ hatası. Backend çalışıyor mu kontrol et." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>👤 Yeni Kullanıcı Ekle</h2>
      <p>
        Not: Sadece <strong>CTO</strong> veya <strong>TECH_LEAD</strong> token'ı ile bu form çalışır.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <label>
          Email
          <input
            type="email"
            placeholder="kullanici@ornek.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Parola
          <input
            type="password"
            placeholder="en az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Rol
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="TECH_LEAD">TECH_LEAD</option>
          </select>
        </label>

        <div>
          <button type="submit" disabled={loading} style={primaryBtnStyle}>
            {loading ? "Kaydediliyor..." : "Kullanıcı Oluştur"}
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop: 8,
              padding: 8,
              borderRadius: 6,
              background: message.type === "error" ? "#ffe6e6" : "#e6ffea",
              color: message.type === "error" ? "#900" : "#064",
            }}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "0.4rem",
  marginTop: "0.25rem",
  boxSizing: "border-box",
};

const primaryBtnStyle = {
  background: "#2c7be5",
  color: "white",
  border: "none",
  padding: "0.5rem 0.75rem",
  borderRadius: 4,
  cursor: "pointer",
};
