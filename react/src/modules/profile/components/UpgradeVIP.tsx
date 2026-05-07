import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle, Activity } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants/config';
import VButton from '../../../components/core/VButton';

interface UpgradeVIPProps {
  userData: any;
  authToken: string | null;
}

const UpgradeVIP: React.FC<UpgradeVIPProps> = ({ userData, authToken }) => {
  const [isVip, setIsVip] = useState(userData?.is_vip === 1);
  const [checking, setChecking] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
      const res = await axios.get(`${API_BASE_URL}/index.php`, {
        params: { module: 'api', action: 'user', token: authToken }
      });
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
        <div className="mb-12">
          <h3 className="text-xl font-black text-slate-900 mb-2">Thành viên VIP</h3>
          <p className="text-sm font-medium text-slate-400">Trải nghiệm các tính năng đặc quyền dành riêng cho thành viên VIP.</p>
        </div>
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200">
          <Crown size={48} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 font-roboto uppercase tracking-tighter">Bạn đang là Thành viên VIP</h3>

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
      <div className="mb-12">
        <h3 className="text-xl font-black text-slate-900 mb-2">Nâng cấp VIP</h3>
        <p className="text-sm font-medium text-slate-400">Trải nghiệm các tính năng đặc quyền dành riêng cho thành viên VIP.</p>
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
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Thông tin tài khoản</h4>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500">Ngân hàng</span>
                <span className="text-sm font-black text-blue-600 uppercase">{BANK_NAME}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500">Chủ tài khoản</span>
                <span className="text-sm font-black text-slate-900 uppercase">{ACCOUNT_NAME}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-slate-500">Số tài khoản</span>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-slate-900">{ACCOUNT_NUMBER}</span>
                  <button
                    onClick={() => handleCopy(ACCOUNT_NUMBER, 'number')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      copiedField === 'number' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {copiedField === 'number' ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-slate-500">Số tiền cần chuyển</span>
                <span className="text-xl font-black text-green-600">{AMOUNT.toLocaleString()} VNĐ</span>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-amber-700 block ml-1">Nội dung chuyển khoản (Bắt buộc)</span>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex justify-between items-center">
                  <span className="text-xl font-black text-amber-600 font-mono tracking-wider">{TRANSFER_CONTENT}</span>
                  <button
                    onClick={() => handleCopy(TRANSFER_CONTENT, 'content')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                      copiedField === 'content' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white hover:bg-amber-700 active:scale-95'
                    }`}
                  >
                    {copiedField === 'content' ? 'Đã chép' : 'Sao chép'}
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
              className="whitespace-nowrap shrink-0"
            >
              Kiểm tra
            </VButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradeVIP;
