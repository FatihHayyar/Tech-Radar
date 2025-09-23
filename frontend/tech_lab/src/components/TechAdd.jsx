import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TechAdd() {
  const [form, setForm] = useState({
    name: "",
    category: "Tools",
    ring: "Assess",
    description: "",
    rationale: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:4000/tech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Teknoloji eklendi!");
      // 👉 direkt admin menüye yönlendir
      window.location.href = "/admin";
    } else {
      alert("❌ Hata: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Sunucuya bağlanılamadı.");
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        name="name"
        placeholder="Teknoloji adı"
        value={form.name}
        onChange={handleChange}
        required
      />
      <select name="category" value={form.category} onChange={handleChange}>
        <option>Tools</option>
        <option>Techniques</option>
        <option>Platforms</option>
        <option>Languages & Frameworks</option>
      </select>
      <select name="ring" value={form.ring} onChange={handleChange}>
        <option>Assess</option>
        <option>Trial</option>
        <option>Adopt</option>
        <option>Hold</option>
      </select>
      <textarea
        name="description"
        placeholder="Açıklama"
        value={form.description}
        onChange={handleChange}
        required
      />
      <textarea
        name="rationale"
        placeholder="Rationale"
        value={form.rationale}
        onChange={handleChange}
      />
      <button type="submit">➕ Kaydet</button>
    </form>
  );
}
