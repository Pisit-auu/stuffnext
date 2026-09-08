import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronRight } from "./icons";

/** กรอบหน้าเดียวของทั้งระบบ — ทุกหน้าใช้ความกว้างและจังหวะเดียวกัน */
export function PageShell({
  children,
  width = "wide",
  className = "",
}: {
  children: ReactNode;
  width?: "wide" | "narrow" | "form";
  className?: string;
}) {
  const w =
    width === "form" ? "max-w-2xl" : width === "narrow" ? "max-w-4xl" : "max-w-rail";
  return (
    <div className={`mx-auto w-full ${w} px-4 py-6 sm:px-6 sm:py-10 ${className}`}>
      {children}
    </div>
  );
}

export type Crumb = { label: string; href?: string };

/**
 * หน้าลิ้นชัก — หัวเรื่องของทุกหน้า
 * ที่อยู่ (address) อยู่บนสุดเสมอ เพื่อให้รู้ตลอดว่าอยู่ตรงไหนของระบบ
 */
export function PageHeader({
  title,
  code,
  meta,
  trail,
  actions,
  children,
}: {
  title: ReactNode;
  code?: string;
  meta?: ReactNode;
  trail?: Crumb[];
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="drawer-face mb-6 px-4 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
      {trail && trail.length > 0 && (
        <nav aria-label="เส้นทาง" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
            {trail.map((c, i) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                {i > 0 && <IconChevronRight size={12} className="text-edge-strong" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink-2">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {code && (
            <p className="mb-1.5 font-mono text-[0.8125rem] tracking-[0.06em] text-ink-2">
              {code}
            </p>
          )}
          <h1 className="text-2xl font-semibold leading-tight text-ink sm:text-[1.75rem]">
            {title}
          </h1>
          {meta && <div className="mt-2 text-meta text-ink-2">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children && <div className="mt-5">{children}</div>}
    </header>
  );
}

/** แถบเครื่องมือ — ค้นหา กรอง และการกระทำ อยู่ในจังหวะเดียวกันทุกหน้า */
export function Toolbar({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      {children}
    </div>
  );
}

/** หัวข้อย่อยภายในหน้า */
export function SectionTitle({
  children,
  count,
  actions,
}: {
  children: ReactNode;
  count?: number;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <h2 className="text-base font-semibold text-ink">
        {children}
        {typeof count === "number" && (
          <span className="ml-2 font-mono text-meta font-normal text-ink-3">
            {count.toLocaleString("th-TH")}
          </span>
        )}
      </h2>
      {actions}
    </div>
  );
}
