import React, { createContext, useContext } from 'react';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right' 
}) => {
  const success = (message: string) => {
    return toast.success(message, {
      duration: 4000,
      position,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  };

  const error = (message: string) => {
    return toast.error(message, {
      duration: 5000,
      position,
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      position,
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
      },
    });
  };

  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  return (
    <ToastContext.Provider value={{ success, error, loading, dismiss }}>
      {children}
      <Toaster
        position={position}
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
            fontWeight: '500',
            borderRadius: '0.5rem',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#fff',
              secondary: '#3b82f6',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};