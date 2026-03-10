import '../styles/cards.css';

export default function DashboardCard({ title, subtitle, children }) {
  return (
    <section className="card">
      {(title || subtitle) && (
        <header style={{ marginBottom: '0.4rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{title}</h3>}
          {subtitle && (
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

