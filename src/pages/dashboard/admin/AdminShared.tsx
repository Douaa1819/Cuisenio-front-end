import type { ReactNode } from "react"
import { cn } from "../../../lib/utils"

export function AdminPanel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">{children}</p>
}

export function StatusPill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
        ok
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      )}
    >
      {children}
    </span>
  )
}
