import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface VButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconSize?: number;
  loading?: boolean;
  fullWidth?: boolean;
}

const VButton: React.FC<VButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconSize,
  loading,
  fullWidth,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 rounded-2xl gap-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100',
    secondary: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    outline: 'bg-transparent border-2 border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-600',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-8 py-4 text-xs',
    lg: 'px-12 py-5 text-sm'
  };

  const paddingClass = className.match(/p[xy]?-\d+/)?.[0] || '';
  const sizeClasses = paddingClass ? '' : sizes[size];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizeClasses} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />
      ) : Icon && (
        <Icon size={iconSize || (size === 'sm' ? 16 : size === 'lg' ? 24 : 18)} />
      )}
      {children}
    </motion.button>
  );
};

export default VButton;
