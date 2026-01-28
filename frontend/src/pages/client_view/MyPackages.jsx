import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import "../../styles/MyPackages.css";

function MyPackages() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;

  const role = (user.user_type || user.role || "").toString().toLowerCase();
  if (role !== "client") return <Navigate to="/dashboard" />;

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("sent"); // sent | received
  const [error, setError] = useState("");

  const [clientId, setClientId] = useState(null);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);

  const activeList = useMemo(
    () => (tab === "sent" ? sent : received),
    [tab, sent, received]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        // 1) взимаме client профила за да знаем clientId
        const resClient = await fetch("http://localhost:5000/clients/myClient", {
          credentials: "include",
        });

        if (!resClient.ok) {
          const text = await resClient.text();
          let errorMsg = "Грешка при зареждане на профила.";
          try {
            const json = JSON.parse(text);
            errorMsg = json.error || errorMsg;
          } catch {
            errorMsg = `HTTP ${resClient.status}: ${text.substring(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        const dataClient = await resClient.json();
        const cid = dataClient.id;
        setClientId(cid);

        // 2) Изпратени пратки
        const resSent = await fetch(
          "http://localhost:5000/packages/post-listSentPackages",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ clientId: cid, page: 1 }),
          }
        );

        if (!resSent.ok) {
          const text = await resSent.text();
          let errorMsg = "Грешка при зареждане на изпратени пратки.";
          try {
            const json = JSON.parse(text);
            errorMsg = json.error || errorMsg;
          } catch {
            errorMsg = `HTTP ${resSent.status}: ${text.substring(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        const dataSent = await resSent.json();
        setSent(dataSent.listPackages || []);

        // 3) Получени пратки
        const resRec = await fetch(
          "http://localhost:5000/packages/post-listReceiverPackages",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ clientId: cid, page: 1 }),
          }
        );

        if (!resRec.ok) {
          const text = await resRec.text();
          let errorMsg = "Грешка при зареждане на получени пратки.";
          try {
            const json = JSON.parse(text);
            errorMsg = json.error || errorMsg;
          } catch {
            errorMsg = `HTTP ${resRec.status}: ${text.substring(0, 100)}`;
          }
          throw new Error(errorMsg);
        }

        const dataRec = await resRec.json();
        setReceived(dataRec.listPackages || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statusClass = (s) => {
    const v = (s || "").toLowerCase();
    if (v === "delivered") return "status delivered";
    if (v === "in_transit") return "status transit";
    if (v === "return") return "status returned";
    return "status pending";
  };

  const statusText = (s) => {
    const v = (s || "").toLowerCase();
    if (v === "delivered") return "Доставена";
    if (v === "in_transit") return "В транспорт";
    if (v === "return") return "Връщане";
    return "Чакаща";
  };

  if (loading) {
    return (
      <div className="mypackages-page">
        <div className="mypackages-card">Зареждане...</div>
      </div>
    );
  }

  return (
    <div className="mypackages-page">
      <div className="mypackages-card">
        <h2>Моите пратки</h2>

        {error && <p className="mypackages-error">{error}</p>}

        <div className="tabs">
          <button
            className={tab === "sent" ? "tab active" : "tab"}
            onClick={() => setTab("sent")}
          >
            Изпратени ({sent.length})
          </button>

          <button
            className={tab === "received" ? "tab active" : "tab"}
            onClick={() => setTab("received")}
          >
            Получени ({received.length})
          </button>
        </div>

        {!clientId && (
          <p className="mypackages-hint">
            Няма клиентски профил към този акаунт.
          </p>
        )}

        {activeList.length === 0 ? (
          <p className="mypackages-hint">Няма пратки за показване.</p>
        ) : (
          <div className="table-wrap">
            <table className="mypackages-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Дата</th>
                  <th>Подател</th>
                  <th>Получател</th>
                  <th>От офис</th>
                  <th>До офис</th>
                  <th>Тегло</th>
                  <th>Статус</th>
                </tr>
              </thead>

              <tbody>
                {activeList.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.date_pack_start || "-"}</td>

                    <td>
                      {p.senderName || "-"}
                      {p.senderPhone ? <div className="muted">{p.senderPhone}</div> : null}
                    </td>

                    <td>
                      {p.receiverName || "-"}
                      {p.receiverPhone ? <div className="muted">{p.receiverPhone}</div> : null}
                    </td>

                    <td>{p.senderOffice || "-"}</td>
                    <td>{p.receiverOffice || "-"}</td>

                    <td>{p.weight ?? "-"}</td>

                    <td>
                      <span className={statusClass(p.status)}>
                        {statusText(p.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mypackages-footer">
          <span className="muted">
            * Изпратени = вие сте подател. Получени = вие сте получател.
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyPackages;
