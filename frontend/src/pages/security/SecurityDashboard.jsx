export default function SecurityDashboard() {
  return (
    <div className="dashboard-grid">
      <section className="dashboard-card wide">
        <h2>Visitor Entry Logging</h2>
        <button className="btn-primary">Log New Entry</button>
        <p className="muted">Capture visitor details at the gate.</p>
      </section>
      <section className="dashboard-card">
        <h2>Visitor Exit Logging</h2>
        <button className="btn-secondary">Log Exit</button>
      </section>
      <section className="dashboard-card">
        <h2>Resident Search</h2>
        <input className="input" placeholder="Search by flat or name" />
      </section>
      <section className="dashboard-card wide">
        <h2>Today&apos;s Visitors</h2>
        <p className="metric">34</p>
        <p className="muted">Total visitors logged so far today.</p>
      </section>
    </div>
  );
}

