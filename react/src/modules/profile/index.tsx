import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Heart, CheckCircle, Loader2, Newspaper, Heart as HeartIcon, Crown, Clock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';
import NewsCard, { NewsItem } from '../news/components/NewsCard';
import VButton from '../../components/core/VButton';
import { getCategoryInfo } from '../news/components/CategoryUI';
import ProfileInfo from '../profile/components/ProfileInfo';
import UpgradeVIP from '../profile/components/UpgradeVIP';

const Profile = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const [subTab, setSubTab] = useState(location.state?.subTab || 'personal');

  useEffect(() => {
    if (location.state?.subTab) {
      setSubTab(location.state.subTab);
    }
  }, [location.state]);
  const authToken = localStorage.getItem('auth_token');
  const userName = localStorage.getItem('user_name');

  const [loadingInterests, setLoadingInterests] = useState(false);
  const [apiCategories, setApiCategories] = useState<any[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const sidebarItems = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: User },
    { id: 'favorites', name: 'Bài viết yêu thích', icon: HeartIcon },
    { id: 'interests', name: 'Sở thích', icon: Heart },
    { id: 'history', name: 'Lịch sử đọc', icon: Clock },
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
        const favNews = res.data.data.map((item: any) => ({
          ...item,
          is_favourite: true
        }));
        setFavorites(favNews);
      }
    } catch (error) {
      console.error('Network Error fetching favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  }, [authToken]);

  const fetchHistory = useCallback(async () => {
    if (!authToken) return;
    try {
      setLoadingHistory(true);
      const res = await axios.get(`${API_BASE_URL}/modules/api/history_get.php`, {
        params: { token: authToken }
      });
      if (res.data.status === 'success') {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (subTab === 'favorites') {
      fetchFavorites();
    } else if (subTab === 'history') {
      fetchHistory();
    }
  }, [subTab, fetchFavorites, fetchHistory]);

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
      <div className="max-w-7xl mx-auto px-6 mt-8 pb-20">
        <AnimatePresence mode="wait">
            <motion.div 
              key="profile-section"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-2">
                  <div className="px-4 py-2 mb-4">
                    <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-4 mb-2">CÀI ĐẶT</p>
                  </div>
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSubTab(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all border-2 ${
                        subTab === item.id 
                          ? 'bg-blue-50/50 border-blue-600 text-blue-600 shadow-sm' 
                          : 'border-transparent text-slate-500 hover:bg-slate-50'
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
                ) : subTab === 'favorites' ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm">
                    <div className="mb-12">
                      <h3 className="text-xl font-black text-slate-900 mb-2">Bài viết đã lưu</h3>
                      <p className="text-sm font-medium text-slate-400">Danh sách các bài báo bạn đã thả tim và lưu lại.</p>
                    </div>

                    {loadingFavorites ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải...</p>
                      </div>
                    ) : favorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.map((item) => (
                          <NewsCard key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 rounded-[2rem] p-16 border-2 border-dashed border-slate-100 text-center space-y-4">
                        <HeartIcon size={32} className="mx-auto text-slate-200" />
                        <p className="text-sm font-bold text-slate-400">Danh sách yêu thích trống</p>
                      </div>
                    )}
                  </motion.div>
                ) : subTab === 'history' ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm">
                    <div className="mb-12">
                      <h3 className="text-xl font-black text-slate-900 mb-2">Lịch sử đã xem</h3>
                      <p className="text-sm font-medium text-slate-400">Danh sách các bài báo bạn đã xem gần đây.</p>
                    </div>

                    {loadingHistory ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải...</p>
                      </div>
                    ) : history.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {history.map((item) => (
                          <NewsCard key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 rounded-[2rem] p-16 border-2 border-dashed border-slate-100 text-center space-y-4">
                        <Clock size={32} className="mx-auto text-slate-200" />
                        <p className="text-sm font-bold text-slate-400">Chưa có lịch sử đọc</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm">
                    <div className="mb-12">
                      <h3 className="text-xl font-black text-slate-900 mb-2">Chủ đề quan tâm</h3>
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
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
