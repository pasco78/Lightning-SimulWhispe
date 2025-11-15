'use client';

import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorNotificationProps {
  error: string | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ErrorNotification({
  error,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: ErrorNotificationProps) {
  useEffect(() => {
    if (error && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [error, autoClose, autoCloseDelay, onClose]);

  if (!error) {
    return null;
  }

  return (
    <div className="error-notification">
      <div className="error-content">
        <AlertCircle className="error-icon" size={20} />
        <p className="error-message">{error}</p>
      </div>
      <button onClick={onClose} className="error-close" title="Close">
        <X size={18} />
      </button>
    </div>
  );
}
