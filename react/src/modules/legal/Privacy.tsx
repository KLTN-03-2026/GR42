import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Info } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-100/50">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Chính sách Bảo mật</h1>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database size={20} className="text-emerald-500" />
              <h2 className="text-xl font-black text-slate-800">1. Thu thập thông tin</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Chúng tôi thu thập thông tin khi bạn đăng ký trên trang web của chúng tôi, đăng nhập vào tài khoản của bạn. Thông tin được thu thập bao gồm tên, địa chỉ email, số điện thoại và thông tin tương tác với tin tức.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye size={20} className="text-blue-500" />
              <h2 className="text-xl font-black text-slate-800">2. Sử dụng thông tin</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Bất kỳ thông tin nào chúng tôi thu thập từ bạn có thể được sử dụng để:
            </p>
            <ul className="space-y-3 text-slate-600 mt-4">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                <span>Cá nhân hóa trải nghiệm của bạn và đáp ứng nhu cầu cá nhân.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                <span>Cung cấp nội dung tin tức phù hợp với sở thích của bạn.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                <span>Cải thiện dịch vụ khách hàng và hỗ trợ nhu cầu của bạn.</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock size={20} className="text-indigo-500" />
              <h2 className="text-xl font-black text-slate-800">3. Bảo mật dữ liệu</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Chúng tôi triển khai một loạt các biện pháp bảo mật để duy trì sự an toàn cho thông tin cá nhân của bạn. Chúng tôi sử dụng mã hóa hiện đại để bảo vệ thông tin nhạy cảm được truyền trực tuyến.
            </p>
          </section>

          <section className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Info size={20} className="text-amber-500" />
              <h2 className="text-xl font-black text-slate-800">4. Quyền của bạn</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Bạn có quyền truy cập, sửa đổi hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào thông qua cài đặt tài khoản hoặc bằng cách liên hệ với chúng tôi trực tiếp.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-end gap-6">
          <div className="flex gap-8">
            <a href="/terms" className="text-sm font-black text-emerald-600 hover:text-emerald-700 transition-colors">Điều khoản dịch vụ</a>
            <a href="/" className="text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors">Về trang chủ</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacy;
