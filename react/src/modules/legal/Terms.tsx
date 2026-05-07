import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, UserCheck, Scale, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-100/50">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Điều khoản Dịch vụ</h1>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck size={20} className="text-blue-500" />
              <h2 className="text-xl font-black text-slate-800">1. Chấp nhận điều khoản</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Bằng cách truy cập và sử dụng Vertex, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-indigo-500" />
              <h2 className="text-xl font-black text-slate-800">2. Quyền sở hữu trí tuệ</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Tất cả nội dung trên trang web này, bao gồm văn bản, đồ họa, logo, biểu tượng, hình ảnh và phần mềm, là tài sản của Vertex hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi luật bản quyền quốc tế.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale size={20} className="text-violet-500" />
              <h2 className="text-xl font-black text-slate-800">3. Trách nhiệm người dùng</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <span>Không sử dụng dịch vụ cho bất kỳ mục đích phi pháp nào.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <span>Không đăng tải nội dung gây thù hận, bạo lực hoặc vi phạm pháp luật.</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <span>Chịu trách nhiệm bảo mật tài khoản cá nhân của bạn.</span>
              </li>
            </ul>
          </section>

          <section className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={20} className="text-amber-500" />
              <h2 className="text-xl font-black text-slate-800">4. Giới hạn trách nhiệm</h2>
            </div>
            <p className="text-slate-600 leading-relaxed italic">
              Vertex không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp hoặc ngẫu nhiên nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-end gap-6">
          <div className="flex gap-8">
            <a href="/privacy" className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">Chính sách bảo mật</a>
            <a href="/" className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors">Về trang chủ</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
