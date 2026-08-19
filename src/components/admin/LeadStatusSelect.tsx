"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions/admin";
import type { LeadStatus } from "@/types/database";

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-50 text-blue-600 border-blue-200",
  contacted: "bg-amber-50 text-amber-600 border-amber-200",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

export function LeadStatusSelect({
  table,
  id,
  status,
}: {
  table: "quote_requests" | "partnership_submissions" | "contact_submissions";
  id: string;
  status: LeadStatus;
}) {
  const [value, setValue] = useState(status);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(next: LeadStatus) {
    setValue(next);
    startTransition(async () => {
      const result = await updateLeadStatus(table, id, next);
      if (!result.success) {
        toast.error(result.error);
        setValue(status);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as LeadStatus)}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium outline-none ${STATUS_STYLES[value]}`}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  );
}
