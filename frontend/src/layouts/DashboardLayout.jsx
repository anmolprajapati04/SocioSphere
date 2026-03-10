import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/global.css';
import '../styles/layout.css';
import '../styles/navbar.css';
import '../styles/sidebar.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <div className="main-shell">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

