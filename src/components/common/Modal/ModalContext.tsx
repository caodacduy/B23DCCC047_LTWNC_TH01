import { createContext, useContext } from 'react';

export interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext(): ModalContextType {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Các Modal subcomponents phải được bọc bên trong <Modal.Root />');
  }
  return context;
}
