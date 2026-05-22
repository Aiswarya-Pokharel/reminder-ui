import { useState } from "react";
import {
  FaTag,
  FaAlignLeft,
  FaCalendarAlt,
  FaClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const ReminderForm = () => {
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
      const response = await fetch("/api/reminders/", {
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
          data = {
            non_field: `Server error (${response.status}). Please try again.`,
          };
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
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrors({ non_field: "Network error. Please try again." });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-primary rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-6 text-center italic text-gray-800">
        Add reminder
      </h2>

      {status === "success" && (
        <div className="flex items-center gap-2 mb-4 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm">
          <FaCheckCircle /> Reminder added successfully!
        </div>
      )}

      {errors.non_field && (
        <div className="mb-4 text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">
          {errors.non_field}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-secondary p-4 rounded-lg shadow-sm"
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <FaTag size={13} /> Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title"
            style={{
              borderColor: errors.title ? "#ef4444" : "var(--color-border)",
            }}
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
          {errors.title && (
            <span className="text-xs text-red-500">{errors.title}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <FaAlignLeft size={13} /> Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            style={{ borderColor: "var(--color-border)" }}
            className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm text-gray-500">
              <FaCalendarAlt size={13} /> Date
            </label>
            <input
              type="date"
              name="reminder_date"
              value={form.reminder_date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              style={{
                borderColor: errors.reminder_date
                  ? "#ef4444"
                  : "var(--color-border)",
              }}
              className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            {errors.reminder_date && (
              <span className="text-xs text-red-500">
                {errors.reminder_date}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm text-gray-500">
              <FaClock size={13} /> Time
            </label>
            <input
              type="time"
              name="reminder_time"
              value={form.reminder_time}
              onChange={handleChange}
              style={{
                borderColor: errors.reminder_time
                  ? "#ef4444"
                  : "var(--color-border)",
              }}
              className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
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
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <FaExclamationCircle size={13} /> Priority
          </label>
          <div className="flex gap-2 flex-wrap">
            {["High", "Medium", "Low"].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, priority: level }))
                }
                className={`flex-1 min-w-15 py-1.5 rounded-lg text-xs font-medium border transition
          ${
            form.priority === level
              ? level === "High"
                ? "bg-red-100 border-red-400 text-red-600"
                : level === "Medium"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-600"
                  : "bg-green-100 border-green-400 text-green-600"
              : "bg-transparent text-gray-400 border-gray-200 hover:border-gray-400"
          }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-2 w-full bg-accent hover:bg-accent-hover text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <>
              <FaSpinner className="animate-spin" size={14} /> Adding...
            </>
          ) : (
            "Add reminder"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;
