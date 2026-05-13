import React from 'react';
import { Loader2 } from 'lucide-react';

const ActionButton = ({ children, isLoading, variant = 'primary', className = '', ...props }) => {
  const base = 'sp-ripple inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-black hover:scale-105',
    ghost: 'border border-white/10 hover:border-white/30',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-black'
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
};

export default ActionButton;
