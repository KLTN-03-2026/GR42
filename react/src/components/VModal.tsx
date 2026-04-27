import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import VButton from './VButton';

interface VModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: React.ReactNode;
  type?: 'danger' | 'info' | 'success' | 'warning';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const VModal: React.FC<VModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  loading = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  type === 'danger' ? 'bg-red-50 text-red-500' : 
                  type === 'warning' ? 'bg-amber-50 text-amber-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <AlertTriangle size={28} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-10">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{title}</h3>
                <div className="text-slate-500 font-medium leading-relaxed">{message}</div>
              </div>

              <div className="flex gap-4">
                <VButton 
                  variant="ghost" 
                  className="flex-1 !bg-slate-50 hover:!bg-slate-100" 
                  onClick={onClose}
                >
                  {cancelText}
                </VButton>
                {onConfirm && (
                  <VButton 
                    variant={type === 'danger' ? 'primary' : 'secondary'} 
                    className={`flex-1 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : ''}`}
                    onClick={onConfirm}
                    loading={loading}
                  >
                    {confirmText}
                  </VButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VModal;
