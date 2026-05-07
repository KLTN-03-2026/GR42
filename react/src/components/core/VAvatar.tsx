import React, { useState } from 'react';

interface VAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isVip?: boolean;
}

const VAvatar: React.FC<VAvatarProps> = ({ src, name = 'V', size = 'md', className = '', isVip = false }) => {
  const [error, setError] = useState(false);
  const sizeStyles = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-40 h-40 text-4xl'
  };

  const defaultAvatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  const renderImage = () => {
    if (!src) return null;
    const isAbsolute = src.startsWith('http') || src.startsWith('data:');
    const fullSrc = isAbsolute ? src : `${src.startsWith('/') ? '' : '/'}${src}`;
    
    return (
      <img 
        src={isAbsolute ? src : `${fullSrc}${fullSrc.includes('?') ? '&' : '?'}t=${new Date().getTime()}`} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div className={`relative ${sizeStyles[size]} ${className} flex-shrink-0 flex items-center justify-center`}>
      <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border-2 border-slate-50 shadow-sm relative z-10`}>
        {(src && !error) ? renderImage() : (
          <img 
            src={defaultAvatar}
            alt={name}
            className="w-full h-full object-cover opacity-80"
          />
        )}
      </div>
      {isVip && (
        <>
          <div className="absolute inset-[-6px] rounded-full bg-gradient-to-tr from-amber-200 via-amber-500 to-amber-200 animate-spin-slow opacity-80 z-0"></div>
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-lg z-20 border border-white uppercase tracking-tighter">VIP</div>
        </>
      )}
    </div>
  );
};

export default VAvatar;
