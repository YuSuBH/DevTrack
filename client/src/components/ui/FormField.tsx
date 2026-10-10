import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormField({ label, htmlFor, error, children, required }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}{required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputBase =
  'w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-600 transition-colors';

export const inputCls    = inputBase;
export const inputErrCls = `${inputBase} border-red-700 focus:border-red-600 focus:ring-red-800`;
