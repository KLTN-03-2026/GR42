import React, { useState } from 'react';

interface VAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const VAvatar: React.FC<VAvatarProps> = ({ src, name = 'V', size = 'md', className = '' }) => {
  const [error, setError] = useState(false);
  const sizeStyles = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-40 h-40 text-4xl'
  };

  const initial = name.charAt(0).toUpperCase();
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F1F5F9&color=2563EB&bold=true`;

  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center bg-slate-100 flex-shrink-0 border border-slate-50 shadow-sm ${sizeStyles[size]} ${className}`}>
      {(src && !error) ? (
        <img 
          src={src.startsWith('data:') ? src : `${src}${src.includes('?') ? '&' : '?'}t=${new Date().getTime()}`} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <img 
          src={defaultAvatar}
          alt={name}
          className="w-full h-full object-cover opacity-80"
        />
      )}
    </div>
  );
};

export default VAvatar;
