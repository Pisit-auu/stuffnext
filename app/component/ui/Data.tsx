import type { ReactNode } from "react";
import { IconAlert, IconInfo } from "./icons";

/* ── แถบรหัส — ลายเซ็นของระบบ ────────────────────────────── */

export function CodeTag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`tag-strip font-mono ${className}`}>{children}</span>;
}

/* ── สถานะ — สีถูกจองความหมายไว้แล้ว ────────────────────── */

export type StatusTone = "stock" | "tag" | "neutral" | "alert";

const tones: Record<StatusTone, string> = {
  stock: "border-stock/35 bg-stock-soft text-stock",
  tag: "border-tag/35 bg-tag-soft text-tag",
  neutral: "border-edge-strong bg-sunk text-ink-2",
  alert: "border-alert/35 bg-alert-soft text-alert",
};

export function StatusChip({
  tone = "neutral",
  children,
  icon,
}: {
  tone?: StatusTone;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[0.75rem] leading-5 ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* ── ขีดนับ — อ่านยอดคงเหลือได้โดยไม่ต้องอ่านตัวเลข ─────── */

export function TickBar({
  available,
  out = 0,
  broken = 0,
  max = 14,
  label,
}: {
  available: number;
  /** ถูกยืมออกไปแล้ว — ขีดสีส้ม */
  out?: number;
  /** ชำรุด ใช้งานไม่ได้ — ขีดสีเทา ไม่ใช่สีสถานะ */
  broken?: number;
  max?: number;
  label?: string;
}) {
  const total = available + out + broken;
  const text =
    label ??
    `พร้อมใช้ ${available} จากทั้งหมด ${total}` +
      (out ? ` · ถูกยืมออก ${out}` : "") +
      (broken ? ` · ใช้งานไม่ได้ ${broken}` : "");

  if (total === 0) {
    return (
      <span className="inline-flex items-center gap-1.5" title={text}>
        <span className="tick tick--none" aria-hidden="true" />
        <span className="font-mono text-meta text-ink-3">0</span>
        <span className="sr-only">{text}</span>
      </span>
    );
  }

  const scale = total > max ? max / total : 1;
  const shown = (n: number) => (n > 0 ? Math.max(1, Math.round(n * scale)) : 0);
  const shownAvailable = shown(available);
  const shownOut = shown(out);
  const shownBroken = shown(broken);

  return (
    <span className="inline-flex items-center gap-2" title={text}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {Array.from({ length: shownAvailable }, (_, i) => (
          <span key={`a${i}`} className="tick" />
        ))}
        {Array.from({ length: shownOut }, (_, i) => (
          <span key={`o${i}`} className="tick tick--out" />
        ))}
        {Array.from({ length: shownBroken }, (_, i) => (
          <span key={`b${i}`} className="tick tick--none" />
        ))}
      </span>
      <span className="font-mono text-meta text-ink-2">
        {available}
        <span className="text-ink-3">/{total}</span>
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

/* ── ตัวเลขสรุป ─────────────────────────────────────────── */

export function Stat({
  label,
  value,
  tone = "neutral",
  sub,
}: {
  label: string;
  value: ReactNode;
  tone?: StatusTone;
  sub?: ReactNode;
}) {
  const color =
    tone === "stock" ? "text-stock" : tone === "tag" ? "text-tag" : "text-ink";
  return (
    <div className="border-l border-edge pl-3">
      <div className="text-meta text-ink-3">{label}</div>
      <div className={`font-mono text-xl leading-tight ${color}`}>{value}</div>
      {sub && <div className="mt-0.5 text-meta text-ink-3">{sub}</div>}
    </div>
  );
}

/* ── สถานะว่าง / กำลังโหลด / ผิดพลาด ────────────────────── */

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="plate flex flex-col items-center gap-2 px-6 py-14 text-center">
      <IconInfo size={22} className="text-ink-3" />
      <p className="text-base font-medium text-ink">{title}</p>
      {description && <p className="max-w-md text-meta text-ink-2">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="plate flex flex-col items-center gap-2 border-alert/40 px-6 py-12 text-center"
    >
      <IconAlert size={22} className="text-alert" />
      <p className="text-base font-medium text-ink">{title}</p>
      {description && <p className="max-w-md text-meta text-ink-2">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-[1px] bg-sunk ${className}`}
    />
  );
}

/* ── ตาราง — เรขาคณิตเดียวทั้งระบบ ───────────────────────
   จอกว้างเป็นตารางจริง จอแคบยุบเป็นแผ่นป้ายเรียงกัน
   โดยที่แถบรหัสยังอ่านออกเหมือนเดิม                        */

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** ใช้เป็นหัวแผ่นป้ายบนจอแคบ */
  primary?: boolean;
  /** ไปอยู่ท้ายแผ่นป้ายบนจอแคบ */
  actions?: boolean;
  align?: "left" | "right";
  width?: string;
  /** ซ่อนบนจอแคบเพื่อไม่ให้แผ่นป้ายยาวเกินไป */
  hideOnCard?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  empty,
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  empty: ReactNode;
  caption?: string;
}) {
  if (loading) return <TableSkeleton columns={columns.length} />;
  if (rows.length === 0) return <>{empty}</>;

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const actions = columns.filter((c) => c.actions);
  const details = columns.filter((c) => c !== primary && !c.actions && !c.hideOnCard);

  return (
    <>
      {/* จอกว้าง */}
      <div className="plate hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-base">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-edge bg-[#f7f7f5]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={`px-3 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-2 ${
                    c.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="tag-row border-b border-edge last:border-b-0 transition-colors duration-[var(--dur)] hover:bg-[#fafaf8]"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-3 py-2.5 align-middle ${
                      c.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* จอแคบ */}
      <ul className="space-y-2 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="tag-row plate px-3.5 py-3">
            <div className="mb-2.5">{primary.render(row)}</div>
            <dl className="space-y-1.5 border-t border-edge pt-2.5">
              {details.map((c) => (
                <div key={c.key} className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 text-meta text-ink-3">{c.header}</dt>
                  <dd className="min-w-0 text-right text-base">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-edge pt-3">
                {actions.map((c) => (
                  <div key={c.key} className="contents">
                    {c.render(row)}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export function TableSkeleton({ columns = 4, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="plate divide-y divide-edge" aria-busy="true" aria-live="polite">
      <span className="sr-only">กำลังโหลดข้อมูล</span>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4 px-3 py-3.5">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton
              key={c}
              className={`h-4 ${c === 0 ? "w-40" : c === columns - 1 ? "w-20" : "w-24"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
