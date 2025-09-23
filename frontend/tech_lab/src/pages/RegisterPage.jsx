import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        role: "EMPLOYEE", // 👈 her zaman employee
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Registrierung erfolgreich! Bitte einloggen.");
      navigate("/"); // login sayfasına yönlendir
    } else {
      alert("❌ Fehler: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Verbindung zum Server fehlgeschlagen");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ textAlign: "center" }}>
      <h2>Neuen Account erstellen</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "300px", margin: "1rem auto" }}
      >
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "⏳ wird erstellt..." : "📥 Registrieren"}
        </button>
      </form>

      <p>
        Bereits ein Konto? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
