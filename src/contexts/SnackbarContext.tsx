'use client';

import { Snackbar } from '@/components/ui/Snackbar';
import { type ReactNode, createContext, useContext, useState } from 'react';

export type SnackbarType = 'success' | 'error' | 'info';

interface ShowSnackbarOptions {
  message: string;
  type?: SnackbarType;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (options: ShowSnackbarOptions) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('success');
  const [duration, setDuration] = useState(3000);

  const showSnackbar = ({
    message: newMessage,
    type: newType = 'success',
    duration: newDuration = 3000,
  }: ShowSnackbarOptions) => {
    setMessage(newMessage);
    setType(newType);
    setDuration(newDuration);
    setOpen(true);
  };

  const hideSnackbar = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        open={open}
        message={message}
        type={type}
        autoHideDuration={duration}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
