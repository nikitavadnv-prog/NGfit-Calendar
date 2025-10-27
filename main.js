import React, { useEffect, useState } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { Calendar, momentLocalizer } from "https://esm.sh/react-big-calendar";
import moment from "https://esm.sh/moment";

const localizer = momentLocalizer(moment);

// 🔒 вставь сюда свой токен безопасно
const AIRTABLE_TOKEN = "patXXXXXXXXXXXX"; // замени на свой токен
const BASE_ID = "appaGzhibZGjMYx2a";
const TABLE_ID = "tblWefEB9Uagm0R3D";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = data.records
          .filter((r) => r.fields["Дата"])
          .map((r) => ({
            id: r.id,
            title: r.fields["Клиент"] || "Без названия",
            start: new Date(r.fields["Дата"]),
            end: new Date(r.fields["Дата"]),
          }));
        setEvents(items);
      });
  }, []);

  return (
    <div style={{ height: "90vh", margin: "20px" }}>
      <h2>📅 NGFit — календарь тренировок</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
