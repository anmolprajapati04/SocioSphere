import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Search,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const SidebarLink = ({ icon: Icon, label, href, active, collapsed }) => (
  <Link 
    to={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
      active 
        ? "bg-primary-600/10 text-primary-400 border border-primary-500/20" 
        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-primary-500" : "group-hover:text-slate-200")} />
    {!collapsed && (
      <span className="font-medium whitespace-nowrap">{label}</span>
    )}
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
      />
    )}
  </Link>
);

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = user?.role || 'Resident';
  
  const menuItems = {
    Admin: [
      { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
      { icon: Users, label: 'Residents', href: '/admin/residents' },
      { icon: Bell, label: 'Notices', href: '/admin/notices' },
      { icon: MessageSquare, label: 'Complaints', href: '/admin/complaints' },
      { icon: CreditCard, label: 'Finances', href: '/admin/finances' },
    ],
    Resident: [
      { icon: LayoutDashboard, label: 'Overview', href: '/resident' },
      { icon: CreditCard, label: 'Bills & Payments', href: '/resident/payments' },
      { icon: MessageSquare, label: 'Complaints', href: '/resident/complaints' },
      { icon: Calendar, label: 'Facility Booking', href: '/resident/bookings' },
      { icon: Users, label: 'Visitors', href: '/resident/visitors' },
    ],
    Security: [
      { icon: LayoutDashboard, label: 'Gate Control', href: '/security' },
      { icon: Users, label: 'Visitor Logs', href: '/security/logs' },
      { icon: Calendar, label: 'Check-ins', href: '/security/check-ins' },
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeMenuItems = menuItems[role] || menuItems.Resident;

  return (
    <div className="flex min-h-screen bg-dark-900 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-dark-800/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300 relative z-40",
        collapsed ? "w-24" : "w-72"
      )}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                Socio<span className="text-primary-400">Sphere</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          <p className={cn(
            "text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 px-4 transition-opacity",
            collapsed && "opacity-0"
          )}>
            Menu
          </p>
          {activeMenuItems.map((item, i) => (
            <SidebarLink 
              key={i} 
              {...item} 
              active={location.pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
           <SidebarLink 
            icon={Settings} 
            label="Settings" 
            href="#" 
            collapsed={collapsed}
          />
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors group",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white border-4 border-dark-900 shadow-xl"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
             <ChevronLeft className="w-4 h-4" />
          </motion.div>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-dark-800/30 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sm:px-10 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-400" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-sm w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-800"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none mb-1">{user?.name || 'User'}</p>
                <p className="text-[10px] font-medium text-primary-400 uppercase tracking-wider">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-dark-800 z-[51] lg:hidden flex flex-col"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-primary-500" />
                  <span className="text-xl font-bold text-white">SocioSphere</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-2 py-4">
                {activeMenuItems.map((item, i) => (
                  <SidebarLink 
                    key={i} 
                    {...item} 
                    active={location.pathname === item.href}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
