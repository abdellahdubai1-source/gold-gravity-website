"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  FileText,
  MessageSquareText,
  Handshake,
  Mail,
  Image as ImageIcon,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";

export function AdminSidebar({
  locale,
  userEmail,
  open,
  onClose,
}: {
  locale: string;
  userEmail?: string;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  const items = [
    { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
    { href: `${base}/products`, label: "Products", icon: Package },
    { href: `${base}/categories`, label: "Categories", icon: FolderTree },
    { href: `${base}/brands`, label: "Brands", icon: Tag },
    { href: `${base}/pages`, label: "Pages", icon: FileText },
    { href: `${base}/quotes`, label: "Quote Requests", icon: MessageSquareText },
    { href: `${base}/partnerships`, label: "Partnership Requests", icon: Handshake },
    { href: `${base}/contacts`, label: "Contact Messages", icon: Mail },
    { href: `${base}/media`, label: "Media", icon: ImageIcon },
    { href: `${base}/settings`, label: "Settings", icon: Settings },
  ];

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-charcoal/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-champagne-dark text-white font-serif font-bold">
              G
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">Gold Gravity</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href, item.exact)
                      ? "bg-champagne-dark/10 text-champagne-dark"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-slate-100 px-4 py-4">
          {userEmail && <p className="mb-3 truncate px-2 text-xs text-slate-400">{userEmail}</p>}
          <form action={signOut.bind(null, locale)}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </form>
          <Link
            href={`/${locale}`}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors"
          >
            ← View Public Website
          </Link>
        </div>
      </aside>
    </>
  );
}
