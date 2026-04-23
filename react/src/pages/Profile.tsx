import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Heart, 
  Activity, 
  Camera, 
  Settings, 
  Shield, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import NewsCard from '../components/NewsCard';
import VButton from '../components/VButton';
import VAvatar from '../components/VAvatar';
import { CategoryBadge, getCategoryInfo } from '../components/CategoryUI';

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
    email: localStorage.getItem('user_email') || '',
    phone: '',
    address: '',
    created_at: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const userAvatar = localStorage.getItem('user_avatar');
  const authToken = localStorage.getItem('auth_token');

  const sidebarItems = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'interests', name: 'Sở thích', icon: Heart },
  ];

  useEffect(() => {
    axios.get(`${API_BASE_URL}/modules/api/categories_get.php`)
      .then(res => { if (res.data.status === 'success') setApiCategories(res.data.data); })
      .catch(err => console.error('Lỗi fetch categories:', err));

    if (authToken) {
      setLoadingProfile(true);
      axios.get(`${API_BASE_URL}/modules/api/user.php?token=${authToken}`)
        .then(res => { 
          if (res.data.status === 'success') {
            const userData = res.data.data.profile;
            setProfile(userData);
            setSelectedInterests(res.data.data.interests);
            
            if (userData.fullname) localStorage.setItem('user_name', userData.fullname);
            if (userData.email) localStorage.setItem('user_email', userData.email);
            if (userData.avatar) localStorage.setItem('user_avatar', userData.avatar);
            if (userData.role) localStorage.setItem('user_role', userData.role);
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
      const res = await axios.post(`${API_BASE_URL}/modules/api/user.php`, {
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
      alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempAvatar(reader.result as string);
      setShowAvatarPreview(true);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = async () => {
    if (!tempAvatar || !authToken) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      const size = 400; 
      canvas.width = size;
      canvas.height = size;
      
      if (ctx) {
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
        ctx.clip();
        
        const drawWidth = img.width * zoom * (size / 300);
        const drawHeight = img.height * zoom * (size / 300);
        const drawX = (size / 2) + position.x * (size / 300) - (drawWidth / 2);
        const drawY = (size / 2) + position.y * (size / 300) - (drawHeight / 2);
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        const base64String = canvas.toDataURL('image/jpeg', 0.9);
        
        try {
          setSavingProfile(true);
          const res = await axios.post(`${API_BASE_URL}/modules/api/user.php`, {
            token: authToken,
            action: 'update_avatar',
            avatar_base64: base64String
          });
          if (res.data.status === 'success') {
            localStorage.setItem('user_avatar', res.data.avatar_url);
            setShowAvatarPreview(false);
            setTempAvatar(null);
            window.location.reload();
          } else {
            alert('Lỗi: ' + res.data.msg);
          }
        } catch (err) {
          console.error('Lỗi upload avatar:', err);
        } finally {
          setSavingProfile(false);
        }
      }
    };
    img.src = tempAvatar;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const fetchFavorites = useCallback(async () => {
    if (!authToken) return;
    try {
      setLoadingFavorites(true);
      const res = await axios.get(`${API_BASE_URL}/index.php`, {
        params: { 
          module: 'api',
          action: 'favorites',
          token: authToken, 
          action_type: 'list' 
        }
      });
      if (res.data.status === 'success') {
        setFavorites(res.data.data);
      }
    } catch (error) {
      console.error('Network Error fetching favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (mainTab === 'favorites') {
      fetchFavorites();
    }
  }, [mainTab, fetchFavorites]);

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  const handleSaveInterests = async () => {
    if (!authToken) { alert('Vui lòng đăng nhập để lưu sở thích'); return; }
    setLoadingInterests(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/modules/api/user.php`, {
        token: authToken,
        action: 'update_interests',
        interests: selectedInterests
      });
      if (response.data.status === 'success') alert('Sở thích của bạn đã được cập nhật!');
      else alert('Lỗi: ' + response.data.msg);
    } catch (error) {
      console.error('Lỗi save interests:', error);
      alert('Không thể lưu sở thích. Vui lòng thử lại sau.');
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
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-black text-slate-900">Thông tin cá nhân</h3>
                        {localStorage.getItem('user_role') === 'admin' && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full">
                            <Shield size={12} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Quản trị viên</span>
                          </div>
                        )}
                      </div>
                      {savingProfile && (
                         <div className="flex items-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                            <Activity size={14} /> ĐANG LƯU...
                         </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                      <div className="relative group">
                        <VAvatar src={userAvatar} name={profile.fullname} size="xl" className="group-hover:scale-[1.02] transition-transform" />
                        <label className="absolute bottom-1 right-1 w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-blue-700 hover:scale-110 transition-all active:scale-95 border-2 border-white">
                            <Camera size={18} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>

                        <AnimatePresence>
                          {showAvatarPreview && (
                            <motion.div 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
                            >
                              <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-[3rem] p-10 max-w-lg w-full text-center space-y-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)]"
                              >
                                <div className="space-y-1">
                                  <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Chỉnh sửa ảnh</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kéo để di chuyển • Trượt để phóng to</p>
                                </div>

                                <div 
                                  className="relative w-64 h-64 mx-auto bg-slate-50 rounded-[2rem] overflow-hidden cursor-move select-none border-2 border-slate-100"
                                  onMouseDown={handleMouseDown}
                                  onMouseMove={handleMouseMove}
                                  onMouseUp={handleMouseUp}
                                  onMouseLeave={handleMouseUp}
                                  style={{
                                    backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                  }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full border-2 border-blue-600/50 shadow-[0_0_0_9999px_rgba(255,255,255,0.8)] z-10 pointer-events-none"></div>
                                    <img 
                                      src={tempAvatar!} 
                                      alt="Preview" 
                                      className="absolute pointer-events-none transition-transform duration-75"
                                      style={{
                                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                                        maxWidth: 'none',
                                        width: '100%'
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center gap-4 px-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Thu</span>
                                    <input 
                                      type="range" min="0.5" max="3" step="0.1" 
                                      value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                                      className="flex-1 accent-blue-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Phóng</span>
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                    <button 
                                      onClick={() => { setShowAvatarPreview(false); setTempAvatar(null); }}
                                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                                    >
                                      Hủy bỏ
                                    </button>
                                    <button 
                                      onClick={handleSaveAvatar}
                                      disabled={savingProfile}
                                      className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                    >
                                      {savingProfile ? 'Đang lưu...' : 'Xác nhận thay đổi'}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">ĐỊA CHỈ EMAIL</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2 break-all">{profile.email}</p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">SỐ ĐIỆN THOẠI</p>
                                <p className={`text-lg border-b border-slate-50 pb-2 ${profile.phone ? 'font-bold text-slate-900' : 'font-medium text-slate-400 italic'}`}>
                                  {profile.phone || 'Chưa cập nhật'}
                                </p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">ĐỊA CHỈ</p>
                                <p className={`text-lg border-b border-slate-50 pb-2 ${profile.address ? 'font-bold text-slate-900' : 'font-medium text-slate-400 italic'}`}>
                                  {profile.address || 'Chưa cập nhật'}
                                </p>
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">NGÀY THAM GIA</p>
                                <p className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-2">
                                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa rõ'}
                                </p>
                              </div>
                            </div>
                            <div className="pt-8 flex justify-end">
                              <VButton 
                                variant="dark" icon={Settings} 
                                onClick={() => setIsEditing(true)}
                              >
                                Chỉnh sửa hồ sơ
                              </VButton>
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
                              <VButton variant="outline" onClick={() => setIsEditing(false)}>Hủy</VButton>
                              <VButton 
                                type="submit" variant="primary" 
                                loading={savingProfile} icon={Shield}
                              >
                                Lưu thay đổi
                              </VButton>
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
                        const { icon: CatIcon, color, label } = getCategoryInfo(name);
                        return (
                          <button key={name} onClick={() => toggleInterest(name)} className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100' : 'border-slate-50 bg-slate-50/20 hover:border-slate-100 hover:bg-slate-50/50'}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shrink-0`}><CatIcon size={24} /></div>
                            <div className="text-left">
                              <p className={`text-sm font-black tracking-widest ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>{label}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{isSelected ? 'Đang quan tâm' : 'Nhấn để chọn'}</p>
                            </div>
                            {isSelected && <div className="ml-auto text-blue-600"><CheckCircle size={20} /></div>}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-16 pt-12 border-t border-slate-50 flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-400">Đã chọn {selectedInterests.length} chuyên mục</p>
                      <VButton 
                        variant="primary" loading={loadingInterests}
                        onClick={handleSaveInterests}
                      >
                        Lưu sở thích
                      </VButton>
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
