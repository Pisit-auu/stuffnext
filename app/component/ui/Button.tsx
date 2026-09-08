"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconSpinner } from "./icons";

/**
 * กฎหมายของสีบังคับที่นี่: ส้ม = การยืมออก, เขียว = การคืน/พร้อมใช้,
 * แดง = การลบ. ปุ่มทั่วไปเป็นหมึกดำ ไม่มีสีตกแต่ง
 */
type Variant = "primary" | "secondary" | "quiet" | "borrow" | "return" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded border font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--dur)] ease-drawer " +
  "disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-plate border-ink hover:bg-[#2c3032] hover:border-[#2c3032] shadow-plate",
  secondary:
    "bg-plate text-ink border-edge-strong hover:border-ink hover:bg-[#fafaf8] shadow-plate",
  quiet: "bg-transparent text-ink-2 border-transparent hover:bg-sunk hover:text-ink",
  borrow:
    "bg-plate text-tag border-tag font-semibold hover:bg-tag-soft shadow-plate",
  return:
    "bg-plate text-stock border-stock hover:bg-stock-soft shadow-plate",
  danger:
    "bg-plate text-alert border-[#e2b7b3] font-semibold hover:bg-alert-soft hover:border-alert shadow-plate",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-meta",
  md: "h-10 px-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** ไอคอนท้ายป้าย ใช้กับการกระทำที่พาไปข้างหน้า เช่น ลูกศร */
  iconAfter?: ReactNode;
  loading?: boolean;
  block?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconAfter,
  loading = false,
  block = false,
  className = "",
  children,
  disabled,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        block ? "w-full" : ""
      } ${className}`}
    >
      {loading ? <IconSpinner size={size === "sm" ? 14 : 16} /> : icon}
      {children}
      {iconAfter}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  iconAfter,
  block = false,
  className = "",
  children,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.ComponentProps<typeof Link>,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        block ? "w-full" : ""
      } ${className}`}
    >
      {icon}
      {children}
      {iconAfter}
    </Link>
  );
}
