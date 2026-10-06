import React from 'react';
import { PlusCircle, BookOpen, FileText, Calendar, Flag, AlignLeft } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDeadlineForm } from '../../hooks/useDeadlineForm';
import { useAppDispatch } from '../../app/hooks';
import { createDeadline } from '../../features/deadlines/deadlineSlice';
import type { CreateDeadlineInput, Priority } from '../../types/deadline';
import { PRIORITY_CONFIG } from '../../types/deadline';

export interface DeadlineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeadlineFormModal: React.FC<DeadlineFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const handleFormSubmit = async (values: CreateDeadlineInput) => {
    const resultAction = await dispatch(createDeadline(values));
    if (createDeadline.fulfilled.match(resultAction)) {
      onClose();
      return true;
    }
    return false;
  };

  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    resetForm,
    handleSubmit,
  } = useDeadlineForm({
    onSubmit: handleFormSubmit,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];

  return (
    <Modal.Root isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <Modal.Header subtitle="Nhập chi tiết bài tập để theo dõi và nhận thông báo nhắc hạn kịp thời">
        <PlusCircle className="w-5 h-5 text-indigo-400" />
        <span>Thêm bài tập mới</span>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          {/* Môn học */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Môn học <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Lập trình Web, CSDL, Trí tuệ nhân tạo..."
              value={values.subject}
              onChange={(e) => setFieldValue('subject', e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                errors.subject ? 'border-rose-500 focus:ring-rose-500/40' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-rose-400 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Tên bài tập */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tên bài tập <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Làm bài tập tuần 3, Báo cáo đồ án giữa kỳ..."
              value={values.title}
              onChange={(e) => setFieldValue('title', e.target.value)}
              className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                errors.title ? 'border-rose-500 focus:ring-rose-500/40' : 'border-slate-700 focus:border-indigo-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Hạn nộp & Độ ưu tiên */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hạn nộp */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hạn nộp <span className="text-rose-400">*</span></span>
              </label>
              <input
                type="datetime-local"
                value={values.dueDate}
                onChange={(e) => setFieldValue('dueDate', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  errors.dueDate ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.dueDate && (
                <p className="text-xs text-rose-400 mt-1">{errors.dueDate}</p>
              )}
            </div>

            {/* Độ ưu tiên */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mức độ ưu tiên</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {priorities.map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  const isSelected = values.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFieldValue('priority', p)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 shadow-md'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        color: cfg.color,
                        backgroundColor: cfg.bgColor,
                        borderColor: isSelected ? cfg.color : cfg.borderColor,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mô tả / Ghi chú */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ghi chú thêm (Tuỳ chọn)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Yêu cầu nộp file pdf/zip, link nộp bài LMS, lưu ý chấm điểm..."
              value={values.description}
              onChange={(e) => setFieldValue('description', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Huỷ bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            Lưu bài tập
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Root>
  );
};
