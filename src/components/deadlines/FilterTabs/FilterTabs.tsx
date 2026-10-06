import React from 'react';
import type { DeadlineFilterStatus } from '../../../types/deadline';
import { FilterTabsContext, useFilterTabsContext } from './FilterTabsContext';

export interface FilterTabsRootProps {
  activeTab: DeadlineFilterStatus;
  onTabChange: (tab: DeadlineFilterStatus) => void;
  children: React.ReactNode;
  className?: string;
}

const FilterTabsRoot: React.FC<FilterTabsRootProps> = ({
  activeTab,
  onTabChange,
  children,
  className = '',
}) => {
  return (
    <FilterTabsContext.Provider value={{ activeTab, onTabChange }}>
      <div
        className={`inline-flex p-1 bg-slate-950 border border-slate-800 rounded-lg gap-1 ${className}`}
      >
        {children}
      </div>
    </FilterTabsContext.Provider>
  );
};

export interface FilterTabProps {
  value: DeadlineFilterStatus;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

const FilterTab: React.FC<FilterTabProps> = ({ value, label, count, icon }) => {
  const { activeTab, onTabChange } = useFilterTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => onTabChange(value)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer select-none ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
      }`}
    >
      {icon && <span className="opacity-80">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
            isActive
              ? 'bg-indigo-700 text-white'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export const FilterTabs = Object.assign(FilterTabsRoot, {
  Root: FilterTabsRoot,
  Tab: FilterTab,
});