import React, { useEffect, useState } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { Calendar, momentLocalizer } from "https://esm.sh/react-big-calendar";
import moment from "https://esm.sh/moment";

const localizer = momentLocalizer(moment);

// 🔒 Токен пока оставляем пустым, для безопасности
const AIRTABLE_TOKEN = "";
const BASE_ID = "appaGzhibZGjMYx2a";
const TABLE_ID = "tblWefEB9Uagm0R3D";

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
        });
        const data = await res.json();

        if (!data.records) {
          setError("Не удалось получить записи из Airtable.");
          return;
        }

        const items = data.records
          .filter((r) => r.fields["Дата"])
          .map((r) => ({
            id: r.id,
            title: r.fields["Клиент"] || "Без названия",
            start: new Date(r.fields["Дата"]),
            end: new Date(r.fields["Дата"]),
          }));

        setEvents(items);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Ошибка при загрузке данных из Airtable.");
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ height: "90vh", margin: "40px", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>📅 NGFit — календарь тренировок</h2>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
        />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
