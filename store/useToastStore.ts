import { create } from 'zustand';

import { createId } from '@/lib/utils/id';

export type ToastType = 'error' | 'success' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  show: (type: ToastType, message: string) => void;
  dismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 3600;

/**
 * A tiny transient-message queue. The host ({@link ToastHost}) renders the
 * stack; everything else just calls {@link toast}. Auto-dismisses so a toast is
 * never sticky, and stays dismissable by tap.
 */
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (type, message) => {
    const id = createId();
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, AUTO_DISMISS_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/** Ergonomic helper for non-component code (stores, async handlers). */
export const toast = {
  error: (message: string) => useToastStore.getState().show('error', message),
  success: (message: string) => useToastStore.getState().show('success', message),
  info: (message: string) => useToastStore.getState().show('info', message),
};
