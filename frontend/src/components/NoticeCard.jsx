import React from 'react';
import { Bell, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const NoticeCard = ({ title, message, createdAt }) => {
  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-elegant-gold/10 rounded-2xl flex items-center justify-center text-elegant-gold group-hover:bg-elegant-gold group-hover:text-white transition-all duration-300">
          <Bell className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-black text-primary-900 tracking-tight uppercase italic group-hover:text-gold-500 transition-colors">
            {title}
          </h4>
          <p className="text-slate-600 font-medium text-sm leading-relaxed mt-2">
            {message}
          </p>
          <div className="flex items-center gap-4 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeCard;
