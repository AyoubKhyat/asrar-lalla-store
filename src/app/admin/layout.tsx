import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | ASRAR LALLA",
  description: "Tableau de bord administrateur ASRAR LALLA",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
