import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, className, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    outline: 'bg-transparent text-slate-400 border-white/10',
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
