
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/AdminRevenue.css";

function AdminRevenue() {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();
  if (role !== "admin") return <Navigate to="/dashboard" />;

  const [dtStart, setDtStart] = useState("");
  const [dtEnd, setDtEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [sumMoney, setSumMoney] = useState(null);
  const [error, setError] = useState("");

  const canSearch = useMemo(() => {
    if (!dtStart || !dtEnd) return false;
    return new Date(dtStart).getTime() <= new Date(dtEnd).getTime();
  }, [dtStart, dtEnd]);

  // по подразбиране: текущ месец
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const toISO = (d) => d.toISOString().slice(0, 10);

    const start = toISO(firstDay);
    const end = toISO(lastDay);

    setDtStart(start);
    setDtEnd(end);
    
    // Auto-load revenue for current month after dates are set
    const loadRevenue = async () => {
      setError("");
      setSumMoney(null);
      setLoading(true);
      
      try {
        const res = await fetch("http://localhost:5000/packages/post-totalMoney", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ dtStart: start, dtEnd: end }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Грешка при зареждане на приходите.");

        setSumMoney(Number(data.sumMoney || 0));
      } catch (e2) {
        setError(e2.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadRevenue();
  }, []);

  const fetchRevenue = async (e) => {
    e?.preventDefault();
    setError("");
    setSumMoney(null);

    if (!dtStart || !dtEnd) {
      setError("Моля, изберете начална и крайна дата.");
      return;
    }
    if (new Date(dtStart) > new Date(dtEnd)) {
      setError("Началната дата не може да е след крайната.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/packages/post-totalMoney", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dtStart, dtEnd }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка при зареждане на приходите.");

      setSumMoney(Number(data.sumMoney || 0));
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Приходи за период</h1>

      <form className="revenue-card" onSubmit={fetchRevenue}>
        <div className="revenue-grid">
          <div>
            <label>От дата</label>
            <input
              type="date"
              value={dtStart}
              onChange={(e) => setDtStart(e.target.value)}
            />
          </div>

          <div>
            <label>До дата</label>
            <input
              type="date"
              value={dtEnd}
              onChange={(e) => setDtEnd(e.target.value)}
            />
          </div>

          <div className="revenue-actions">
            <button type="submit" disabled={!canSearch || loading}>
              {loading ? "Зареждане..." : "Покажи приходи"}
            </button>
          </div>
        </div>

        {error && <p className="msg error">{error}</p>}

        {sumMoney !== null && !error && (
          <div className="result-box">
            <div className="result-title">Общо приходи</div>
            <div className="result-value">{sumMoney.toFixed(2)} лв.</div>
            <div className="result-sub">
              * Изчислено по доставени пратки (status = delivered)
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AdminRevenue;
