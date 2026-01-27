import { useEffect, useState } from "react";
import "../../styles/Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/employees/getEmployee", {
          credentials: "include", // safe to keep (sessions)
        });

        if (!res.ok) throw new Error("Грешка при зареждане на служителите.");

        const data = await res.json();
        setEmployees(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return (
    <div className="employees-page">
      <div className="employees-card">
        <h2>Служители</h2>

        {loading && <p>Зареждане...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && employees.length === 0 && <p>Няма служители.</p>}

        {employees.length > 0 && (
          <div className="employees-table-wrap">
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Име</th>
                  <th>Email</th>
                  {/* <th>Роля</th> */}
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td>{e.email || "-"}</td>
                    {/* <td>{e.role_id}</td> */}
                    {/* <td>{roleName(e.role_id)}</td> */}

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

export default Employees;
