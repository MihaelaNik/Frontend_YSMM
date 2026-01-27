import { useEffect, useMemo, useState } from "react";
import "../../styles/Packages.css";

const API = "http://localhost:5000";

const statusLabel = (s) => {
  const v = (s || "").toLowerCase();
  if (v === "pending") return "Чакаща";
  if (v === "in_transit") return "В транзит";
  if (v === "delivered") return "Доставена";
  if (v === "return") return "Връщане";
  return s || "-";
};

function Packages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // simple filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // employee can use this and will see all packages
      const res = await fetch(`${API}/packages/get-listPackages`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Грешка при зареждане на пратките.");

      const data = await res.json();
      setRows(data.listPackages || []);
    } catch (e) {
      setError(e.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return rows.filter((p) => {
      const matchesText =
        !text ||
        String(p.id).includes(text) ||
        (p.senderName || "").toLowerCase().includes(text) ||
        (p.receiverName || "").toLowerCase().includes(text) ||
        (p.senderOffice || "").toLowerCase().includes(text) ||
        (p.receiverOffice || "").toLowerCase().includes(text);

      const matchesStatus =
        status === "all" ? true : (p.status || "").toLowerCase() === status;

      return matchesText && matchesStatus;
    });
  }, [rows, q, status]);

  const updateStatus = async (packageId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API}/packages/packageStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageId, status: newStatus }),
      });

      const text = await res.text();
      let body = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { raw: text };
      }

      if (!res.ok) throw new Error(body.error || body.raw || "Грешка при смяна на статус.");

      // update UI
      setRows((prev) =>
        prev.map((p) => (p.id === packageId ? { ...p, status: newStatus } : p))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="packages-page">
      <div className="packages-card">
        <div className="packages-header">
          <h2>Всички пратки</h2>
          <button className="refresh-btn" onClick={load} disabled={loading}>
            Обнови
          </button>
        </div>

        <div className="packages-filters">
          <input
            className="filter-input"
            placeholder="Търси по №, изпращач, получател, офис..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Всички статуси</option>
            <option value="pending">Чакащи</option>
            <option value="in_transit">В транзит</option>
            <option value="delivered">Доставени</option>
            <option value="return">Връщане</option>
          </select>
        </div>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && filtered.length === 0 && <p>Няма пратки.</p>}

        {filtered.length > 0 && (
          <div className="packages-table-wrap">
            <table className="packages-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Дата</th>
                  <th>Изпращач</th>
                  <th>Получател</th>
                  <th>От офис</th>
                  <th>До офис</th>
                  <th>Кг</th>
                  <th>Статус</th>
                  <th>Промяна</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.date_pack_start ? String(p.date_pack_start).slice(0, 10) : "-"}</td>
                    <td>{p.senderName || "-"}</td>
                    <td>{p.receiverName || "-"}</td>
                    <td>{p.senderOffice || "-"}</td>
                    <td>{p.receiverOffice || "-"}</td>
                    <td>{p.weight ?? "-"}</td>
                    <td>
                      <span className={`status-badge status-${(p.status || "").toLowerCase()}`}>
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={p.status || "pending"}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        disabled={loading}
                      >
                        <option value="pending">Чакаща</option>
                        <option value="in_transit">В транзит</option>
                        <option value="delivered">Доставена</option>
                        <option value="return">Връщане</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Packages;
