import { createContext, useContext } from 'react';
import type { DeadlineFilterStatus } from '../../../types/deadline';

export interface FilterTabsContextType {
  activeTab: DeadlineFilterStatus;
  onTabChange: (status: DeadlineFilterStatus) => void;
}

export const FilterTabsContext = createContext<FilterTabsContextType | null>(null);

export function useFilterTabsContext(): FilterTabsContextType {
  const context = useContext(FilterTabsContext);
  if (!context) {
    throw new Error('FilterTabs subcomponents phải được bọc bên trong <FilterTabs.Root />');
  }
  return context;
}
