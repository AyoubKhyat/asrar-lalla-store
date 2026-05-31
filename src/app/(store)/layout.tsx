import ClientShell from "./ClientShell";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientShell>{children}</ClientShell>;
}
