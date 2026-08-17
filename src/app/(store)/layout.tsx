import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSettings } from "@/lib/settings";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar storeName={settings.storeName} />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings.storeName}
        whatsappNumber={settings.whatsappNumber}
        description={settings.storeDescription}
      />
    </div>
  );
}
