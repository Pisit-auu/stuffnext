"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { IconAlert, IconChevronDown, IconSearch } from "./icons";

const control =
  "w-full rounded border border-edge-strong bg-plate px-3 text-base text-ink " +
  "placeholder:text-ink-3 shadow-plate transition-colors duration-[var(--dur)] " +
  "hover:border-ink-3 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15 " +
  "disabled:bg-sunk disabled:text-ink-3 disabled:cursor-not-allowed";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (id: string, describedBy?: string) => ReactNode;
};

export function Field({ label, hint, error, required, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-meta font-medium text-ink-2">
        {label}
        {required && (
          <span className="ml-1 text-ink-3" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-meta text-ink-3">
          {hint}
        </p>
      )}
      {children(id, describedBy)}
      {error && (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-meta text-alert">
          <IconAlert size={15} className="mt-px shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, hint, error, className = "", ...rest }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={rest.required}>
      {(id, describedBy) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...rest}
          className={`${control} h-10 ${error ? "border-alert" : ""} ${className}`}
        />
      )}
    </Field>
  );
}

type SelectFieldProps = {
  label: string;
  hint?: string;
  error?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({
  label,
  hint,
  error,
  className = "",
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={rest.required}>
      {(id, describedBy) => (
        <div className="relative">
          <select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            {...rest}
            className={`${control} h-10 appearance-none pr-9 ${
              error ? "border-alert" : ""
            } ${className}`}
          >
            {children}
          </select>
          <IconChevronDown
            size={16}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
          />
        </div>
      )}
    </Field>
  );
}

type TextAreaFieldProps = {
  label: string;
  hint?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({
  label,
  hint,
  error,
  className = "",
  rows = 3,
  ...rest
}: TextAreaFieldProps) {
  return (
    <Field label={label} hint={hint} error={error} required={rest.required}>
      {(id, describedBy) => (
        <textarea
          id={id}
          rows={rows}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          {...rest}
          className={`${control} py-2 leading-relaxed ${error ? "border-alert" : ""} ${className}`}
        />
      )}
    </Field>
  );
}

/** ช่องค้นหาแบบยืนเดี่ยว — ป้ายกำกับซ่อนไว้ให้โปรแกรมอ่านหน้าจอ */
export function SearchField({
  label,
  className = "",
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <IconSearch
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3"
      />
      <input id={id} type="search" {...rest} className={`${control} h-10 pl-9`} />
    </div>
  );
}

/** ตัวกรองแบบยืนเดี่ยว */
export function FilterSelect({
  label,
  className = "",
  children,
  ...rest
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} {...rest} className={`${control} h-10 appearance-none pr-9`}>
        {children}
      </select>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
      />
    </div>
  );
}

export const controlClass = control;
