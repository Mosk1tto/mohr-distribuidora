"use client";

import { useToast } from "@/hooks/use-toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const bgColor =
          toast.type === "success"
            ? "#10b981"
            : toast.type === "error"
            ? "#ef4444"
            : "#3b82f6";

        const textColor = "#ffffff";

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              animation: "slideIn 0.3s ease-out",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: bgColor,
              color: textColor,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                padding: 0,
                color: "inherit",
                opacity: 0.8,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              ✕
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}