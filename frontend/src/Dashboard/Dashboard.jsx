import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f3ee]">
      <div className="max-w-2xl w-full px-6 py-10 font-sans">
        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-logo mb-2">
            Reminder App
          </p>
          <h1
            className="text-4xl font-normal leading-tight mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Stay on top of{" "}
            <span className="text-emerald-600">what matters.</span>
          </h1>
          <p className="text-sm text-content leading-relaxed">
            Create and manage your reminders with ease. Use the navigation above
            to get started.
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            to="/create"
            className="no-underline bg-white border shadow-md border-gray rounded-xl p-5 flex flex-col gap-2 hover:border-content transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              ＋
            </div>
            <p className="text-sm font-medium text-gray-900 m-0">
              New reminder
            </p>
            <p className="text-xs text-content leading-relaxed m-0">
              Add a task or event you don't want to forget.
            </p>
          </Link>

          <Link
            to="/reminders"
            className="no-underline bg-white border border-gray rounded-xl p-5 flex flex-col gap-2 hover:border-content transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              ☑
            </div>
            <p className="text-sm font-medium text-gray-900 m-0">View all</p>
            <p className="text-xs text-content leading-relaxed m-0">
              Browse and manage your existing reminders.
            </p>
          </Link>
        </div>

        {/* Tip */}
        <div className="flex items-center gap-3 bg-neutral-150 shadow-md rounded-xl px-5 py-4">
          <span className="text-emerald-700 text-lg">✨</span>
          <p className="text-xs text-emerald-900 leading-relaxed m-0">
            <strong>One reminder a day</strong> keeps the "oh no I forgot" away.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
