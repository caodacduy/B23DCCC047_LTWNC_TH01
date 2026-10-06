import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Inbox,
  AlertCircle,
  PlusCircle,
  } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  toggleDeadlineStatus,
  deleteDeadline,
} from '../../features/deadlines/deadlineSlice';
import {
  selectFilteredAndSortedDeadlines,
  selectDeadlinesStatus,
  selectDeadlinesError,
  selectActionLoadingIds,
  selectFilterStatus,
} from '../../features/deadlines/deadlineSelectors';
import { DeadlineCard } from './DeadlineCard';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export interface DeadlineListProps {
  onOpenAddModal: () => void;
}

export const DeadlineList: React.FC<DeadlineListProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const deadlines = useAppSelector(selectFilteredAndSortedDeadlines);
  const status = useAppSelector(selectDeadlinesStatus);
  const error = useAppSelector(selectDeadlinesError);
  const actionLoadingIds = useAppSelector(selectActionLoadingIds);
  const currentFilter = useAppSelector(selectFilterStatus);

  // State xác nhận xoá
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Xử lý toggle hoàn thành kèm hiệu ứng pháo hoa
  const handleToggle = (id: string) => {
    const target = deadlines.find((d) => d.id === id);
    if (target && !target.isCompleted) {
      // Bắn confetti chúc mừng sinh viên nộp bài
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Safe fallback nếu trình duyệt không hỗ trợ
      }
    }
    dispatch(toggleDeadlineStatus(id));
  };

  // Xác nhận xoá
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      dispatch(deleteDeadline(deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  // 1. Loading Skeleton
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-slate-800 rounded-md" />
              <div className="h-5 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-slate-800 rounded-md" />
              <div className="h-4 w-full bg-slate-800/60 rounded-md" />
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-800 rounded" />
              <div className="h-8 w-24 bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (status === 'failed') {
    return (
      <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-rose-300">Không thể tải dữ liệu</h3>
        <p className="text-xs text-rose-400/80 mt-1 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </div>
    );
  }

  // 3. Empty State
  if (deadlines.length === 0) {
    const filterLabels = {
      all: 'Bạn chưa có bài tập nào',
      pending: 'Tuyệt vời! Không còn bài tập nào chưa hoàn thành',
      overdue: 'Thật tuyệt! Bạn không có bài tập nào bị quá hạn',
      completed: 'Chưa có bài tập nào được đánh dấu hoàn thành',
    };

    return (
      <div className="p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl max-w-md mx-auto my-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-200">
          {filterLabels[currentFilter]}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 mb-5 leading-relaxed">
          Hãy giữ thói quen theo dõi hạn nộp bài thường xuyên để không bị bỏ lỡ bài tập quan trọng.
        </p>
        <Button
          variant="primary"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onOpenAddModal}
        >
          Thêm bài tập mới
        </Button>
      </div>
    );
  }

  // 4. Render Grid sử dụng COMPOUND COMPONENT: DeadlineCard
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deadlines.map((item) => (
          <DeadlineCard.Root
            key={item.id}
            deadline={item}
            isActionLoading={!!actionLoadingIds[item.id]}
            onToggle={handleToggle}
            onDelete={(id) => setDeleteConfirmId(id)}
          >
            <DeadlineCard.Header>
              <DeadlineCard.Subject />
              <div className="flex items-center gap-2">
                <DeadlineCard.PriorityBadge />
                <DeadlineCard.TimeBadge />
              </div>
            </DeadlineCard.Header>

            <DeadlineCard.Body />

            <DeadlineCard.Footer>
              <DeadlineCard.DueDate />
              <div className="flex items-center gap-2">
                <DeadlineCard.Toggle />
                <DeadlineCard.Delete />
              </div>
            </DeadlineCard.Footer>
          </DeadlineCard.Root>
        ))}
      </div>

      {/* Modal Xác nhận xoá (Compound Component Modal) */}
      <Modal.Root
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        maxWidth="sm"
      >
        <Modal.Header subtitle="Hành động này không thể hoàn tác">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>Xác nhận xoá bài tập</span>
        </Modal.Header>
        <Modal.Body>
          <p className="text-sm text-slate-300">
            Bạn có chắc chắn muốn xoá bài tập này khỏi danh sách theo dõi không?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmId(null)}
          >
            Huỷ bỏ
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Xác nhận xoá
          </Button>
        </Modal.Footer>
      </Modal.Root>
    </>
  );
};
