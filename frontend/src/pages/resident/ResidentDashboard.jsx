export default function ResidentDashboard() {
  return (
    <div className="dashboard-grid">
      <section className="dashboard-card wide">
        <h2>Maintenance Payments</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>January</td>
              <td>₹ 2,500</td>
              <td className="status-paid">Paid</td>
            </tr>
            <tr>
              <td>February</td>
              <td>₹ 2,500</td>
              <td className="status-due">Due</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="dashboard-card">
        <h2>Complaints</h2>
        <button className="btn-primary">Submit New Complaint</button>
        <p className="muted">Track issues and follow their status.</p>
      </section>
      <section className="dashboard-card">
        <h2>Visitor Approvals</h2>
        <p>No pending visitor requests.</p>
      </section>
      <section className="dashboard-card">
        <h2>Amenity Bookings</h2>
        <p>Book clubhouse, gym, or garden slots.</p>
      </section>
      <section className="dashboard-card wide">
        <h2>Society Notices</h2>
        <ul className="notices-list">
          <li>Water supply maintenance on Sunday, 10AM–2PM.</li>
          <li>Festival celebration in the clubhouse this weekend.</li>
        </ul>
      </section>
    </div>
  );
}

