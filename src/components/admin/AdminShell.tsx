"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({
  locale,
  userEmail,
  children,
}: {
  locale: string;
  userEmail?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar locale={locale} userEmail={userEmail} open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3.5 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-slate-500">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-slate-700">Gold Gravity Admin</span>
        </header>
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
