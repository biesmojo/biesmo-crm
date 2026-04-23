import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Check session on server side
  const session = await auth();

  // if no session, redirect to login page
  if (!session) {
    redirect("/login");
  }
  // redirect di Next.js App Router langsung menggunakan fungsi redirect dari next/navigation
  // menghentikan eksekusi - tidak perlu return karena redirect sudah menghentikan eksekusi

    return (
        <div className="flex h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar user={session.user} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
            {/* flex-1 -> main content mengambil sisa ruang yang tersedia
            setelah sidebar, overflow-y-auto -> jika konten melebihi tinggi layar, akan muncul scrollbar vertikal */}
        </div>
    );
}