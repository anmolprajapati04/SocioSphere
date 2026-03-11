import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-400 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all",
          error && "border-red-500 focus:ring-red-500/50 focus:border-red-500/50",
          className
        )}
        {...props}
      />
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
