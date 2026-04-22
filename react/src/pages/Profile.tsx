import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Lock, Camera, Clock, Bookmark, 
  ChevronRight, Settings, Trash2, Shield, CreditCard,
  LayoutGrid, Activity, Calendar, ExternalLink, CheckCircle,
  Heart, Newspaper, Gavel, MapPin, Globe, PlayCircle, Star, Mic2,
  FileText, Briefcase, Zap, HeartPulse, Palette, FlaskConical, Languages,
  GraduationCap, Coffee, Trophy, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import NewsCard from '../components/NewsCard';

const Profile = () => {
  const [mainTab, setMainTab] = useState<'profile' | 'favorites'>('profile');
  const [subTab, setSubTab] = useState('personal');
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  
  const [profile, setProfile] = useState({
    fullname: localStorage.getItem('user_name') || '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  const userAvatar = localStorage.getItem('user_avatar');
  const authToken = localStorage.getItem('auth_token');

  const sidebarItems = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'interests', name: 'Sở thích', icon: Heart },
  ];

  // Map icons to category names
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase().replace(/-/g, ' '); 
    if (lower.includes('thời sự') || lower.includes('thoi su')) return { icon: Newspaper, color: 'bg-emerald-50 text-emerald-600' };
    if (lower.includes('pháp luật') || lower.includes('phap luat')) return { icon: Gavel, color: 'bg-amber-50 text-amber-600' };
    if (lower.includes('trong nước') || lower.includes('trong nuoc')) return { icon: MapPin, color: 'bg-blue-50 text-blue-600' };
    if (lower.includes('thế giới') || lower.includes('the gioi')) return { icon: Globe, color: 'bg-purple-50 text-purple-600' };
    if (lower.includes('giải trí') || lower.includes('giai tri')) return { icon: PlayCircle, color: 'bg-pink-50 text-pink-600' };
    if (lower.includes('showbit') || lower.includes('ngôi sao')) return { icon: Star, color: 'bg-rose-50 text-rose-600' };
    if (lower.includes('ca sỹ') || lower.includes('ca sy')) return { icon: Mic2, color: 'bg-indigo-50 text-indigo-600' };
    if (lower.includes('kinh tế') || lower.includes('kinh doanh')) return { icon: Briefcase, color: 'bg-cyan-50 text-cyan-600' };
    if (lower.includes('công nghệ') || lower.includes('cong nghe')) return { icon: Zap, color: 'bg-yellow-50 text-yellow-600' };
    if (lower.includes('sức khỏe') || lower.includes('suc khoe')) return { icon: HeartPulse, color: 'bg-red-50 text-red-600' };
    if (lower.includes('văn hóa') || lower.includes('van hoa')) return { icon: Palette, color: 'bg-orange-50 text-orange-600' };
    if (lower.includes('khoa học') || lower.includes('khoa hoc')) return { icon: FlaskConical, color: 'bg-teal-50 text-teal-600' };
    if (lower.includes('giáo dục') || lower.includes('giao duc')) return { icon: GraduationCap, color: 'bg-violet-50 text-violet-600' };
    if (lower.includes('đời sống') || lower.includes('doi song')) return { icon: Coffee, color: 'bg-stone-50 text-stone-600' };
    if (lower.includes('thể thao') || lower.includes('the thao')) return { icon: Trophy, color: 'bg-orange-50 text-orange-600' };
    return { icon: FileText, color: 'bg-slate-50 text-slate-600' };
  };

  const formatCategoryName = (name: string) => {
    const mapping: { [key: string]: string } = {
      'GIAO-DUC': 'Giáo dục', 'THE-GIOI': 'Thế giới', 'THOI-SU': 'Thời sự',
      'PHAP-LUAT': 'Pháp luật', 'KINH-DOANH': 'Kinh doanh', 'DOI-SONG': 'Đời sống',
      'THE-THAO': 'Thể thao', 'SUC-KHOE': 'Sức khỏe', 'GIAI-TRI': 'Giải trí',
      'CONG-NGHE': 'Công nghệ', 'TIN-TRONG-NUOC': 'Tin trong nước', 'SHOW-BIT': 'Showbit', 'CA-SY': 'Ca sỹ',
    };
    return mapping[name.toUpperCase()] || name;
  };

  useEffect(() => {
    const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
    
    // 1. Fetch fixed categories (can be cached or merged later)
    axios.get(`${host}/BE/modules/api/categories_get.php`)
      .then(res => { if (res.data.status === 'success') setApiCategories(res.data.data); })
      .catch(err => console.error('Lỗi fetch categories:', err));

    // 2. Consolidated call for Profile and Interests
    if (authToken) {
      setLoadingProfile(true);
      axios.get(`${host}/BE/modules/api/user.php?token=${authToken}`)
        .then(res => { 
          if (res.data.status === 'success') {
            setProfile(res.data.data.profile);
            setSelectedInterests(res.data.data.interests);
          }
        })
        .catch(err => console.error('Lỗi fetch user data:', err))
        .finally(() => setLoadingProfile(false));
    }
  }, [authToken]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    setSavingProfile(true);
    try {
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const res = await axios.post(`${host}/BE/modules/api/user.php`, {
        token: authToken,
        action: 'update_profile',
        ...profile
      });
      if (res.data.status === 'success') {
        alert('Cập nhật hồ sơ thành công!');
        localStorage.setItem('user_name', profile.fullname);
        setIsEditing(false);
      } else {
        alert('Lỗi: ' + res.data.msg);
      }
    } catch (err) {
      console.error('Lỗi update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const fetchFavorites = async () => {
    if (!authToken) return;
    try {
      setLoadingFavorites(true);
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const res = await axios.get(`${host}/BE/modules/api/favorites.php`, {
        params: { token: authToken, action: 'list' }
      });
      if (res.data.status === 'success') {
        setFavorites(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'favorites') {
      fetchFavorites();
    }
  }, [mainTab, authToken]);

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  const handleSaveInterests = async () => {
    if (!authToken) { alert('Vui lòng đăng nhập để lưu sở thích'); return; }
    setLoadingInterests(true);
    try {
      const host = window.location.hostname === 'localhost' ? API_BASE_URL.replace('/BE', '') : '';
      const response = await axios.post(`${host}/BE/modules/api/user.php`, {
        token: authToken,
        action: 'update_interests',
        interests: selectedInterests
      });
      if (response.data.status === 'success') alert('Sở thích của bạn đã được cập nhật!');
      else alert('Lỗi: ' + response.data.msg);
    } catch (error) {
      console.error('Lỗi save interests:', error);
    } finally {
      setLoadingInterests(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9FC] pb-20">
      <div className="bg-white border-b border-slate-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-12">
            {[
              { id: 'profile', name: 'Hồ sơ' },
              { id: 'favorites', name: 'Bài viết yêu thích' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id as any)}
                className={`relative py-6 text-sm font-black uppercase tracking-widest transition-all ${
                  mainTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.name}
                {mainTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <AnimatePresence mode="wait">
          {mainTab === 'profile' ? (
            <motion.div 
              key="profile-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col lg:flex-row gap-12"
            >
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-2">
                  <div className="px-4 py-2 mb-4">
                    <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-4 mb-2">CÀI ĐẶT</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{profile.fullname || 'Người dùng'}</p>
                  </div>
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSubTab(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-xs font-bold transition-all ${
                        subTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={18} /> {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {subTab === 'personal' ? (
                  <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-12">
                      <h3 className="text-xl font-black text-slate-900">Thông tin cá nhân</h3>
                      {savingProfile && (
                         <div className="flex items-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                            <Activity size={14} /> ĐANG LƯU...
                         </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                      <div className="relative">
                        <div className="w-40 h-40 rounded-full border-8 border-slate-50 overflow-hidden shadow-xl bg-slate-100">
                          {userAvatar ? (
                            <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.fullname || 'Vertex'}`} alt="Avatar" className="w-full h-full object-cover" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-10 w-full">
                        {loadingProfile ? (
                          <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải hồ sơ...</p>
                          </div>
                        ) : !isEditing ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">HỌ VÀ TÊN</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">{profile.fullname || 'Người dùng'}</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ĐỊA CHỈ EMAIL</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2 break-all">{profile.email}</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">SỐ ĐIỆN THOẠI</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">{profile.phone || 'Chưa cập nhật'}</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">ĐỊA CHỈ</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">{profile.address || 'Chưa cập nhật'}</p>
                              </div>
                            </div>
                            <div className="pt-8 flex justify-end">
                              <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-3">
                                <Settings size={16} /> Chỉnh sửa hồ sơ
                              </button>
                            </div>
                          </>
                        ) : (
                          <form onSubmit={handleUpdateProfile} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">HỌ VÀ TÊN</label>
                                <input type="text" value={profile.fullname} onChange={e => setProfile({...profile, fullname: e.target.value})} placeholder="Nhập họ và tên..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ĐỊA CHỈ EMAIL (Read-only)</label>
                                <input type="email" value={profile.email} disabled className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 cursor-not-allowed outline-none" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">SỐ ĐIỆN THOẠI</label>
                                <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Nhập số điện thoại..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none" />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">ĐỊA CHỈ</label>
                                <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Nhập địa chỉ của bạn..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all outline-none" />
                              </div>
                            </div>
                            <div className="pt-8 flex justify-end gap-4">
                              <button type="button" onClick={() => setIsEditing(false)} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">Hủy</button>
                              <button type="submit" disabled={savingProfile} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 flex items-center gap-3">
                                <Shield size={16} /> {savingProfile ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm">
                    <div className="mb-12">
                      <h3 className="text-xl font-black text-slate-900 mb-2">Sở thích của bạn</h3>
                      <p className="text-sm font-medium text-slate-400">Chọn các chủ đề bạn quan tâm để chúng tôi đề xuất tin tức phù hợp.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {apiCategories.map((name) => {
                        const isSelected = selectedInterests.includes(name);
                        const { icon: CatIcon, color } = getCategoryIcon(name);
                        return (
                          <button key={name} onClick={() => toggleInterest(name)} className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100' : 'border-slate-50 bg-slate-50/20 hover:border-slate-100 hover:bg-slate-50/50'}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shrink-0`}><CatIcon size={24} /></div>
                            <div className="text-left">
                              <p className={`text-sm font-black tracking-widest ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>{formatCategoryName(name)}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{isSelected ? 'Đang quan tâm' : 'Nhấn để chọn'}</p>
                            </div>
                            {isSelected && <div className="ml-auto text-blue-600"><CheckCircle size={20} /></div>}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-16 pt-12 border-t border-slate-50 flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-400">Đã chọn {selectedInterests.length} chuyên mục</p>
                      <button onClick={handleSaveInterests} disabled={loadingInterests} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50">
                        {loadingInterests ? 'Đang lưu...' : 'Lưu sở thích'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="favorites-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="mb-12">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">BỘ SƯU TẬP</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Bài viết yêu thích</h1>
              </header>

              {loadingFavorites ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đang tải danh sách...</p>
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favorites.map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-200 text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <Heart size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 font-inter uppercase tracking-tighter">Danh sách trống</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hãy thả tim cho các bài báo bạn thích!</p>
                  </div>
                  <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                    Khám phá tin tức ngay
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
