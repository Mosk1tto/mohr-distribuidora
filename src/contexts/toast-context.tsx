"use client";

import { createContext, useCallback, useMemo, useState } from "react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: Toast["type"] = "success", duration = 3000) => {
      const id = crypto.randomUUID();

      setToasts((current) => [...current, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((current) => current.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}