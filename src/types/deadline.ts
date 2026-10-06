/**
 * Buổi 1 — TypeScript nâng cao:
 * - Domain entities
 * - Utility Types: Pick, Omit, Partial, Record, Readonly
 * - Type Guards: isDeadline, isPriority, isOverdue, isDeadlineFilterStatus
 */

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type DeadlineFilterStatus = 'all' | 'pending' | 'overdue' | 'completed';

export interface Deadline {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export type CreateDeadlineInput = Omit<Deadline, 'id' | 'createdAt' | 'isCompleted' | 'completedAt'>;
export type UpdateDeadlineInput = Partial<Omit<Deadline, 'id' | 'createdAt'>>;
export type DeadlineSummary = Pick<Deadline, 'id' | 'subject' | 'title' | 'dueDate' | 'priority'>;

export interface PriorityMetadata {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  level: number;
}

// Cấu hình màu sắc phẳng, rõ ràng, không gradient
export const PRIORITY_CONFIG: Record<Priority, PriorityMetadata> = {
  low: {
    label: 'Thấp',
    color: '#38bdf8',
    bgColor: '#082f49',
    borderColor: '#0284c7',
    level: 1,
  },
  medium: {
    label: 'Trung bình',
    color: '#facc15',
    bgColor: '#422006',
    borderColor: '#ca8a04',
    level: 2,
  },
  high: {
    label: 'Cao',
    color: '#fb923c',
    bgColor: '#431407',
    borderColor: '#ea580c',
    level: 3,
  },
  urgent: {
    label: 'Khẩn cấp',
    color: '#f87171',
    bgColor: '#450a0a',
    borderColor: '#dc2626',
    level: 4,
  },
};

export type DeadlineStatsCount = Record<DeadlineFilterStatus, number>;

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && ['low', 'medium', 'high', 'urgent'].includes(value);
}

export function isDeadlineFilterStatus(value: unknown): value is DeadlineFilterStatus {
  return typeof value === 'string' && ['all', 'pending', 'overdue', 'completed'].includes(value);
}

export function isDeadline(item: unknown): item is Deadline {
  if (typeof item !== 'object' || item === null) return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.subject === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.dueDate === 'string' &&
    isPriority(obj.priority) &&
    typeof obj.isCompleted === 'boolean' &&
    typeof obj.createdAt === 'string'
  );
}

export function isOverdue(deadline: Deadline, referenceTime: Date = new Date()): boolean {
  if (deadline.isCompleted) return false;
  const due = new Date(deadline.dueDate);
  return due.getTime() < referenceTime.getTime();
}