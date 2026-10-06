import type { ApiResponse } from '../types/common';
import type { Deadline, CreateDeadlineInput } from '../types/deadline';

// Helper tạo delay giả lập mạng
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Key lưu trữ localStorage để duy trì dữ liệu khi refresh nếu muốn
const STORAGE_KEY = 'student_deadline_tracker_v1';

// Danh sách bài tập mẫu ban đầu phản ánh thực tế sinh viên
const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'dl-1',
    subject: 'Mạng máy tính',
    title: 'Bài tập lớn Socket TCP/UDP Client-Server đa luồng',
    description: 'Xây dựng ứng dụng chat nhóm sử dụng Java Socket hoặc C++, xử lý nhiều client đồng thời với Thread Pool.',
    dueDate: '2026-10-04T23:59', // Quá hạn 2 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: '2026-09-25T08:00:00Z',
  },
  {
    id: 'dl-2',
    subject: 'Lập trình Web',
    title: 'Xây dựng ứng dụng Redux Toolkit + TypeScript',
    description: 'Áp dụng TypeScript nâng cao (Generics, Type Guards), Compound Component và Redux Toolkit createAsyncThunk.',
    dueDate: '2026-10-07T21:00', // Còn ~1 ngày
    priority: 'urgent',
    isCompleted: false,
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'dl-3',
    subject: 'Cấu trúc dữ liệu & Giải thuật',
    title: 'Cài đặt cây AVL và cân bằng Red-Black Tree',
    description: 'Cài đặt thao tác chèn, xoá, quay trái, quay phải và đánh giá độ phức tạp thời gian O(log N).',
    dueDate: '2026-10-09T23:59', // Còn ~3 ngày
    priority: 'high',
    isCompleted: false,
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'dl-4',
    subject: 'Hệ quản trị CSDL',
    title: 'Thiết kế mô hình ERD & Chuẩn hoá 3NF hệ thống E-commerce',
    description: 'Vẽ sơ đồ quan hệ thực thể, viết script SQL DDL tạo bảng và các ràng buộc khoá ngoại Foreign Key.',
    dueDate: '2026-10-11T17:00', // Còn ~5 ngày
    priority: 'medium',
    isCompleted: false,
    createdAt: '2026-10-02T09:15:00Z',
  },
  {
    id: 'dl-5',
    subject: 'Trí tuệ nhân tạo',
    title: 'Báo cáo thuật toán tìm kiếm đường đi A* và Heuristic',
    description: 'So sánh thuật toán BFS, DFS và A* trên bài toán 8-Puzzle, xuất biểu đồ thời gian thực thi.',
    dueDate: '2026-10-14T23:59', // Còn ~8 ngày
    priority: 'low',
    isCompleted: false,
    createdAt: '2026-10-03T16:00:00Z',
  },
  {
    id: 'dl-6',
    subject: 'Kiến trúc máy tính',
    title: 'Mô phỏng bộ xử lý đơn chu kỳ MIPS 32-bit trên Logisim',
    description: 'Hoàn thành khối ALU, Register File và Datapath cho tập lệnh R-type, I-type và J-type.',
    dueDate: '2026-10-05T20:00', // Đã hoàn thành
    priority: 'medium',
    isCompleted: true,
    createdAt: '2026-09-20T11:00:00Z',
    completedAt: '2026-10-05T18:45:00Z',
  },
];

function loadFromLocal(): Deadline[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage', err);
  }
  return INITIAL_DEADLINES;
}

function saveToLocal(items: Deadline[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }
}

/**
 * Giả lập API Backend:
 * - GET /api/deadlines (fetchDeadlines)
 * - POST /api/deadlines (createDeadline)
 * - PATCH /api/deadlines/:id/toggle (toggleDeadlineStatus)
 * - DELETE /api/deadlines/:id (deleteDeadline)
 */
export const mockDeadlineApi = {
  // 1. Lấy danh sách ban đầu (Yêu cầu 7)
  async fetchDeadlines(): Promise<ApiResponse<Deadline[]>> {
    await delay(750); // Giả lập độ trễ mạng
    const items = loadFromLocal();
    return {
      data: items,
      status: 'success',
      message: 'Lấy danh sách bài tập thành công',
      timestamp: new Date().toISOString(),
    };
  },

  // 2. Thêm bài tập mới (Yêu cầu 2)
  async createDeadline(input: CreateDeadlineInput): Promise<ApiResponse<Deadline>> {
    await delay(400);
    const newDeadline: Deadline = {
      ...input,
      id: 'dl-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    const current = loadFromLocal();
    const updated = [newDeadline, ...current];
    saveToLocal(updated);

    return {
      data: newDeadline,
      status: 'success',
      message: 'Thêm bài tập mới thành công',
      timestamp: new Date().toISOString(),
    };
  },

  // 3. Đánh dấu hoàn thành / bỏ đánh dấu (Yêu cầu 3)
  async toggleDeadlineStatus(id: string): Promise<ApiResponse<Deadline>> {
    await delay(250);
    const current = loadFromLocal();
    const index = current.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Không tìm thấy bài tập với ID: ${id}`);
    }

    const target = current[index];
    const willComplete = !target.isCompleted;
    const updatedItem: Deadline = {
      ...target,
      isCompleted: willComplete,
      completedAt: willComplete ? new Date().toISOString() : undefined,
    };

    current[index] = updatedItem;
    saveToLocal(current);

    return {
      data: updatedItem,
      status: 'success',
      message: willComplete ? 'Đã đánh dấu hoàn thành' : 'Đã bỏ đánh dấu hoàn thành',
      timestamp: new Date().toISOString(),
    };
  },

  // 4. Xóa bài tập (Yêu cầu 4)
  async deleteDeadline(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(250);
    const current = loadFromLocal();
    const filtered = current.filter((item) => item.id !== id);

    if (filtered.length === current.length) {
      throw new Error(`Không tìm thấy bài tập với ID: ${id}`);
    }

    saveToLocal(filtered);

    return {
      data: { id },
      status: 'success',
      message: 'Xoá bài tập thành công',
      timestamp: new Date().toISOString(),
    };
  },

  // Reset về dữ liệu mẫu mặc định
  async resetToSampleData(): Promise<ApiResponse<Deadline[]>> {
    await delay(350);
    saveToLocal(INITIAL_DEADLINES);
    return {
      data: INITIAL_DEADLINES,
      status: 'success',
      message: 'Đã đặt lại danh sách mẫu ban đầu',
      timestamp: new Date().toISOString(),
    };
  },
};
