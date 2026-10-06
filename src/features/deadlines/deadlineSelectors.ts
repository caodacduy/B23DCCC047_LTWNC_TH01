import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Deadline, DeadlineStatsCount, Priority } from '../../types/deadline';
import { isOverdue } from '../../types/deadline';

// Base selectors
export const selectDeadlinesState = (state: RootState) => state.deadlines;
export const selectAllDeadlines = (state: RootState) => state.deadlines.items;
export const selectDeadlinesStatus = (state: RootState) => state.deadlines.status;
export const selectDeadlinesError = (state: RootState) => state.deadlines.error;
export const selectFilterStatus = (state: RootState) => state.deadlines.filterStatus;
export const selectSelectedPriority = (state: RootState) => state.deadlines.selectedPriority;
export const selectSearchQuery = (state: RootState) => state.deadlines.searchQuery;
export const selectSortBy = (state: RootState) => state.deadlines.sortBy;
export const selectSortOrder = (state: RootState) => state.deadlines.sortOrder;
export const selectActionLoadingIds = (state: RootState) => state.deadlines.actionLoadingIds;

// Priority rank helper
const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

// Selector thống kê số lượng (Tổng, Chưa xong, Quá hạn, Đã xong)
export const selectDeadlineStats = createSelector(
  [selectAllDeadlines],
  (items): DeadlineStatsCount & { completionRate: number; urgentCount: number } => {
    let pending = 0;
    let overdue = 0;
    let completed = 0;
    let urgent = 0;

    items.forEach((item) => {
      if (item.isCompleted) {
        completed++;
      } else if (isOverdue(item)) {
        overdue++;
      } else {
        pending++;
      }

      if (!item.isCompleted && (item.priority === 'urgent' || item.priority === 'high')) {
        urgent++;
      }
    });

    const total = items.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      all: total,
      pending,
      overdue,
      completed,
      urgentCount: urgent,
      completionRate,
    };
  }
);

// Selector danh sách đã lọc và sắp xếp
export const selectFilteredAndSortedDeadlines = createSelector(
  [
    selectAllDeadlines,
    selectFilterStatus,
    selectSelectedPriority,
    selectSearchQuery,
    selectSortBy,
    selectSortOrder,
  ],
  (items, filterStatus, selectedPriority, searchQuery, sortBy, sortOrder): Deadline[] => {
    const query = searchQuery.trim().toLowerCase();

    // 1. Lọc theo trạng thái và tìm kiếm
    const filtered = items.filter((item) => {
      // Lọc theo trạng thái
      if (filterStatus === 'pending') {
        if (item.isCompleted || isOverdue(item)) return false;
      } else if (filterStatus === 'overdue') {
        if (!isOverdue(item)) return false;
      } else if (filterStatus === 'completed') {
        if (!item.isCompleted) return false;
      }

      // Lọc theo độ ưu tiên
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
        return false;
      }

      // Tìm kiếm theo tên môn học hoặc tiêu đề
      if (query.length > 0) {
        const matchSubject = item.subject.toLowerCase().includes(query);
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        if (!matchSubject && !matchTitle && !matchDesc) return false;
      }

      return true;
    });

    // 2. Sắp xếp
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        comparison = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      } else if (sortBy === 'subject') {
        comparison = a.subject.localeCompare(b.subject, 'vi');
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }
);
