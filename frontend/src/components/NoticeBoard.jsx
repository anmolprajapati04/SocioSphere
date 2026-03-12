import React from 'react';
import NoticeCard from './NoticeCard';
import { Bell } from 'lucide-react';

const NoticeBoard = ({ notices, loading }) => {
  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Broadcasts...</p>
      </div>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-6 border border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
        <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
          <Bell className="w-10 h-10" />
        </div>
        <div>
          <h4 className="text-primary-900 font-black uppercase italic tracking-tighter text-xl">Quiet Skies</h4>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">No active broadcasts detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-luxury">
      {notices.map((notice) => (
        <NoticeCard 
          key={notice.id} 
          title={notice.title} 
          message={notice.content || notice.message} 
          createdAt={notice.createdAt} 
        />
      ))}
    </div>
  );
};

export default NoticeBoard;
