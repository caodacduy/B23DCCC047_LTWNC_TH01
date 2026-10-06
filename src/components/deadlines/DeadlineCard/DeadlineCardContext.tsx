import { createContext, useContext } from 'react';
import type { Deadline } from '../../../types/deadline';

export interface DeadlineCardContextType {
  deadline: Deadline;
  isActionLoading: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DeadlineCardContext = createContext<DeadlineCardContextType | null>(null);

export function useDeadlineCardContext(): DeadlineCardContextType {
  const context = useContext(DeadlineCardContext);
  if (!context) {
    throw new Error('DeadlineCard subcomponents phải được bọc bên trong <DeadlineCard.Root />');
  }
  return context;
}
