/**
 * Buổi 3 — Redux Toolkit + TypeScript: Typed Hooks
 * Sử dụng useDispatch.withTypes và useSelector.withTypes theo khuyến nghị RTK v2
 */
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed version của useDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// Typed version của useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
