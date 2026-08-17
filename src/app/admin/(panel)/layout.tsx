import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already gates /admin, but re-verify here so
  // no admin page ever renders without a valid session.
  const admin = await requireAdmin();
  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
