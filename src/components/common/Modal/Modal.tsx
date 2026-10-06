import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ModalContext, useModalContext } from './ModalContext';

export interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const ModalRoot: React.FC<ModalRootProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'md',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[maxWidth];

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
        ref={overlayRef}
      >
        <div
          className={`w-full ${maxWidthClass} bg-slate-900 border border-slate-800 rounded-xl overflow-hidden`}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  subtitle?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, subtitle }) => {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-slate-800 bg-slate-900">
      <div>
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          {children}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <ModalCloseButton />
    </div>
  );
};

const ModalCloseButton: React.FC = () => {
  const { onClose } = useModalContext();
  return (
    <button
      onClick={onClose}
      className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
      aria-label="Đóng hộp thoại"
    >
      <X className="w-5 h-5" />
    </button>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-5 py-4 max-h-[75vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-800 bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
};

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Header: ModalHeader,
  CloseButton: ModalCloseButton,
  Body: ModalBody,
  Footer: ModalFooter,
});