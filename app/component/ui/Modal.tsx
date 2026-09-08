"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { IconClose } from "./icons";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * ลิ้นชักที่ถูกดึงออกมา — เลื่อนตามแกนเดียว ไม่มีการเด้ง
 * ใช้เฉพาะงานที่ต้องกันสมาธิจริง (ยืม, แก้ไขของในห้อง, ยืนยันการลบ)
 */
export function Modal({
  open,
  onClose,
  title,
  code,
  children,
  footer,
  width = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  code?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: "md" | "lg";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey, true);

    const timer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panelRef.current)?.focus();
    }, 20);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey, true);
      window.clearTimeout(timer);
      restoreRef.current?.focus?.();
    };
  }, [open, handleKey]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`animate-slide-up relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t border border-edge bg-plate shadow-drawer outline-none sm:rounded ${
          width === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
        }`}
      >
        <div className="drawer-face sticky top-0 z-10 flex items-start justify-between gap-3 border-x-0 border-t-0 px-4 pb-4 pt-3.5 sm:px-5">
          <div className="min-w-0">
            {code && (
              <p className="mb-0.5 font-mono text-[0.75rem] tracking-[0.06em] text-ink-3">
                {code}
              </p>
            )}
            <h2 className="text-base font-semibold leading-snug text-ink">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="-mr-1 -mt-1 rounded p-1.5 text-ink-3 transition-colors hover:bg-sunk hover:text-ink"
          >
            <IconClose size={18} />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5">{children}</div>

        {footer && (
          <div className="sticky bottom-0 flex flex-col gap-2 border-t border-edge bg-plate px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** กล่องยืนยันสำหรับการกระทำที่ย้อนกลับไม่ได้ */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="quiet" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description ? (
        <div className="text-base leading-relaxed text-ink-2">{description}</div>
      ) : null}
    </Modal>
  );
}
