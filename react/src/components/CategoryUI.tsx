import React from 'react';
import { 
  Newspaper, Gavel, MapPin, Globe, PlayCircle, Star, Mic2,
  Briefcase, Zap, HeartPulse, Palette, FlaskConical, Languages,
  GraduationCap, Coffee, Trophy, FileText, LucideIcon
} from 'lucide-react';

interface CategoryIconInfo {
  icon: LucideIcon;
  color: string;
  label: string;
}

const categoryConfig: { [key: string]: CategoryIconInfo } = {
  'THOI-SU': { icon: Newspaper, color: 'bg-emerald-50 text-emerald-600', label: 'Thời sự' },
  'PHAP-LUAT': { icon: Gavel, color: 'bg-amber-50 text-amber-600', label: 'Pháp luật' },
  'TIN-TRONG-NUOC': { icon: MapPin, color: 'bg-blue-50 text-blue-600', label: 'Trong nước' },
  'THE-GIOI': { icon: Globe, color: 'bg-purple-50 text-purple-600', label: 'Thế giới' },
  'GIAI-TRI': { icon: PlayCircle, color: 'bg-pink-50 text-pink-600', label: 'Giải trí' },
  'SHOW-BIT': { icon: Star, color: 'bg-rose-50 text-rose-600', label: 'Showbit' },
  'CA-SY': { icon: Mic2, color: 'bg-indigo-50 text-indigo-600', label: 'Ca sỹ' },
  'KINH-DOANH': { icon: Briefcase, color: 'bg-cyan-50 text-cyan-600', label: 'Kinh doanh' },
  'CONG-NGHE': { icon: Zap, color: 'bg-yellow-50 text-yellow-600', label: 'Công nghệ' },
  'SUC-KHOE': { icon: HeartPulse, color: 'bg-red-50 text-red-600', label: 'Sức khỏe' },
  'VAN-HOA': { icon: Palette, color: 'bg-orange-50 text-orange-600', label: 'Văn hóa' },
  'KHOA-HOC': { icon: FlaskConical, color: 'bg-teal-50 text-teal-600', label: 'Khoa học' },
  'GIAO-DUC': { icon: GraduationCap, color: 'bg-violet-50 text-violet-600', label: 'Giáo dục' },
  'DOI-SONG': { icon: Coffee, color: 'bg-stone-50 text-stone-600', label: 'Đời sống' },
  'THE-THAO': { icon: Trophy, color: 'bg-orange-50 text-orange-600', label: 'Thể thao' },
};

export const getCategoryInfo = (name: string): CategoryIconInfo => {
  const key = name.toUpperCase().replace(/\s+/g, '-');
  return categoryConfig[key] || { icon: FileText, color: 'bg-slate-50 text-slate-600', label: name };
};

interface CategoryBadgeProps {
  name: string;
  showIcon?: boolean;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, showIcon = true, className = '' }) => {
  const { icon: Icon, color, label } = getCategoryInfo(name);
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${color} ${className}`}>
      {showIcon && <Icon size={12} />}
      {label}
    </div>
  );
};
