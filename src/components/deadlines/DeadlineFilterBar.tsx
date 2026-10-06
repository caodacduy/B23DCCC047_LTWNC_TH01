import React from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  Filter,
  CheckCircle,
  Clock,
  AlertOctagon,
  ListFilter,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setFilterStatus,
  setSelectedPriority,
  setSearchQuery,
  setSortBy,
  toggleSortOrder,
} from '../../features/deadlines/deadlineSlice';
import {
  selectFilterStatus,
  selectSelectedPriority,
  selectSearchQuery,
  selectSortBy,
  selectSortOrder,
  selectDeadlineStats,
} from '../../features/deadlines/deadlineSelectors';
import { FilterTabs } from './FilterTabs';
import type { Priority } from '../../types/deadline';

export const DeadlineFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterStatus = useAppSelector(selectFilterStatus);
  const selectedPriority = useAppSelector(selectSelectedPriority);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const sortOrder = useAppSelector(selectSortOrder);
  const stats = useAppSelector(selectDeadlineStats);

  const priorityOptions: Array<{ value: Priority | 'all'; label: string }> = [
    { value: 'all', label: 'Mọi độ ưu tiên' },
    { value: 'urgent', label: 'Khẩn cấp' },
    { value: 'high', label: 'Ưu tiên cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Ưu tiên thấp' },
  ];

  return (
    <div className="space-y-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <FilterTabs.Root
          activeTab={filterStatus}
          onTabChange={(status) => dispatch(setFilterStatus(status))}
          className="w-full lg:w-auto overflow-x-auto flex-nowrap"
        >
          <FilterTabs.Tab
            value="all"
            label="Tất cả"
            count={stats.all}
            icon={<ListFilter className="w-3.5 h-3.5" />}
          />
          <FilterTabs.Tab
            value="pending"
            label="Chưa hoàn thành"
            count={stats.pending}
            icon={<Clock className="w-3.5 h-3.5" />}
          />
          <FilterTabs.Tab
            value="overdue"
            label="Quá hạn"
            count={stats.overdue}
            icon={<AlertOctagon className="w-3.5 h-3.5" />}
          />
          <FilterTabs.Tab
            value="completed"
            label="Đã hoàn thành"
            count={stats.completed}
            icon={<CheckCircle className="w-3.5 h-3.5" />}
          />
        </FilterTabs.Root>

        <div className="relative flex-1 lg:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo môn học, bài tập..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(''))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Độ ưu tiên:
          </span>
          <select
            value={selectedPriority}
            onChange={(e) =>
              dispatch(setSelectedPriority(e.target.value as Priority | 'all'))
            }
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" /> Sắp xếp:
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              dispatch(
                setSortBy(e.target.value as 'dueDate' | 'priority' | 'subject')
              )
            }
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
          >
            <option value="dueDate">Hạn nộp</option>
            <option value="priority">Độ ưu tiên</option>
            <option value="subject">Tên môn học</option>
          </select>

          <button
            onClick={() => dispatch(toggleSortOrder())}
            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-medium transition-colors cursor-pointer"
            title="Đảo chiều sắp xếp"
          >
            {sortOrder === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
          </button>
        </div>
      </div>
    </div>
  );
};