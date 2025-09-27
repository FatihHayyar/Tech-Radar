import { useEffect, useState } from "react";
import axios from "axios";

function DraftList() {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tech/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setDrafts(res.data.filter(t => t.status === "DRAFT"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrafts();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Entwürfe (Drafts)</h2>
      {drafts.length === 0 ? (
        <p>Keine Entwürfe vorhanden.</p>
      ) : (
        <ul className="space-y-2">
          {drafts.map(d => (
            <li key={d.id} className="p-2 border rounded">
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm text-gray-600">{d.category}</p>
              <p className="text-sm">{d.tech_description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DraftList;
