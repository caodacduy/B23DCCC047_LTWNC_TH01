import React from 'react';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  Check,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../../common/Badge';
import { formatDateTimeVi } from '../../../utils/dateUtils';
import { useDeadlineCountdown } from '../../../hooks/useDeadlineCountdown';
import { DeadlineCardContext, useDeadlineCardContext } from './DeadlineCardContext';
import type { Deadline } from '../../../types/deadline';

export interface DeadlineCardRootProps {
  deadline: Deadline;
  isActionLoading?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

const DeadlineCardRoot: React.FC<DeadlineCardRootProps> = ({
  deadline,
  isActionLoading = false,
  onToggle,
  onDelete,
  children,
  className = '',
}) => {
  const isCompleted = deadline.isCompleted;

  return (
    <DeadlineCardContext.Provider
      value={{ deadline, isActionLoading, onToggle, onDelete }}
    >
      <div
        className={`flex flex-col justify-between p-4 rounded-xl border transition-colors ${
          isCompleted
            ? 'bg-slate-900/60 border-slate-800 opacity-75'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        } ${className}`}
      >
        {children}
      </div>
    </DeadlineCardContext.Provider>
  );
};

const DeadlineCardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 mb-3 flex-wrap ${className}`}>
      {children}
    </div>
  );
};

const DeadlineCardSubject: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { deadline } = useDeadlineCardContext();
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 ${className}`}>
      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
      <span>{deadline.subject}</span>
    </div>
  );
};

const DeadlineCardPriorityBadge: React.FC = () => {
  const { deadline } = useDeadlineCardContext();
  return <Badge variant="priority" priority={deadline.priority} />;
};

const DeadlineCardTimeBadge: React.FC = () => {
  const { deadline } = useDeadlineCardContext();
  const timeInfo = useDeadlineCountdown(deadline.dueDate, deadline.isCompleted);

  const urgencyStyles = {
    completed: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
    overdue: 'bg-rose-950/60 text-rose-400 border-rose-800',
    critical: 'bg-rose-950/60 text-rose-300 border-rose-800',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800',
    normal: 'bg-slate-800 text-slate-300 border-slate-700',
  }[timeInfo.urgency];

  const Icon = timeInfo.isOverdue
    ? AlertCircle
    : deadline.isCompleted
    ? Check
    : Clock;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${urgencyStyles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{timeInfo.formattedText}</span>
    </div>
  );
};

const DeadlineCardBody: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { deadline } = useDeadlineCardContext();
  return (
    <div className={`my-1 flex-1 ${className}`}>
      <h4
        className={`text-sm md:text-base font-semibold leading-snug ${
          deadline.isCompleted
            ? 'line-through text-slate-500'
            : 'text-slate-100'
        }`}
      >
        {deadline.title}
      </h4>
      {deadline.description && (
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {deadline.description}
        </p>
      )}
    </div>
  );
};

const DeadlineCardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400 ${className}`}
    >
      {children}
    </div>
  );
};

const DeadlineCardDueDate: React.FC = () => {
  const { deadline } = useDeadlineCardContext();
  return (
    <div className="flex items-center gap-1.5 text-slate-400">
      <Calendar className="w-3.5 h-3.5 text-slate-500" />
      <span>Hạn: {formatDateTimeVi(deadline.dueDate)}</span>
    </div>
  );
};

const DeadlineCardToggleCheckbox: React.FC = () => {
  const { deadline, isActionLoading, onToggle } = useDeadlineCardContext();

  return (
    <button
      onClick={() => onToggle(deadline.id)}
      disabled={isActionLoading}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none border ${
        deadline.isCompleted
          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800 hover:bg-emerald-900/50'
          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
      }`}
      title={deadline.isCompleted ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành'}
    >
      {deadline.isCompleted ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hoàn thành</span>
        </>
      ) : (
        <>
          <Circle className="w-3.5 h-3.5 text-slate-400" />
          <span>Chưa xong</span>
        </>
      )}
    </button>
  );
};

const DeadlineCardDeleteButton: React.FC = () => {
  const { deadline, isActionLoading, onDelete } = useDeadlineCardContext();

  return (
    <button
      onClick={() => onDelete(deadline.id)}
      disabled={isActionLoading}
      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700"
      title="Xoá bài tập"
      aria-label="Xoá bài tập"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
};

export const DeadlineCard = Object.assign(DeadlineCardRoot, {
  Root: DeadlineCardRoot,
  Header: DeadlineCardHeader,
  Subject: DeadlineCardSubject,
  PriorityBadge: DeadlineCardPriorityBadge,
  TimeBadge: DeadlineCardTimeBadge,
  Body: DeadlineCardBody,
  Footer: DeadlineCardFooter,
  DueDate: DeadlineCardDueDate,
  Toggle: DeadlineCardToggleCheckbox,
  Delete: DeadlineCardDeleteButton,
});