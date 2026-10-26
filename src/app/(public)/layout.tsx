import { Header } from "@/components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { tripService } from "@/domain/services/tripService";

export const revalidate = 3600;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [regions, interests] = await Promise.all([tripService.getRegions(), tripService.getInterests()]);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header regions={regions} interests={interests} />
      <main className="flex-1">{children}</main>
      <Footer regions={regions} interests={interests} />
    </div>
  );
}
