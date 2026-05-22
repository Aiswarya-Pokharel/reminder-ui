import { useEffect, useState, useCallback } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaTag,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";

const PRIORITY_STYLES = {
  High: "bg-red-100 border-red-400 text-red-600",
  Medium: "bg-yellow-100 border-yellow-400 text-yellow-600",
  Low: "bg-emerald-100 border-emerald-400 text-emerald-600",
};

const ReminderList = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/reminders/`);
      if (!res.ok) throw new Error("Failed to load");
      setReminders(await res.json());
    } catch {
      setError("Failed to load reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/reminders/`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        
        setReminders(await res.json());
      } catch (err) {
        if (err.name === "AbortError") return;
        setError("Failed to load reminders. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [refreshTrigger]);

  const startEdit = (r) => {
    setEditingId(r.id);
    setError(null);
    setEditForm({
      title: r.title,
      description: r.description,
      reminder_date: r.reminder_time.split("T")[0],
      reminder_time: r.reminder_time.split("T")[1].slice(0, 5),
      priority: r.priority,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setError(null);
  };

  const saveEdit = async (id) => {
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/reminders/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          reminder_time: `${editForm.reminder_date}T${editForm.reminder_time}`,
          priority: editForm.priority,
        }),
      });
      if (!res.ok) {
        setError("Failed to save. Please try again.");
        return;
      }
      await fetchReminders();
      cancelEdit();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/reminders/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Failed to delete.");
        return;
      }
      await fetchReminders();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f4f3ee] flex items-center justify-center">
        <FaSpinner className="animate-spin text-emerald-600" size={22} />
      </div>
    );

  if (error && !reminders.length)
    return (
      <div className="min-h-screen bg-[#f4f3ee] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="text-red-400 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
          <button
            onClick={fetchReminders}
            className="mt-3 w-full text-sm text-gray-500 border border-gray rounded-xl py-2 hover:bg-white transition"
          >
            Try again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f4f3ee] px-4 py-10 font-sans">
      <div className="max-w-md mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-logo mb-1">
              Reminder App
            </p>
            <h1
              className="text-3xl font-normal text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Your <span className="text-emerald-600">reminders.</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-content hover:text-gray-700 transition mt-1"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        {!reminders.length ? (
          <div className="bg-white border border-gray rounded-2xl p-8 text-center">
            <p className="text-content text-sm">
              No reminders yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reminders.map((r) => {
              const isEditing = editingId === r.id;
              return (
                <div
                  key={r.id}
                  className="bg-[#fcfcfd5a] border border-gray  shadow-md rounded-2xl p-5 hover:border-content transition-colors"
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      {/* Title */}
                      <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1 text-xs text-content uppercase tracking-wide">
                          <FaTag size={10} /> Title
                        </label>
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              title: e.target.value,
                            }))
                          }
                          className="border border-gray rounded-xl px-3 py-2 text-sm bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                        />
                      </div>
                      {/* Description */}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-content uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                          rows={2}
                          className="border border-gray rounded-xl px-3 py-2 text-sm bg-[#f4f3ee] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                        />
                      </div>
                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-1 text-xs text-content uppercase tracking-wide">
                            <FaCalendarAlt size={10} /> Date
                          </label>
                          <input
                            type="date"
                            value={editForm.reminder_date}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                reminder_date: e.target.value,
                              }))
                            }
                            className="border border-gray rounded-xl px-2 py-2 text-sm bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-1 text-xs text-content uppercase tracking-wide">
                            <FaClock size={10} /> Time
                          </label>
                          <input
                            type="time"
                            value={editForm.reminder_time}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                reminder_time: e.target.value,
                              }))
                            }
                            className="border border-gray rounded-xl px-2 py-2 text-sm bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                          />
                        </div>
                      </div>
                      {/* Priority */}
                      <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1 text-xs text-content uppercase tracking-wide">
                          <FaExclamationCircle size={10} /> Priority
                        </label>
                        <div className="flex gap-2">
                          {["High", "Medium", "Low"].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() =>
                                setEditForm((p) => ({ ...p, priority: lvl }))
                              }
                              className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition ${editForm.priority === lvl ? PRIORITY_STYLES[lvl] : "bg-[#f4f3ee] text-content border-gray hover:border-content"}`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => saveEdit(r.id)}
                          disabled={saving === r.id}
                          className="flex-1 flex items-center justify-center gap-1 bg-accent hover:bg-accent-hover text-white text-xs font-medium py-2 rounded-xl transition disabled:opacity-60"
                        >
                          {saving === r.id ? (
                            <FaSpinner className="animate-spin" size={11} />
                          ) : (
                            <FaCheck size={11} />
                          )}{" "}
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 flex items-center justify-center gap-1 border border-gray text-gray-500 text-xs font-medium py-2 rounded-xl hover:bg-[#f4f3ee] transition"
                        >
                          <FaTimes size={11} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {r.title}
                          </p>
                          {r.description && (
                            <p className="text-xs text-content mt-0.5 line-clamp-2">
                              {r.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => startEdit(r)}
                            className="p-1.5 rounded-lg text-content hover:text-emerald-600 hover:bg-emerald-50 transition"
                            title="Edit"
                          >
                            <FaEdit size={13} />
                          </button>
                          <button
                            onClick={() => deleteReminder(r.id)}
                            disabled={deletingId === r.id}
                            className="p-1.5 rounded-lg text-content hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === r.id ? (
                              <FaSpinner className="animate-spin" size={13} />
                            ) : (
                              <FaTrash size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-content">
                          <FaCalendarAlt size={10} />
                          {new Date(r.reminder_time).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${PRIORITY_STYLES[r.priority]}`}
                        >
                          {r.priority}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderList;
