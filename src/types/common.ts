/**
 * Buổi 1 — TypeScript nâng cao: Generic Types
 * Generic API wrapper & generic helper types
 */

// Generic API response structure
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

// Generic paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Generic predicate function for filtering
export type Predicate<T> = (item: T) => boolean;

// Generic sorter function
export type Comparator<T> = (a: T, b: T) => number;

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Generic sort option
export interface SortOption<T> {
  key: keyof T;
  direction: SortDirection;
  label: string;
}

// Generic filter options
export interface FilterOptions<T> {
  searchQuery?: string;
  sortBy?: keyof T;
  sortDirection?: SortDirection;
}

// Utility: make specific properties nullable
export type Nullable<T> = T | null;

// Generic function to filter an array by predicate
export function filterItems<T>(items: T[], predicate: Predicate<T>): T[] {
  return items.filter(predicate);
}

// Generic function to sort an array
export function sortItems<T>(items: T[], comparator: Comparator<T>): T[] {
  return [...items].sort(comparator);
}
