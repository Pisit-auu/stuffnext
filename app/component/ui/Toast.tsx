"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IconAlert, IconCheck, IconClose, IconInfo } from "./icons";

type Tone = "success" | "error" | "info";
type Toast = { id: number; tone: Tone; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/** ใช้แทน alert() ทั้งระบบ — ผลลัพธ์ต้องบอกกลับเสมอ แต่ไม่ขวางการทำงาน */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ต้องอยู่ภายใน ToastProvider");
  return ctx;
}

const tones: Record<Tone, { cls: string; icon: ReactNode }> = {
  success: {
    cls: "border-stock/40 bg-stock-soft text-stock",
    icon: <IconCheck size={17} />,
  },
  error: {
    cls: "border-alert/40 bg-alert-soft text-alert",
    icon: <IconAlert size={17} />,
  },
  info: { cls: "border-edge-strong bg-plate text-ink", icon: <IconInfo size={17} /> },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (tone: Tone, message: string) => {
      const id = ++seq.current;
      setItems((prev) => [...prev.slice(-3), { id, tone, message }]);
      window.setTimeout(() => remove(id), tone === "error" ? 7000 : 4500);
    },
    [remove],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`animate-slide-up pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded border px-3 py-2.5 shadow-lift ${tones[t.tone].cls}`}
          >
            <span className="mt-px shrink-0">{tones[t.tone].icon}</span>
            <p className="min-w-0 flex-1 text-base leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              aria-label="ปิดข้อความ"
              className="-mr-1 shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
            >
              <IconClose size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
