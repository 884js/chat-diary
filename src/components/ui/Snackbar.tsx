'use client';

import type { SnackbarType } from '@/contexts/SnackbarContext';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';
import { useEffect as useEffectHook } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

interface SnackbarProps {
  open: boolean;
  message: string;
  type?: SnackbarType;
  autoHideDuration?: number;
  onClose: () => void;
}

export const Snackbar: FC<SnackbarProps> = ({
  open,
  message,
  type = 'success',
  autoHideDuration = 3000,
  onClose,
}) => {
  useEffectHook(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-white" size={20} />;
      case 'error':
        return <FiAlertCircle className="text-white" size={20} />;
      case 'info':
        return <FiInfo className="text-white" size={20} />;
      default:
        return <FiInfo className="text-white" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'info':
        return 'bg-blue-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-0 right-0 mx-auto px-4 z-50 w-full sm:w-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 max-w-[95vw] sm:max-w-md"
        >
          <div
            className={`flex items-center px-4 py-3 rounded-lg shadow-lg ${getBackgroundColor()}`}
          >
            <div className="mr-3 flex-shrink-0">{getIcon()}</div>
            <p className="text-white text-sm sm:text-base flex-grow mr-2">
              {message}
            </p>
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none flex-shrink-0"
              aria-label="閉じる"
              type="button"
            >
              <FiX size={18} className="sm:w-[20px] sm:h-[20px]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
