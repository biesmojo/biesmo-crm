"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    FileText,
    LogOut,
} from "lucide-react";

// tipe untuk props user
interface SidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
    };
}

// definisi menu navigasi
const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Customers",
        href: "/customers",
        icon: Users,
    },
    {
        label: "Deals",
        href: "/deals",
        icon: TrendingUp,
    },
    {
        label: "Notes",
        href: "/notes",
        icon: FileText,
    },
];
// kenapa dibuat array di luar komponen? 
// agar tidak dibuat ulang setiap kali komponen dirender
// meningkatkan performa
// kalau mau tambah menu baru, tinggal tambahkan di array ini
// tanpa ubah JSX sama sekali

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    // usePathname -> tahu halaman mana yang sedang aktif
    // untuk highlight menu yang aktif

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">

            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold text-blue-600">
                    Biesmo CRM
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    Sales Management 
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    // isActive -> true jika pathname saat ini sama dengan href menu
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg
                                text-sm font-medium transition-colors
                                ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                        // template literal untuk className -> jika isActive true, beri kelas untuk highlight
                        // kalau aktif -> bg-blue-50 (background biru muda) dan text-blue-600 (teks biru gelap)
                        // kalau tidak aktif -> text-gray-600 (teks abu-abu) dan hover:bg-gray-100 (background abu-abu muda saat hover)
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">

        {/* Info user yang sedang login */}
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user.email}
          </p>
          {/* truncate → kalau teks terlalu panjang,
              otomatis dipotong dengan "..." */}
        </div>

        {/* Tombol Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 w-full
            rounded-lg text-sm font-medium text-red-500
            hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
        {/* callbackUrl: "/login" → setelah logout,
            redirect ke halaman login */}

      </div>
    </aside>
  )
}
            
