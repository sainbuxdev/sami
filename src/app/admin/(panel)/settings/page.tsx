import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Store Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update your store details and the WhatsApp number used across the site.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
