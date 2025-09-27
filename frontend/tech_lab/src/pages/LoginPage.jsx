import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Artık absolute URL yok, sadece relative endpoint
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", data.id);

          if (data.role === "CTO" || data.role === "TECH_LEAD") {
            navigate("/admin");
          } else {
            navigate("/tech");
          }
        } else {
          alert("❌ Login fehlgeschlagen");
        }
      } else {
        alert("❌ Login fehlgeschlagen");
      }
    } catch (err) {
      console.error("Login Fehler:", err);
      alert("⚠️ Netzwerkfehler");
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "100%", margin: 0 }}>
      <h1 style={{ textAlign: "center" }}>Technologie-Radar</h1>
      <div style={{ textAlign: "center" }}>
        <h2>Login</h2>
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxWidth: "300px",
            margin: "0 auto",
          }}
        >
          <input
            placeholder="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
