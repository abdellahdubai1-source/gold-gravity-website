import { getPartnershipSubmissionsAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { Handshake, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPartnershipsPage() {
  const submissions = await getPartnershipSubmissionsAdmin();

  return (
    <div>
      <AdminPageHeader title="Partnership Requests" description={`${submissions.length} submission${submissions.length === 1 ? "" : "s"} received`} />

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <Handshake className="h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No partnership submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s: any) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{s.company_name}</p>
                  <p className="text-xs text-slate-400">{new Date(s.created_at).toLocaleString()}</p>
                </div>
                <LeadStatusSelect table="partnership_submissions" id={s.id} status={s.status} />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Info label="Contact Person" value={s.contact_person} />
                <Info label="Country" value={s.country} />
                <Info label="Phone" value={s.phone} />
                <Info label="Email" value={s.email} />
                <Info label="Brand Name" value={s.brand_name} />
                <Info label="Product Category" value={s.product_category} />
                <Info label="Country of Origin" value={s.country_of_origin} />
                <Info label="Website" value={s.company_website} />
              </div>
              {s.message && (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{s.message}</div>
              )}
              {s.catalogue_files?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.catalogue_files.map((f: any, i: number) => (
                    <a
                      key={i}
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-champagne-dark/10 px-3 py-1.5 text-xs font-medium text-champagne-dark hover:bg-champagne-dark/20 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {f.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
