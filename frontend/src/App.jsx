import ReminderForm from "./Components/ReminderForm";
import ReminderList from "./Components/ReminderList";
import { useState } from "react";
import Dashboard from "./Dashboard/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(true);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/create"
          element={
            <>
              {showForm && (
                <ReminderForm
                  onSuccess={() => setRefresh((n) => n + 1)}
                  onClose={() => setShowForm(false)}
                />
              )}
            </>
          }
        />
        <Route path="/reminders" element={<ReminderList refresh={refresh} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
