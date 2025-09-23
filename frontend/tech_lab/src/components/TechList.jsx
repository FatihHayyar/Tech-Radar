import { useEffect, useState } from "react";

export default function TechList({ reload, onlyPublished = false }) {
  const [techs, setTechs] = useState([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedTech, setSelectedTech] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTechs = async () => {
    try {
      const url = onlyPublished
        ? "http://localhost:4000/tech"
        : "http://localhost:4000/tech/all";

      const headers = onlyPublished
        ? {}
        : { Authorization: `Bearer ${token}` };

      const res = await fetch(url, { headers });
      const data = await res.json();
      if (res.ok) setTechs(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, [reload]);

  const filteredTechs = techs.filter((t) => {
    const matchesCategory =
      filterCategory === "ALL" || t.category === filterCategory;
    const matchesStatus =
      filterStatus === "ALL" || t.status === filterStatus;
    const searchText = search.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(searchText) ||
      t.category.toLowerCase().includes(searchText) ||
      t.ring.toLowerCase().includes(searchText);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleEdit = (tech) => {
    setEditId(tech.id);
    setEditData({ ...tech });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:4000/tech/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editData.name,
          category: editData.category,
          ring: editData.ring,
          tech_description: editData.tech_description,
          rationale: editData.rationale,
        }),
      });

      if (res.ok) {
        alert("✅ Technologie aktualisiert!");
        setEditId(null);
        fetchTechs();
      } else {
        const err = await res.json();
        alert("❌ " + err.error);
      }
    } catch (err) {
      alert("⚠️ Update fehlgeschlagen");
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm("📢 Diese Technologie wirklich veröffentlichen?"))
      return;

    try {
      const res = await fetch(`http://localhost:4000/tech/${id}/publish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ring: editData.ring || "Trial",
          rationale: editData.rationale || "Publiziert durch Admin",
        }),
      });

      if (res.ok) {
        alert("✅ Technologie publiziert!");
        fetchTechs();
      } else {
        const data = await res.json();
        alert("❌ Fehler: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Publish fehlgeschlagen");
    }
  };

  return (
    <div>
      <h2>Technologien</h2>

      {/* Filter & Suche */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <label>
          Kategorie:{" "}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="ALL">Alle</option>
            <option value="Tools">Tools</option>
            <option value="Platforms">Platforms</option>
            <option value="Techniques">Techniques</option>
            <option value="Languages & Frameworks">
              Languages & Frameworks
            </option>
          </select>
        </label>

        {!onlyPublished && (
          <label>
            Status:{" "}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Alle</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        )}

        <input
          type="text"
          placeholder="🔍 Suche nach Name, Kategorie, Ring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "0.25rem" }}
        />
      </div>

      {/* Tabelle */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Kategorie</th>
            <th>Ring</th>
            <th>Status</th>
            {!onlyPublished && <th>Aktionen</th>}
          </tr>
        </thead>
        <tbody>
          {filteredTechs.map((t) => (
            <tr
              key={t.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (editId !== t.id) setSelectedTech(t);
              }}
            >
              {editId === t.id ? (
                <td colSpan={onlyPublished ? 4 : 5}>
                  {/* Edit Mode */}
                  {!onlyPublished && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <input
                        placeholder="Name"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />

                      <select
                        value={editData.category}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            category: e.target.value,
                          })
                        }
                      >
                        <option>Tools</option>
                        <option>Platforms</option>
                        <option>Techniques</option>
                        <option>Languages & Frameworks</option>
                      </select>

                      <select
                        value={editData.ring}
                        onChange={(e) =>
                          setEditData({ ...editData, ring: e.target.value })
                        }
                      >
                        <option>Assess</option>
                        <option>Trial</option>
                        <option>Adopt</option>
                        <option>Hold</option>
                      </select>

                      <textarea
                        placeholder="Beschreibung"
                        value={editData.tech_description || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            tech_description: e.target.value,
                          })
                        }
                      />

                      <textarea
                        placeholder="Rationale (optional)"
                        value={editData.rationale || ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            rationale: e.target.value,
                          })
                        }
                      />

                      <div>
                        <button onClick={handleSave}>💾 Speichern</button>{" "}
                        <button onClick={() => setEditId(null)}>
                          ❌ Abbrechen
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              ) : (
                <>
                  <td>{t.name}</td>
                  <td>{t.category}</td>
                  <td>{t.ring}</td>
                  <td>{t.status}</td>
                  {!onlyPublished && (
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(t);
                        }}
                      >
                        ✏️ Bearbeiten
                      </button>{" "}
                      {t.status === "DRAFT" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublish(t.id);
                          }}
                        >
                          📢 Publish
                        </button>
                      )}
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTechs.length === 0 && <p>⚠️ Keine Technologien gefunden</p>}

      {/* Detail-Box */}
      {selectedTech && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #aaa",
            background: "#f9f9f9",
          }}
        >
          <h3>📌 {selectedTech.name}</h3>
          <p><strong>Kategorie:</strong> {selectedTech.category}</p>
          <p><strong>Ring:</strong> {selectedTech.ring}</p>
          <p><strong>Status:</strong> {selectedTech.status}</p>
          <p><strong>Beschreibung:</strong> {selectedTech.tech_description}</p>
          <p><strong>Rationale:</strong> {selectedTech.rationale || "-"}</p>
          {!onlyPublished && (
            <>
              <hr />
              <p>
                <strong>📅 Erstellt:</strong>{" "}
                {new Date(selectedTech.created_at).toLocaleString()}
              </p>
              {selectedTech.updated_at && (
                <p>
                  <strong>🔄 Geändert:</strong>{" "}
                  {new Date(selectedTech.updated_at).toLocaleString()}
                </p>
              )}
              {selectedTech.published_at && (
                <p>
                  <strong>🚀 Publiziert:</strong>{" "}
                  {new Date(selectedTech.published_at).toLocaleString()}
                </p>
              )}
              <p>
                <strong>👤 Erstellt von:</strong>{" "}
                {selectedTech.created_by_email || selectedTech.created_by}
              </p>
            </>
          )}
          <button onClick={() => setSelectedTech(null)}>❌ Schließen</button>
        </div>
      )}
    </div>
  );
}
