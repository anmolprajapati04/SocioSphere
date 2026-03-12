import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-elegant-gold transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-slate-900 placeholder:text-slate-400 font-medium",
            "focus:outline-none focus:ring-2 focus:ring-elegant-gold/20 focus:border-elegant-gold transition-all duration-300 shadow-sm",
            Icon ? "pl-12 pr-4" : "px-4",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 ml-1 mt-1 font-medium italic">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
