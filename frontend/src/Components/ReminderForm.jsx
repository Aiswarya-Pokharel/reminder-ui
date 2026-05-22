import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTag,
  FaAlignLeft,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import BASE_URL from "../api";

const ReminderForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    reminder_date: "",
    reminder_time: "",
    priority: "Medium",
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.reminder_date) newErrors.reminder_date = "Date is required";
    if (!form.reminder_time) newErrors.reminder_time = "Time is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("loading");
    const datetime = `${form.reminder_date}T${form.reminder_time}`;
    try {
      const response = await fetch(`${BASE_URL}/api/reminders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          reminder_time: datetime,
          priority: form.priority,
        }),
      });
      if (!response.ok) {
        let data = {};
        try {
          data = await response.json();
        } catch {
          data = { non_field: `Server error (${response.status}).` };
        }
        setErrors(data);
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({
        title: "",
        description: "",
        reminder_date: "",
        reminder_time: "",
        priority: "Medium",
      });
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("error");
      setErrors({ non_field: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ee] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray rounded-2xl shadow-sm p-7 font-sans">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-logo mb-1">
              Reminder App
            </p>
            <h2
              className="text-2xl font-normal text-gray-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              New <span className="text-emerald-600">reminder</span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-content hover:text-gray-700 transition mt-1"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Success */}
        {status === "success" && (
          <div className="flex items-center gap-2 mb-4 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm">
            <FaCheckCircle size={13} /> Reminder added successfully!
          </div>
        )}

        {/* Non-field error */}
        {errors.non_field && (
          <div className="mb-4 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
            {errors.non_field}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-xs text-content uppercase tracking-wide">
              <FaTag size={11} /> Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter reminder title..."
              className={`border rounded-xl px-3 py-2.5 text-sm w-full bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition ${errors.title ? "border-red-400" : "border-gray"}`}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-xs text-content uppercase tracking-wide">
              <FaAlignLeft size={11} /> Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description..."
              rows={3}
              className="border border-gray rounded-xl px-3 py-2.5 text-sm w-full bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none transition"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-content uppercase tracking-wide">
                <FaCalendarAlt size={11} /> Date
              </label>
              <input
                type="date"
                name="reminder_date"
                value={form.reminder_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`border rounded-xl px-3 py-2.5 text-sm w-full bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition ${errors.reminder_date ? "border-red-400" : "border-gray"}`}
              />
              {errors.reminder_date && (
                <span className="text-xs text-red-500">
                  {errors.reminder_date}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-xs text-content uppercase tracking-wide">
                <FaClock size={11} /> Time
              </label>
              <input
                type="time"
                name="reminder_time"
                value={form.reminder_time}
                onChange={handleChange}
                className={`border rounded-xl px-3 py-2.5 text-sm w-full bg-[#f4f3ee] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition ${errors.reminder_time ? "border-red-400" : "border-gray"}`}
              />
              {errors.reminder_time && (
                <span className="text-xs text-red-500">
                  {errors.reminder_time}
                </span>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-xs text-content uppercase tracking-wide">
              <FaExclamationCircle size={11} /> Priority
            </label>
            <div className="flex gap-2">
              {["High", "Medium", "Low"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, priority: level }))
                  }
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition
                    ${
                      form.priority === level
                        ? level === "High"
                          ? "bg-red-100 border-red-400 text-red-600"
                          : level === "Medium"
                            ? "bg-yellow-100 border-yellow-400 text-yellow-600"
                            : "bg-emerald-100 border-emerald-400 text-emerald-600"
                        : "bg-[#f4f3ee] text-content border-gray hover:border-content"
                    }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {status === "loading" ? (
              <>
                <FaSpinner className="animate-spin" size={13} /> Adding...
              </>
            ) : (
              "Add reminder"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReminderForm;
