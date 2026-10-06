import React from 'react';
import type { Priority } from '../../types/deadline';
import { PRIORITY_CONFIG } from '../../types/deadline';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'priority' | 'status' | 'neutral' | 'subject';
  priority?: Priority;
  color?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  priority,
  className = '',
}) => {
  if (variant === 'priority' && priority) {
    const config = PRIORITY_CONFIG[priority];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${className}`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        {config.label}
      </span>
    );
  }

  if (variant === 'subject') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}
    >
      {children}
    </span>
  );
};