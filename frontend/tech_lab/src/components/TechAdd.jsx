import { useState } from "react";

export default function TechAdd({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    ring: "",
    description: "",
    rationale: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.description) {
      alert("⚠️ Name, Kategorie und Beschreibung sind Pflichtfelder!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/tech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          ring: form.ring || null,
          rationale: form.rationale || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Technologie wurde als Entwurf gespeichert!");
        setForm({
          name: "",
          category: "",
          ring: "",
          description: "",
          rationale: "",
        });

        if (onSuccess) {
          onSuccess(); // 🔥 AdminPage'e haber ver → drafts tabına geç
        }
      } else {
        alert("❌ Fehler: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Verbindung zum Server fehlgeschlagen.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        name="name"
        placeholder="Technologie-Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Kategorie wählen...</option>
        <option value="Tools">Tools</option>
        <option value="Techniques">Techniques</option>
        <option value="Platforms">Platforms</option>
        <option value="Languages & Frameworks">Languages & Frameworks</option>
      </select>

      <select
        name="ring"
        value={form.ring}
        onChange={handleChange}
      >
        <option value="">(Optional) Ring wählen...</option>
        <option value="Assess">Assess</option>
        <option value="Trial">Trial</option>
        <option value="Adopt">Adopt</option>
        <option value="Hold">Hold</option>
      </select>

      <textarea
        name="description"
        placeholder="Beschreibung (Pflichtfeld)"
        value={form.description}
        onChange={handleChange}
        required
      />

      <textarea
        name="rationale"
        placeholder="(Optional) Rationale"
        value={form.rationale}
        onChange={handleChange}
      />

      <button type="submit">➕ Speichern</button>
    </form>
  );
}
