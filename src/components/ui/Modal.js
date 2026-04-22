import React from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass rounded-2xl p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>,
    document.body
  );
};