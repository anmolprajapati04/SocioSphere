// UI component responsible for rendering part of the interface
// Added comments to improve code readability
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, societyName } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-title">SocioSphere</div>
        <span className="society-badge">{societyName || 'Select Society'}</span>
      </div>
      <div className="navbar-right">
        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{user?.role || 'Guest'}</span>
        <div className="avatar">{initials || 'SS'}</div>
      </div>
    </header>
  );
}

