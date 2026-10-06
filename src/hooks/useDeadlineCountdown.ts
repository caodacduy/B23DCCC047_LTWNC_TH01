/**
 * Buổi 2 — React Custom Hook nâng cao:
 * Tự động tính toán thời gian relative và cập nhật theo interval
 * Yêu cầu 6: Mỗi bài tập hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
 */
import { useState, useEffect } from 'react';
import { calculateTimeRemaining, type TimeRemainingResult } from '../utils/dateUtils';

export function useDeadlineCountdown(
  dueDate: string,
  isCompleted: boolean,
  refreshIntervalMs: number = 60000 // 60 giây
): TimeRemainingResult {
  const [result, setResult] = useState<TimeRemainingResult>(() =>
    calculateTimeRemaining(dueDate, isCompleted)
  );

  useEffect(() => {
    // Cập nhật ngay khi prop thay đổi
    setResult(calculateTimeRemaining(dueDate, isCompleted));

    if (isCompleted) return;

    // Thiết lập timer định kỳ cập nhật số phút/giờ/ngày
    const timer = setInterval(() => {
      setResult(calculateTimeRemaining(dueDate, isCompleted));
    }, refreshIntervalMs);

    return () => clearInterval(timer);
  }, [dueDate, isCompleted, refreshIntervalMs]);

  return result;
}
