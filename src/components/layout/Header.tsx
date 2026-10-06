import React, { useState, useEffect } from 'react';
import {
  BookOpenCheck,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAppDispatch } from '../../app/hooks';
import { resetToSampleData } from '../../features/deadlines/deadlineSlice';

export interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const dispatch = useAppDispatch();
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      };
      setCurrentDateStr(now.toLocaleDateString('vi-VN', options));
    };
    updateTime();
  }, []);

  const handleResetSample = () => {
    if (window.confirm('Đặt lại danh sách bài tập về dữ liệu mẫu ban đầu?')) {
      dispatch(resetToSampleData());
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100">
              Student Deadline Tracker
            </h1>
            <p className="text-xs text-slate-400">
              {currentDateStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleResetSample}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Khôi phục danh sách mẫu ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dữ liệu mẫu</span>
          </button>

          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenAddModal}
          >
            Thêm bài tập
          </Button>
        </div>
      </div>
    </header>
  );
};