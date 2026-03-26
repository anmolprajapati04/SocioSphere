export default function SecurityDashboard() {
  return (
    <div className="dashboard-grid p-4 gap-4">
      
      {/* Visitor Entry */}
      <section className="dashboard-card wide shadow-md rounded-2xl p-5 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Visitor Entry Logging</h2>
          <span className="text-2xl">📝</span>
        </div>

        <p className="muted mb-4 text-sm">
          Capture visitor details at the gate.
        </p>

        <button className="btn-primary w-full py-2 rounded-lg hover:scale-[1.02] active:scale-95 transition">
          + Log New Entry
        </button>
      </section>

      {/* Visitor Exit */}
      <section className="dashboard-card shadow-md rounded-2xl p-5 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Visitor Exit Logging</h2>
          <span className="text-2xl">🚪</span>
        </div>

        <p className="muted mb-4 text-sm">
          Mark visitor exit quickly.
        </p>

        <button className="btn-secondary w-full py-2 rounded-lg hover:scale-[1.02] active:scale-95 transition">
          Log Exit
        </button>
      </section>

      {/* Resident Search */}
      <section className="dashboard-card shadow-md rounded-2xl p-5 hover:shadow-lg transition">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Resident Search</h2>
          <span className="text-2xl">🔍</span>
        </div>

        <input
          className="input w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Search by flat or name..."
        />

        <p className="muted text-xs mt-2">
          Quickly find resident details.
        </p>
      </section>

      {/* Today's Visitors */}
      <section className="dashboard-card wide shadow-md rounded-2xl p-5 hover:shadow-lg transition bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Today's Visitors</h2>
          <span className="text-2xl">📊</span>
        </div>

        <p className="metric text-3xl font-bold text-blue-600">34</p>

        <p className="muted text-sm">
          Total visitors logged so far today.
        </p>
      </section>

    </div>
  );
}

