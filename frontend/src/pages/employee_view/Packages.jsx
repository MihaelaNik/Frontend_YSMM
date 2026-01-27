import { useEffect, useMemo, useState } from "react";
import "../../styles/Packages.css";

const API = "http://localhost:5000";

function getLocalUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUserId(user) {
  return user?.id ?? user?.userId ?? user?.user_id ?? null;
}

function getUserRole(user) {
  return (user?.user_type || user?.role || "").toString().toLowerCase();
}

async function tryFetchJson(url, { method = "GET", body } = {}) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();

  // If route doesn't exist, Express returns HTML "Cannot POST ..." (not JSON)
  const looksLikeHtml = text.trim().startsWith("<!DOCTYPE html>") || text.includes("Cannot POST");

  let data = {};
  if (!looksLikeHtml) {
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
  } else {
    data = { raw: text };
  }

  return { ok: res.ok, status: res.status, data, looksLikeHtml, url };
}

async function apiFetchFallback(paths, { method = "GET", body } = {}) {
  let lastError = null;

  for (const path of paths) {
    const url = `${API}${path}`;
    const r = await tryFetchJson(url, { method, body });

    // If endpoint exists but returns error (401/500), we should surface it.
    if (!r.looksLikeHtml) {
      if (r.ok) return r.data;
      throw new Error(r.data?.error || r.data?.message || r.data?.raw || `Request failed (${r.status})`);
    }

    // If it looks like "Cannot POST /xxx", try next path
    lastError = new Error(`Endpoint not found: ${path}`);
  }

  throw lastError || new Error("No working endpoint found.");
}

