import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Sun, Loader2, ChevronDown, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { API_BASE_URL } from '../../constants/config';

const VIETNAM_CITIES = [
  { id: 'Hanoi', name: 'Hà Nội' },
  { id: 'Ho Chi Minh City', name: 'Hồ Chí Minh' },
  { id: 'Da Nang', name: 'Đà Nẵng' },
  { id: 'Hai Phong', name: 'Hải Phòng' },
  { id: 'Can Tho', name: 'Cần Thơ' },
  { id: 'Hue', name: 'Huế' },
  { id: 'Nha Trang', name: 'Nha Trang' },
  { id: 'Da Lat', name: 'Đà Lạt' },
  { id: 'Quang Ninh', name: 'Quảng Ninh' }
];

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchWeatherByCity = async (cityId: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/index.php`, {
        params: { module: 'api', action: 'weather', q: cityId }
      });
      if (res.data && res.data.status === 'success') {
        setWeather(res.data.data);
      } else {
        console.warn('Weather API returned non-success status:', res.data);
      }
    } catch (error) {
      console.error('Error fetching weather by city:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/index.php`, {
        params: { module: 'api', action: 'weather', lat: lat, lon: lon }
      });
      if (res.data && res.data.status === 'success') {
        setWeather(res.data.data);
      } else {
        console.warn('Weather API returned non-success status:', res.data);
      }
    } catch (error) {
      console.error('Error fetching weather by coords:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem('user_weather_city');
    if (savedCity) {
      fetchWeatherByCity(savedCity);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherByCity('Hanoi');
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeatherByCity('Hanoi');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (cityId: string) => {
    localStorage.setItem('user_weather_city', cityId);
    setShowDropdown(false);
    fetchWeatherByCity(cityId);
  };

  const handleUseLocation = () => {
    setShowDropdown(false);
    localStorage.removeItem('user_weather_city');
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép trình duyệt truy cập vị trí.');
          setLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d': return <Sun size={20} className="text-amber-500" />;
      case '01n': return <Moon size={20} className="text-blue-300" />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n': return <Cloud size={20} className="text-slate-400" />;
      case '09d':
      case '09n': return <CloudDrizzle size={20} className="text-blue-400" />;
      case '10d':
      case '10n': return <CloudRain size={20} className="text-blue-500" />;
      case '11d':
      case '11n': return <CloudLightning size={20} className="text-purple-500" />;
      case '13d':
      case '13n': return <CloudSnow size={20} className="text-blue-200" />;
      case '50d':
      case '50n': return <CloudFog size={20} className="text-slate-400" />;
      default: return <Sun size={20} className="text-amber-500" />;
    }
  };

  if (loading && !weather) {
    return (
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-100">
        <Loader2 size={16} className="animate-spin text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400">Thời tiết</span>
      </div>
    );
  }

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-2 rounded-2xl border ${showDropdown ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100'} group`}
      >
        {loading ? <Loader2 size={20} className="animate-spin text-blue-500" /> : getWeatherIcon(weather?.weather?.[0]?.icon || '01d')}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
              {!weather ? 'Thời tiết' : (weather.name === 'Tỉnh Ðà Nẵng' || weather.name === 'Da Nang' ? 'Đà Nẵng' : weather.name)}
            </span>
            <ChevronDown size={10} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180 text-blue-500' : ''}`} />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-bold text-blue-600">{weather?.main ? Math.round(weather.main.temp) : '--'}°C</span>
            <span className="text-[9px] text-slate-400 font-bold capitalize truncate max-w-[80px]">• {weather?.weather?.[0]?.description || 'Đang tải...'}</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Chọn khu vực</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5">
              <button
                onClick={handleUseLocation}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-xl transition-colors text-left group"
              >
                <MapPin size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">Vị trí hiện tại của bạn</span>
              </button>

              <div className="h-px bg-slate-100 my-1 mx-2"></div>

              {VIETNAM_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.id)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-xs font-bold text-slate-700 hover:text-slate-900"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherWidget;
