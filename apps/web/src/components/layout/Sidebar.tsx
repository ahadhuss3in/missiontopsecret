"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Outfits", icon: "👗" },
  { href: "/dashboard/products", label: "Products", icon: "🛍️" },
  { href: "/dashboard/accessories", label: "Accessories", icon: "💍" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-100 min-h-screen py-6 px-4">
      <Link href="/" className="text-lg font-black mb-8 block">👗 FashionFit</Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === item.href ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <div className="text-xs text-gray-400 px-3 mb-2">{user?.email}</div>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
