import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppDispatch } from './app/hooks';
import { fetchDeadlines } from './features/deadlines/deadlineSlice';
import { Header } from './components/layout/Header';
import { DeadlineStats } from './components/deadlines/DeadlineStats';
import { DeadlineFilterBar } from './components/deadlines/DeadlineFilterBar';
import { DeadlineList } from './components/deadlines/DeadlineList';
import { DeadlineFormModal } from './components/deadlines/DeadlineFormModal';

export function App() {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDeadlines());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Theo dõi tiến độ & deadline bài tập
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Quản lý các bài tập sắp đến hạn, phân loại độ ưu tiên và đánh dấu hoàn thành.
            </p>
          </div>
        </div>

        <DeadlineStats />
        <DeadlineFilterBar />
        <div className="pt-1">
          <DeadlineList onOpenAddModal={() => setIsAddModalOpen(true)} />
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-800 bg-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-400">
            Student Deadline Tracker &bull; Ứng dụng quản lý bài tập cá nhân
          </p>
          <p className="text-[11px] text-slate-500">
            Bài tập lớn Lập trình Web &bull; React 19 + TypeScript + Redux Toolkit
          </p>
        </div>
      </footer>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="sm:hidden fixed right-4 bottom-4 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center border border-indigo-500"
        aria-label="Thêm bài tập"
      >
        <Plus className="w-5 h-5" />
      </button>

      <DeadlineFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

export default App;