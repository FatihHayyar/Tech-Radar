import React, { useEffect, useState } from "react";
import "./../styles/techlist.css";

export default function TechList({ reload, onlyPublished = false }) {
  const [techs, setTechs] = useState([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTechs = async () => {
    try {
      const url = onlyPublished
        ? `${import.meta.env.VITE_API_URL}/tech`
        : `${import.meta.env.VITE_API_URL}/tech/all`;
      const headers = {};
      if (!onlyPublished && token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (res.ok) setTechs(data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchTechs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const filteredTechs = techs.filter((t) => {
    const matchesCategory =
      filterCategory === "ALL" || t.category === filterCategory;
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;
    const searchText = (search || "").toLowerCase();
    const matchesSearch =
      (t.name || "").toLowerCase().includes(searchText) ||
      (t.category || "").toLowerCase().includes(searchText) ||
      (t.ring || "").toLowerCase().includes(searchText);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleEdit = (tech) => {
    setEditId(tech.id);
    setEditData({ ...tech });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tech/${editId}`,
        {
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
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/tech/${id}/publish`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ring: editData.ring || "Trial",
            rationale: editData.rationale || "Publiziert durch Admin",
          }),
        }
      );

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
    <div className="techlist-root">
      <h2>Technologien</h2>

      {/* Filter & Suche */}
      <div className="techlist-controls">
        <label className="control-item">
          Kategorie:&nbsp;
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
          <label className="control-item">
            Status:&nbsp;
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
          className="techlist-search control-item"
          type="text"
          placeholder="🔍 Suche nach Name, Kategorie, Ring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table wrap */}
      <div className="table-wrap">
        <table className="tech-table" role="table">
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
              <React.Fragment key={t.id}>
                <tr
                  className="tech-row"
                  onClick={() =>
                    setExpandedId(expandedId === t.id ? null : t.id)
                  }
                >
                  {editId === t.id ? (
                    <td colSpan={onlyPublished ? 4 : 5}>
                      <div className="edit-box">
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
                            setEditData({
                              ...editData,
                              ring: e.target.value,
                            })
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

                        <div className="edit-actions">
                          <button onClick={handleSave}>💾 Speichern</button>
                          <button onClick={() => setEditId(null)}>
                            ❌ Abbrechen
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td data-label="Name">{t.name}</td>
                      <td data-label="Kategorie">{t.category}</td>
                      <td data-label="Ring">{t.ring}</td>
                      <td data-label="Status">{t.status}</td>

                      {!onlyPublished && (
                        <td data-label="Aktionen">
                          <div className="actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(t);
                              }}
                            >
                              ✏️ Bearbeiten
                            </button>
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
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>

                {/* Masaüstü detay */}
                {expandedId === t.id && (
                  <tr className="detail-row desktop-only">
                    <td colSpan={onlyPublished ? 4 : 5}>
                      <div className="detail-box">
                        <h3>📌 {t.name}</h3>
                        <p><strong>Kategorie:</strong> {t.category}</p>
                        <p><strong>Ring:</strong> {t.ring}</p>
                        <p><strong>Status:</strong> {t.status}</p>
                        <p><strong>Beschreibung:</strong> {t.tech_description || "-"}</p>
                        <p><strong>Rationale:</strong> {t.rationale || "-"}</p>

                        {!onlyPublished && (
                          <>
                            <hr />
                            <p>
                              <strong>📅 Erstellt:</strong>{" "}
                              {t.created_at
                                ? new Date(t.created_at).toLocaleString()
                                : "-"}
                            </p>
                            {t.updated_at && (
                              <p>
                                <strong>🔄 Geändert:</strong>{" "}
                                {new Date(t.updated_at).toLocaleString()}
                              </p>
                            )}
                            {t.published_at && (
                              <p>
                                <strong>🚀 Publiziert:</strong>{" "}
                                {new Date(t.published_at).toLocaleString()}
                              </p>
                            )}
                            <p>
                              <strong>👤 Erstellt von:</strong>{" "}
                              {t.created_by_email || t.created_by || "-"}
                            </p>
                          </>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(null);
                          }}
                        >
                          ❌ Schließen
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Mobil detay */}
                {expandedId === t.id && (
                  <div className="detail-box mobile-only">
                    <h3>📌 {t.name}</h3>
                    <p><strong>Kategorie:</strong> {t.category}</p>
                    <p><strong>Ring:</strong> {t.ring}</p>
                    <p><strong>Status:</strong> {t.status}</p>
                    <p><strong>Beschreibung:</strong> {t.tech_description || "-"}</p>
                    <p><strong>Rationale:</strong> {t.rationale || "-"}</p>

                    {!onlyPublished && (
                      <>
                        <hr />
                        <p>
                          <strong>📅 Erstellt:</strong>{" "}
                          {t.created_at
                            ? new Date(t.created_at).toLocaleString()
                            : "-"}
                        </p>
                        {t.updated_at && (
                          <p>
                            <strong>🔄 Geändert:</strong>{" "}
                            {new Date(t.updated_at).toLocaleString()}
                          </p>
                        )}
                        {t.published_at && (
                          <p>
                            <strong>🚀 Publiziert:</strong>{" "}
                            {new Date(t.published_at).toLocaleString()}
                          </p>
                        )}
                        <p>
                          <strong>👤 Erstellt von:</strong>{" "}
                          {t.created_by_email || t.created_by || "-"}
                        </p>
                      </>
                    )}

                    <button onClick={() => setExpandedId(null)}>
                      ❌ Schließen
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTechs.length === 0 && <p>⚠️ Keine Technologien gefunden</p>}
    </div>
  );
}
