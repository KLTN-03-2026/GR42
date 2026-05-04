import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, CheckCircle, Loader2, Newspaper, Heart as HeartIcon, Crown } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import NewsCard, { NewsItem } from '../components/NewsCard';
import VButton from '../components/VButton';
import { getCategoryInfo } from '../components/CategoryUI';
import ProfileInfo from '../components/ProfileInfo';
import UpgradeVIP from '../components/UpgradeVIP';

const Profile = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const [mainTab, setMainTab] = useState<'profile' | 'favorites'>('profile');
  const [subTab, setSubTab] = useState('personal');
  const authToken = localStorage.getItem('auth_token');
  const userName = localStorage.getItem('user_name');

  const [loadingInterests, setLoadingInterests] = useState(false);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const sidebarItems = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'interests', name: 'Sở thích', icon: Heart },
    { id: 'upgrade', name: 'Nâng cấp VIP', icon: Crown },
  ];

  useEffect(() => {
    
    axios.get(`${API_BASE_URL}/modules/api/categories_get.php`)
      .then(res => { if (res.data.status === 'success') setApiCategories(res.data.data); })
      .catch(err => console.error('Lỗi fetch categories:', err));

    if (authToken) {
      
      axios.get(`${API_BASE_URL}/modules/api/user.php?token=${authToken}`)
        .then(res => { 
          if (res.data.status === 'success') {
            setSelectedInterests(res.data.data.interests);
            setUserData(res.data.data.profile);
          }
        })
        .catch(err => console.error('Lỗi fetch user data:', err));
    }
  }, [authToken]);

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
    } finally {
      setLoadingInterests(false);
    }
  };

  return (
    <div className={`${isAdminPath ? '' : 'min-h-screen bg-[#F9F9FC] pb-20'}`}>
      <div className={`bg-white border-b border-slate-100 sticky ${isAdminPath ? 'top-16' : 'top-20'} z-40`}>
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{userName || 'Người dùng'}</p>
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

              <div className="flex-1">
                {subTab === 'personal' ? (
                  <ProfileInfo authToken={authToken} />
                ) : subTab === 'upgrade' ? (
                  <UpgradeVIP authToken={authToken} userData={userData} />
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
                    <HeartIcon size={40} />
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
