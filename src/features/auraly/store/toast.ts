import { create } from 'zustand';

interface ToastState {
  message: string | null;
  key: number;
  show(message: string): void;
  hide(): void;
}

let hideTimer: ReturnType<typeof setTimeout> | undefined;

/** App-wide toast (auto-hides after 2.4 s). */
export const useToast = create<ToastState>()((set) => ({
  message: null,
  key: 0,
  show(message) {
    clearTimeout(hideTimer);
    set((s) => ({ message, key: s.key + 1 }));
    hideTimer = setTimeout(() => set({ message: null }), 2400);
  },
  hide() {
    clearTimeout(hideTimer);
    set({ message: null });
  },
}));

export const toast = (message: string) => useToast.getState().show(message);
