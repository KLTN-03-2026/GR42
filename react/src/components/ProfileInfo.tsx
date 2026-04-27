import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Camera, 
  Shield, 
  Activity, 
  Settings 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import VButton from './VButton';
import VAvatar from './VAvatar';

interface ProfileInfoProps {
  authToken: string | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ authToken }) => {
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

  useEffect(() => {
    if (authToken) {
      setLoadingProfile(true);
      axios.get(`${API_BASE_URL}/index.php`, {
        params: {
          module: 'api',
          action: 'user',
          token: authToken
        }
      })
        .then(res => { 
          if (res.data.status === 'success') {
            const userData = res.data.data.profile;
            setProfile(userData);
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
      const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=user&token=${authToken}`, {
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
          const res = await axios.post(`${API_BASE_URL}/index.php?module=api&action=user&token=${authToken}`, {
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
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-900">Thông tin cá nhân</h3>
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
                    {profile.created_at && profile.created_at !== '0000-00-00 00:00:00' 
                      ? new Date(profile.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                      : 'Đang cập nhật...'}
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
  );
};

export default ProfileInfo;
