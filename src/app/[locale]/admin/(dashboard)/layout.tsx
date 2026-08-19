import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Locale } from "@/i18n/config";

// Defense-in-depth: middleware already redirects unauthenticated
// visitors to /admin/login, but every server component here also
// reads the session directly so no admin data is ever fetched for a
// signed-out request even if middleware is bypassed some other way.
export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AdminShell locale={params.locale} userEmail={user?.email}>
      {children}
    </AdminShell>
  );
}
