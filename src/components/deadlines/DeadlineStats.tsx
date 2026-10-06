import React from 'react';
import {
  ListTodo,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectDeadlineStats } from '../../features/deadlines/deadlineSelectors';

export const DeadlineStats: React.FC = () => {
  const stats = useAppSelector(selectDeadlineStats);

  const cards = [
    {
      title: 'Tổng bài tập',
      value: stats.all,
      subtitle: 'Tất cả các môn',
      icon: ListTodo,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/60',
    },
    {
      title: 'Chưa hoàn thành',
      value: stats.pending,
      subtitle: `${stats.urgentCount} bài ưu tiên cao`,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/40',
    },
    {
      title: 'Quá hạn',
      value: stats.overdue,
      subtitle: stats.overdue > 0 ? 'Cần hoàn thành gấp' : 'Không có bài quá hạn',
      icon: AlertCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/40',
    },
    {
      title: 'Đã hoàn thành',
      value: stats.completed,
      subtitle: `Đạt ${stats.completionRate}% tiến độ`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/40',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl md:text-3xl font-bold text-slate-100">
                  {card.value}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-medium text-slate-300">
          Tiến độ hoàn thành: <strong className="text-white">{stats.completed}/{stats.all} bài tập</strong>
        </span>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-200 min-w-10 text-right">
            {stats.completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};