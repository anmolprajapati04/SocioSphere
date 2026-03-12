import { useAuth } from '../context/AuthContext.jsx';
import { LogOut, Bell, Shield, User as UserIcon, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, societyName, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40"
    >
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-primary-900 tracking-tighter">SocioSphere</h1>
            <div className="w-1.5 h-1.5 rounded-full bg-elegant-gold animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{societyName || 'Royal Palms Estate'}</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 pr-8 border-r border-slate-100">
          <button className="relative group text-slate-400 hover:text-primary-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-elegant-gold rounded-full border-2 border-white" />
          </button>
          <button className="text-slate-400 hover:text-primary-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-primary-900 tracking-tight">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] font-bold text-elegant-gold uppercase tracking-widest">{user?.role || 'Executive'}</span>
          </div>
          <div className="w-12 h-12 bg-primary-900 rounded-xl flex items-center justify-center text-elegant-gold font-black shadow-lg">
            {initials || <UserIcon className="w-5 h-5" />}
          </div>
          <button 
            onClick={logout}
            className="w-12 h-12 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-all duration-300 group ml-2"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

