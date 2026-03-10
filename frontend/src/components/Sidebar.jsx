import { NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/residents', label: 'Residents' },
  { to: '/visitors', label: 'Visitors' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/notices', label: 'Notices' },
  { to: '/chat', label: 'Chat' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <>
      <div className="sidebar-logo">SocioSphere</div>
      <nav className="sidebar-nav">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              ['sidebar-link', isActive ? 'active' : ''].filter(Boolean).join(' ')
            }
          >
            <span className="sidebar-link-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Smart Society · v1.0</div>
    </>
  );
}