export default function Packages() {
  const user = useMemo(() => getLocalUser(), []);
  const role = useMemo(() => getUserRole(user), [user]);
  const myUserId = useMemo(() => getUserId(user), [user]);

  const [activeTab, setActiveTab] = useState("all"); // all | mine | transit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dtStart, setDtStart] = useState("");
  const [dtEnd, setDtEnd] = useState("");

  const [rows, setRows] = useState([]);
  const [statusBusyId, setStatusBusyId] = useState(null);

  const isAllowed = user && (role === "employee" || role === "admin" || role === "courier");

  const endpoints = useMemo(() => {
    return {
      listAll: [
        "/packages/post-listPackages",
        "/packages/list",
        "/api/packages/post-listPackages",
        "/api/packages/list",
      ],
      listMine: [
        "/packages/post-listPackagesEmployees",
        "/packages/listByEmployee",
        "/api/packages/post-listPackagesEmployees",
        "/api/packages/listByEmployee",
      ],
      listTransit: [
        "/packages/post-listPackagesTransit",
        "/packages/listTransit",
        "/api/packages/post-listPackagesTransit",
        "/api/packages/listTransit",
      ],
      status: [
        "/packages/packageStatus",
        "/api/packages/packageStatus",
      ],
    };
  }, []);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const body = {
        page,
        ...(dtStart ? { dtStart } : {}),
        ...(dtEnd ? { dtEnd } : {}),
      };

      let data;

      if (activeTab === "transit") {
        data = await apiFetchFallback(endpoints.listTransit, { method: "POST", body });
      } else if (activeTab === "mine") {
        if (!myUserId) throw new Error("Липсва user id в localStorage.");
        data = await apiFetchFallback(endpoints.listMine, {
          method: "POST",
          body: { ...body, employeesId: myUserId },
        });
      } else {
        data = await apiFetchFallback(endpoints.listAll, { method: "POST", body });
      }

      setRows(Array.isArray(data?.listPackages) ? data.listPackages : []);
      setTotalPages(Number(data?.totalPages || 1));
    } catch (e) {
      setRows([]);
      setTotalPages(1);
      setError(e.message || "Грешка при зареждане.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAllowed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  useEffect(() => {
    setPage(1);
  }, [dtStart, dtEnd, activeTab]);

  useEffect(() => {
    if (!isAllowed) return;
    if (page !== 1) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dtStart, dtEnd]);

  async function updateStatus(packageId, status) {
    if (!packageId) return;
    setStatusBusyId(packageId);
    setError("");

    try {
      await apiFetchFallback(endpoints.status, {
        method: "POST",
        body: { packageId, status },
      });

      setRows((prev) => prev.map((r) => (r.id === packageId ? { ...r, status } : r)));
    } catch (e) {
      setError(e.message || "Неуспешна промяна на статус.");
    } finally {
      setStatusBusyId(null);
    }
  }

  if (!user) {
    return (
      <div className="packages-page">
        <div className="packages-card">
          <h2>Пратки</h2>
          <p className="packages-error">Моля, влезте в профила си.</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="packages-page">
        <div className="packages-card">
          <h2>Пратки</h2>
          <p className="packages-error">Нямате достъп до тази страница.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <div className="packages-card">
        <div className="packages-header">
          <h2>Пратки</h2>

          <div className="packages-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("all");
                setPage(1);
              }}
            >
              Всички
            </button>

            <button
              className={`tab-btn ${activeTab === "mine" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("mine");
                setPage(1);
              }}
              disabled={!myUserId}
            >
              Моите
            </button>

            <button
              className={`tab-btn ${activeTab === "transit" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("transit");
                setPage(1);
              }}
            >
              В транзит
            </button>
          </div>
        </div>

        <div className="packages-filters">
          <div className="filter-item">
            <label>От дата</label>
            <input type="date" value={dtStart} onChange={(e) => setDtStart(e.target.value)} />
          </div>

          <div className="filter-item">
            <label>До дата</label>
            <input type="date" value={dtEnd} onChange={(e) => setDtEnd(e.target.value)} />
          </div>

          <button className="packages-refresh-btn" onClick={load} disabled={loading}>
            Обнови
          </button>
        </div>

        {error && <p className="packages-error">{error}</p>}
        {loading && <p className="packages-loading">Зареждане...</p>}

        <div className="packages-table-wrap">
          <table className="packages-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Подател</th>
                <th>Получател</th>
                <th>Офис Подател</th>
                <th>Офис Получател</th>
                <th>Тегло</th>
                <th>Статус</th>
                <th>Промяна</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} className="packages-empty">
                    Няма намерени пратки.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{String(p.date_pack_start || "").slice(0, 10)}</td>

                    <td className="cell-wrap">
                      <div className="cell-title">{p.senderName || "-"}</div>
                      <div className="cell-sub">{p.senderPhone ? `тел: ${p.senderPhone}` : ""}</div>
                      <div className="cell-sub">
                        {p.senderCity ? `${p.senderCity}` : ""}
                        {p.senderAddress ? `, ${p.senderAddress}` : ""}
                      </div>
                    </td>

                    <td className="cell-wrap">
                      <div className="cell-title">{p.receiverName || "-"}</div>
                      <div className="cell-sub">{p.receiverPhone ? `тел: ${p.receiverPhone}` : ""}</div>
                      <div className="cell-sub">
                        {p.receiverCity ? `${p.receiverCity}` : ""}
                        {p.receiverAddress ? `, ${p.receiverAddress}` : ""}
                      </div>
                    </td>

                    <td>{p.senderOffice || "-"}</td>
                    <td>{p.receiverOffice || "-"}</td>
                    <td>{p.weight ?? "-"}</td>

                    <td>
                      <span className={`status-pill status-${p.status || "pending"}`}>
                        {p.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={p.status || "pending"}
                        disabled={statusBusyId === p.id}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                      >
                        <option value="pending">pending</option>
                        <option value="in_transit">in_transit</option>
                        <option value="delivered">delivered</option>
                        <option value="return">return</option>
                      </select>
                      {statusBusyId === p.id && <span className="status-saving">…</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="packages-pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || page <= 1}
          >
            ◀ Предишна
          </button>

          <div className="page-info">
            Страница <b>{page}</b> от <b>{totalPages}</b>
          </div>

          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={loading || page >= totalPages}
          >
            Следваща ▶
          </button>
        </div>
      </div>
    </div>
  );
}