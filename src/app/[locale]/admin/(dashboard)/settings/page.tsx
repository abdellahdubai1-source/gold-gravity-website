import { getSiteSettings, FALLBACK_SETTINGS } from "@/lib/data/queries";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = (await getSiteSettings()) ?? FALLBACK_SETTINGS;

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Global contact details, address, socials and default SEO. Changes apply across the whole website immediately."
      />
      <SettingsForm initial={settings} />
    </div>
  );
}
