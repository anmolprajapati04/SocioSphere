import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  AlertCircle, 
  CreditCard, 
  Calendar, 
  Bell, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    const base = [
      { to: '/chat', label: 'Messages', icon: MessageSquare },
      { to: '/settings', label: 'Settings', icon: Settings },
    ];

    if (user?.role === 'Admin') {
      return [
        { to: '/admin', label: 'Console', icon: LayoutDashboard },
        { to: '/residents', label: 'Residents', icon: Users },
        { to: '/admin/maintenance', label: 'Finance', icon: CreditCard },
        { to: '/complaints', label: 'Control', icon: AlertCircle },
        ...base
      ];
    }
    if (user?.role === 'Resident') {
      return [
        { to: '/resident', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/maintenance', label: 'Payments', icon: CreditCard },
        { to: '/amenities', label: 'Bookings', icon: Calendar },
        { to: '/notices', label: 'Bulletin', icon: Bell },
        ...base
      ];
    }
    if (user?.role === 'Security') {
      return [
        { to: '/security', label: 'Terminal', icon: Shield },
        { to: '/visitors', label: 'Access Log', icon: Users },
        ...base
      ];
    }
    return base;
  };

  const menuLinks = getLinks();

  return (
    <div className="w-80 bg-white border-r border-slate-100 flex flex-col h-screen overflow-hidden">
      <div className="p-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-elegant-gold" />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary-900 tracking-tighter">SocioSphere</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-primary-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.15)]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-primary-900'}
            `}
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
              <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
          </NavLink>
        ))}
      </nav>

      <div className="p-8">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-500 group"
        >
          <div className="flex items-center gap-4">
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Terminate Session</span>
          </div>
        </button>
        <div className="mt-6 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">SocioSphere Platinum · v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

