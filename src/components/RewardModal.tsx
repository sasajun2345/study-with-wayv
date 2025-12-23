import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WayVMember } from '../types';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: string | null;
  member: WayVMember;
}

export default function RewardModal({ isOpen, onClose, reward, member }: RewardModalProps) {
  const { t } = useTranslation();

  if (!reward) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-1 max-w-sm w-full shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="relative bg-slate-900/90 rounded-[22px] p-6 text-center backdrop-blur-xl">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center space-x-2 mb-4 bg-white/5 rounded-full px-4 py-1">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-100">
                    {t('reward_title', { name: member.name })}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6 border-4 border-white/10 shadow-2xl group"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
              >
                <img 
                  src={reward} 
                  alt="Reward" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-wayv-green to-wayv-green-dark text-white font-bold shadow-lg shadow-wayv-green/20 flex items-center justify-center space-x-2"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = reward;
                  link.download = `WayV-${member.nameEn}-Reward.jpg`;
                  link.click();
                }}
              >
                <Download size={18} />
                <span>{t('save_reward')}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
