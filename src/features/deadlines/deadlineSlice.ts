/**
 * Buổi 3 — Redux Toolkit + TypeScript: Feature-based Slice & createAsyncThunk
 */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { mockDeadlineApi } from '../../api/mockDeadlineApi';
import type {
  Deadline,
  CreateDeadlineInput,
  DeadlineFilterStatus,
  Priority,
} from '../../types/deadline';

// Interface cho trạng thái Redux Slice
export interface DeadlineState {
  items: Deadline[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // Trạng thái lọc & tìm kiếm
  filterStatus: DeadlineFilterStatus;
  selectedPriority: Priority | 'all';
  searchQuery: string;
  sortBy: 'dueDate' | 'priority' | 'subject';
  sortOrder: 'asc' | 'desc';
  // ID của phần tử đang thực hiện action riêng (toggle / delete) để hiển thị micro-loading
  actionLoadingIds: Record<string, boolean>;
}

const initialState: DeadlineState = {
  items: [],
  status: 'idle',
  error: null,
  filterStatus: 'all',
  selectedPriority: 'all',
  searchQuery: '',
  sortBy: 'dueDate',
  sortOrder: 'asc',
  actionLoadingIds: {},
};

// -----------------------------------------------------------------------------
// Async Thunks (createAsyncThunk)
// -----------------------------------------------------------------------------

// 1. Fetch danh sách ban đầu từ API giả lập (Yêu cầu 7)
export const fetchDeadlines = createAsyncThunk<
  Deadline[],
  void,
  { rejectValue: string }
>('deadlines/fetchDeadlines', async (_, { rejectWithValue }) => {
  try {
    const res = await mockDeadlineApi.fetchDeadlines();
    return res.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi tải danh sách bài tập';
    return rejectWithValue(message);
  }
});

// 2. Thêm bài tập mới (Yêu cầu 2)
export const createDeadline = createAsyncThunk<
  Deadline,
  CreateDeadlineInput,
  { rejectValue: string }
>('deadlines/createDeadline', async (input, { rejectWithValue }) => {
  try {
    const res = await mockDeadlineApi.createDeadline(input);
    return res.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi thêm bài tập';
    return rejectWithValue(message);
  }
});

// 3. Đánh dấu hoàn thành / bỏ đánh dấu (Yêu cầu 3)
export const toggleDeadlineStatus = createAsyncThunk<
  Deadline,
  string,
  { rejectValue: string }
>('deadlines/toggleDeadlineStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await mockDeadlineApi.toggleDeadlineStatus(id);
    return res.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái bài tập';
    return rejectWithValue(message);
  }
});

// 4. Xóa bài tập (Yêu cầu 4)
export const deleteDeadline = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('deadlines/deleteDeadline', async (id, { rejectWithValue }) => {
  try {
    const res = await mockDeadlineApi.deleteDeadline(id);
    return res.data.id;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi xoá bài tập';
    return rejectWithValue(message);
  }
});

// 5. Khôi phục dữ liệu mẫu ban đầu
export const resetToSampleData = createAsyncThunk<
  Deadline[],
  void,
  { rejectValue: string }
>('deadlines/resetToSampleData', async (_, { rejectWithValue }) => {
  try {
    const res = await mockDeadlineApi.resetToSampleData();
    return res.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi đặt lại dữ liệu mẫu';
    return rejectWithValue(message);
  }
});

// -----------------------------------------------------------------------------
// Slice Definition
// -----------------------------------------------------------------------------
export const deadlineSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    // Thay đổi trạng thái lọc (Tất cả / Chưa hoàn thành / Quá hạn / Đã hoàn thành)
    setFilterStatus: (state, action: PayloadAction<DeadlineFilterStatus>) => {
      state.filterStatus = action.payload;
    },
    // Lọc theo độ ưu tiên
    setSelectedPriority: (state, action: PayloadAction<Priority | 'all'>) => {
      state.selectedPriority = action.payload;
    },
    // Tìm kiếm theo tên môn / bài tập
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // Đổi tiêu chí sắp xếp
    setSortBy: (state, action: PayloadAction<'dueDate' | 'priority' | 'subject'>) => {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'asc';
      }
    },
    // Đổi chiều sắp xếp
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    // Xóa thông báo lỗi
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 1. fetchDeadlines
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDeadlines.fulfilled, (state, action: PayloadAction<Deadline[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải danh sách bài tập';
      });

    // 2. createDeadline
    builder
      .addCase(createDeadline.pending, (state) => {
        state.error = null;
      })
      .addCase(createDeadline.fulfilled, (state, action: PayloadAction<Deadline>) => {
        state.items.unshift(action.payload);
      })
      .addCase(createDeadline.rejected, (state, action) => {
        state.error = action.payload || 'Không thể thêm bài tập';
      });

    // 3. toggleDeadlineStatus
    builder
      .addCase(toggleDeadlineStatus.pending, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = true;
      })
      .addCase(toggleDeadlineStatus.fulfilled, (state, action: PayloadAction<Deadline>) => {
        delete state.actionLoadingIds[action.payload.id];
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleDeadlineStatus.rejected, (state, action) => {
        delete state.actionLoadingIds[action.meta.arg];
        state.error = action.payload || 'Không thể cập nhật trạng thái';
      });

    // 4. deleteDeadline
    builder
      .addCase(deleteDeadline.pending, (state, action) => {
        state.actionLoadingIds[action.meta.arg] = true;
      })
      .addCase(deleteDeadline.fulfilled, (state, action: PayloadAction<string>) => {
        delete state.actionLoadingIds[action.payload];
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteDeadline.rejected, (state, action) => {
        delete state.actionLoadingIds[action.meta.arg];
        state.error = action.payload || 'Không thể xoá bài tập';
      });

    // 5. resetToSampleData
    builder
      .addCase(resetToSampleData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetToSampleData.fulfilled, (state, action: PayloadAction<Deadline[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(resetToSampleData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể đặt lại dữ liệu mẫu';
      });
  },
});

export const {
  setFilterStatus,
  setSelectedPriority,
  setSearchQuery,
  setSortBy,
  toggleSortOrder,
  clearError,
} = deadlineSlice.actions;

export default deadlineSlice.reducer;
