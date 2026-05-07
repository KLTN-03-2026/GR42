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
    <div className={`rounded-full overflow-hidden flex items-center justify-center bg-slate-100 flex-shrink-0 border border-slate-50 shadow-sm ${sizeStyles[size]} ${className}`}>
      {(src && !error) ? renderImage() : (
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
