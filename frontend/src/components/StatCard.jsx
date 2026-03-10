import '../styles/cards.css';

export default function StatCard({ title, value, subtext, tone = 'default' }) {
  const toneClass =
    tone === 'positive' ? 'badge-positive' : tone === 'warning' ? 'badge-warning' : '';

  return (
    <div className="card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-value">{value}</div>
      {subtext && (
        <div className={`stat-card-sub ${toneClass}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

