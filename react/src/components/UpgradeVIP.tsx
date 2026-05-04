import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, Activity } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import VButton from './VButton';

interface UpgradeVIPProps {
  userData: any;
  authToken: string | null;
}

const UpgradeVIP: React.FC<UpgradeVIPProps> = ({ userData, authToken }) => {
  const [isVip, setIsVip] = useState(userData?.is_vip === 1);
  const [checking, setChecking] = useState(false);

  // Constants for payment
  const BANK_NAME = 'MB BANK';
  const ACCOUNT_NAME = 'PHAN THE TAI';
  const ACCOUNT_NUMBER = '0935058232';
  const AMOUNT = 30000;
  const TRANSFER_CONTENT = `VIP ${userData?.id || ''}`;

  // VietQR generation
  const qrUrl = `https://img.vietqr.io/image/mbbank-${ACCOUNT_NUMBER}-compact2.png?amount=${AMOUNT}&addInfo=${encodeURIComponent(TRANSFER_CONTENT)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  useEffect(() => {
    setIsVip(userData?.is_vip === 1);
  }, [userData]);

  const handleCheckStatus = async () => {
    if (!authToken) return;
    setChecking(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/modules/api/user.php?token=${authToken}`);
      if (res.data.status === 'success') {
        const updatedIsVip = res.data.data.profile.is_vip === 1;
        setIsVip(updatedIsVip);
        if (updatedIsVip) {
          alert('Chúc mừng! Tài khoản của bạn đã được nâng cấp lên VIP thành công.');
        } else {
          alert('Chưa nhận được thanh toán hoặc giao dịch đang được xử lý. Vui lòng thử lại sau ít phút.');
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái:', error);
    } finally {
      setChecking(false);
    }
  };

  if (isVip) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200">
          <Crown size={48} className="text-white" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2 font-inter uppercase tracking-tighter">Bạn đang là Thành viên VIP</h3>
        <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">Cảm ơn bạn đã đồng hành cùng chúng tôi. Bạn có toàn quyền truy cập các tính năng cao cấp và đọc báo không giới hạn.</p>

        <div className="mt-12 bg-slate-50 rounded-3xl p-8 max-w-lg mx-auto border border-slate-100">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Đặc quyền của bạn</h4>
          <ul className="space-y-4 text-left">
            {[
              'Đọc báo không giới hạn mọi chuyên mục',
              'Tắt toàn bộ quảng cáo',
              'Đánh dấu và lưu trữ bài viết yêu thích',
              'Bình luận ưu tiên'
            ].map((perk, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <CheckCircle size={20} className="text-green-500 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-sm">
      <div className="mb-12 text-center md:text-left">
        <div className="flex items-center gap-4 justify-center md:justify-start mb-2">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Crown size={24} className="text-amber-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 font-inter tracking-tighter">Nâng cấp VIP</h3>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-4 md:mt-0">Mở khóa toàn bộ đặc quyền, tận hưởng trải nghiệm đọc tin tức tuyệt vời nhất không có quảng cáo.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-12 items-center">
        {/* QR Code Section */}
        <div className="flex-1 bg-gradient-to-b from-blue-50 to-white border-2 border-blue-100 rounded-[2rem] p-8 text-center shadow-lg w-full max-w-sm">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Quét mã để thanh toán</p>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 inline-block mb-6">
            <img src={qrUrl} alt="Thanh toán QR Code" className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-2xl" />
          </div>
          <p className="text-xs font-bold text-slate-400">Mã QR đã bao gồm số tiền và nội dung chuyển khoản</p>
        </div>

        {/* Transfer Info Section */}
        <div className="flex-[1.5] w-full space-y-6">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Thông tin chuyển khoản thủ công</h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Ngân hàng</span>
                <span className="text-sm font-black text-blue-600 uppercase">{BANK_NAME}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Chủ tài khoản</span>
                <span className="text-sm font-black text-slate-900 uppercase">{ACCOUNT_NAME}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">{ACCOUNT_NUMBER}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(ACCOUNT_NUMBER)}
                    className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                    title="Sao chép"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500 uppercase">Số tiền</span>
                <span className="text-xl font-black text-green-600">{AMOUNT.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-amber-50 p-4 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-700 uppercase mb-2 sm:mb-0">Nội dung chuyển khoản (Bắt buộc)</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-amber-600 font-mono tracking-wider">{TRANSFER_CONTENT}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(TRANSFER_CONTENT)}
                    className="p-1.5 bg-amber-200 text-amber-700 rounded-md hover:bg-amber-300 transition-colors"
                    title="Sao chép"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
            <div className="text-xs font-bold text-slate-500">
              Hệ thống sẽ tự động cập nhật VIP sau 1-3 phút kể từ khi chuyển khoản thành công.
            </div>
            <VButton
              variant="primary"
              icon={checking ? Activity : undefined}
              onClick={handleCheckStatus}
              loading={checking}
            >
              Kiểm tra thanh toán
            </VButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradeVIP;
