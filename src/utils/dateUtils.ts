/**
 * Utility functions xử lý ngày giờ và tính toán thời hạn bài tập
 */

export interface TimeRemainingResult {
  formattedText: string;
  isOverdue: boolean;
  days: number;
  hours: number;
  minutes: number;
  urgency: 'overdue' | 'critical' | 'warning' | 'normal' | 'completed';
}

/**
 * Tính toán thời gian còn lại hoặc quá hạn cho bài tập
 * Yêu cầu chức năng 6: Mỗi bài tập hiển thị "Còn X ngày" hoặc "Quá hạn Y ngày"
 */
export function calculateTimeRemaining(
  dueDateStr: string,
  isCompleted: boolean,
  now: Date = new Date()
): TimeRemainingResult {
  if (isCompleted) {
    return {
      formattedText: 'Đã hoàn thành',
      isOverdue: false,
      days: 0,
      hours: 0,
      minutes: 0,
      urgency: 'completed',
    };
  }

  const dueTime = new Date(dueDateStr).getTime();
  const currentTime = now.getTime();
  const diffMs = dueTime - currentTime;

  if (diffMs < 0) {
    const overdueMs = Math.abs(diffMs);
    const overdueMinutes = Math.floor(overdueMs / (1000 * 60));
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));

    let text = '';
    if (overdueDays > 0) {
      text = `Quá hạn ${overdueDays} ngày`;
    } else if (overdueHours > 0) {
      text = `Quá hạn ${overdueHours} giờ`;
    } else {
      text = `Quá hạn ${Math.max(1, overdueMinutes)} phút`;
    }

    return {
      formattedText: text,
      isOverdue: true,
      days: overdueDays,
      hours: overdueHours % 24,
      minutes: overdueMinutes % 60,
      urgency: 'overdue',
    };
  }

  // Còn thời gian
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  let text = '';
  if (days > 0) {
    text = hours > 0 ? `Còn ${days} ngày ${hours} giờ` : `Còn ${days} ngày`;
  } else if (hours > 0) {
    text = `Còn ${hours} giờ ${minutes} phút`;
  } else {
    text = `Còn ${Math.max(1, minutes)} phút`;
  }

  // Xác định urgency
  let urgency: TimeRemainingResult['urgency'] = 'normal';
  if (days === 0 && totalHours <= 6) {
    urgency = 'critical';
  } else if (days <= 1) {
    urgency = 'warning';
  }

  return {
    formattedText: text,
    isOverdue: false,
    days,
    hours,
    minutes,
    urgency,
  };
}

/**
 * Format ngày giờ theo định dạng tiếng Việt: 14:00, 15/10/2026
 */
export function formatDateTimeVi(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  } catch {
    return isoString;
  }
}

/**
 * Format ngày giờ cho input type="datetime-local" (YYYY-MM-DDTHH:mm)
 */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
