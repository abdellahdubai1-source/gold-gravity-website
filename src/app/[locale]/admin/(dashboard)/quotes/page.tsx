import { getQuoteRequestsAdmin } from "@/lib/data/admin-queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { MessageSquareText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await getQuoteRequestsAdmin();

  return (
    <div>
      <AdminPageHeader title="Quote Requests" description={`${quotes.length} request${quotes.length === 1 ? "" : "s"} received`} />

      {quotes.length === 0 ? (
        <EmptyBlock />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-start text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 text-start">Date</th>
                <th className="px-5 py-3.5 text-start">Company</th>
                <th className="px-5 py-3.5 text-start">Contact</th>
                <th className="px-5 py-3.5 text-start">Phone</th>
                <th className="px-5 py-3.5 text-start">Brand / Product</th>
                <th className="px-5 py-3.5 text-start">Quantity</th>
                <th className="px-5 py-3.5 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q: any) => (
                <tr key={q.id} className="hover:bg-slate-50/60 transition-colors align-top">
                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-500">
                    {new Date(q.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {q.company_name}
                    <p className="text-xs font-normal text-slate-400">{q.emirate}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {q.contact_person}
                    {q.email && <p className="text-xs text-slate-400">{q.email}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    <a href={`tel:${q.phone}`} className="hover:text-champagne-dark">{q.phone}</a>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {q.brand?.name}
                    {q.product?.name_en && <p className="text-xs text-slate-400">{q.product.name_en}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{q.quantity || "—"}</td>
                  <td className="px-5 py-3.5">
                    <LeadStatusSelect table="quote_requests" id={q.id} status={q.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyBlock() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <MessageSquareText className="h-8 w-8 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">No quote requests yet.</p>
    </div>
  );
}
