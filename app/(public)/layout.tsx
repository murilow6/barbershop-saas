import { PublicNav } from "@/components/layout/PublicNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PublicNav />
      <main>{children}</main>
    </div>
  );
}
