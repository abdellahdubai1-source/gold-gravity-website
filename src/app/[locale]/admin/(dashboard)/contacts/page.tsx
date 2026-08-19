import { getContactSubmissionsAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const messages = await getContactSubmissionsAdmin();

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description={`${messages.length} message${messages.length === 1 ? "" : "s"} received`} />

      {messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Mail className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m: any) => (
            <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">
                    {m.email} {m.phone && `· ${m.phone}`} · {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <LeadStatusSelect table="contact_submissions" id={m.id} status={m.status} />
              </div>
              {m.subject && <p className="mt-3 text-sm font-medium text-slate-700">{m.subject}</p>}
              <p className="mt-2 text-sm text-slate-600">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
