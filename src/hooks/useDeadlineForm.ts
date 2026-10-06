/**
 * Buổi 2 — React Custom Hook nâng cao:
 * Hook generic quản lý form state, validation và submit
 */
import { useState, useCallback, type FormEvent } from 'react';
import type { CreateDeadlineInput } from '../types/deadline';
import { toDatetimeLocalValue } from '../utils/dateUtils';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface UseDeadlineFormOptions {
  initialValues?: Partial<CreateDeadlineInput>;
  onSubmit: (values: CreateDeadlineInput) => Promise<boolean | void> | boolean | void;
}

export function useDeadlineForm({ initialValues, onSubmit }: UseDeadlineFormOptions) {
  // Mặc định hạn nộp là 3 ngày sau lúc 23:59
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 0, 0);
    return toDatetimeLocalValue(d);
  };

  const [values, setValues] = useState<CreateDeadlineInput>({
    subject: initialValues?.subject || '',
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    dueDate: initialValues?.dueDate || defaultDueDate(),
    priority: initialValues?.priority || 'medium',
  });

  const [errors, setErrors] = useState<FormErrors<CreateDeadlineInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cập nhật từng trường generic
  const setFieldValue = useCallback(<K extends keyof CreateDeadlineInput>(
    field: K,
    value: CreateDeadlineInput[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Xoá lỗi khi người dùng nhập lại
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // Validation function
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors<CreateDeadlineInput> = {};

    if (!values.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tên môn học';
    } else if (values.subject.trim().length < 2) {
      newErrors.subject = 'Tên môn học phải từ 2 ký tự trở lên';
    }

    if (!values.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên bài tập';
    } else if (values.title.trim().length < 3) {
      newErrors.title = 'Tên bài tập phải từ 3 ký tự trở lên';
    }

    if (!values.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn nộp';
    } else {
      const selectedDate = new Date(values.dueDate);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Hạn nộp không hợp lệ';
      }
    }

    if (!values.priority) {
      newErrors.priority = 'Vui lòng chọn mức độ ưu tiên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues({
      subject: '',
      title: '',
      description: '',
      dueDate: defaultDueDate(),
      priority: 'medium',
    });
    setErrors({});
  }, []);

  // Handle submit
  const handleSubmit = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const res = await onSubmit({
        ...values,
        subject: values.subject.trim(),
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
      });
      if (res !== false) {
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, onSubmit, values, resetForm]);

  return {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    setValues,
    validate,
    resetForm,
    handleSubmit,
  };
}
