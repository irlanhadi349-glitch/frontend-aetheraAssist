"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearToken } from "../lib/auth";

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  return (
    <>
      <nav className="md:hidden w-full bg-warna-2 text-white border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src="/images/aethera.jpeg" className="object-cover w-10 h-10 rounded-full" alt="Logo" />
            <h2 className="text-xl font-bold">Administrator</h2>
          </div>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-300 hover:text-white"
          >
            {isMobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {isMobileOpen && (
          <div className="flex flex-col items-center gap-4 p-4 border-t border-gray-800 bg-warna-2">
            <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="text-[16px] text-gray-300 hover:text-white transition flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </Link>
            <Link href="/monitoring-layanan" onClick={() => setIsMobileOpen(false)} className="text-[16px] text-gray-300 hover:text-white transition flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 12 12 17 22 12" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
              Monitoring Layanan
            </Link>
            <Link href="/monitoring-pesanan" onClick={() => setIsMobileOpen(false)} className="text-[16px] text-gray-300 hover:text-white transition flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
              Monitoring Pesanan
            </Link>
            <Link href="/monitoring-transaksi" onClick={() => setIsMobileOpen(false)} className="text-[16px] text-gray-300 hover:text-white transition flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Monitoring Transaksi
            </Link>
            <Link href="/akun" onClick={() => setIsMobileOpen(false)} className="text-[16px] text-gray-300 hover:text-white transition flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Akun
            </Link>
            <button onClick={handleLogout} className="w-fit bg-red-500 text-white px-10 py-2 rounded-sm font-semibold mt-2">
              Keluar
            </button>
          </div>
        )}
      </nav>

      <aside className="hidden md:flex h-screen w-72 bg-warna-2 flex-col justify-between shadow-md items-center p-6 sticky top-0 shrink-0">
        <div className="flex flex-col gap-10 w-full">
          <div className="flex flex-col justify-center items-center gap-4 pt-6">
            <img src="/images/aethera.jpeg" className="object-cover w-20 h-20 rounded-full" alt="Logo Admin" />
            <h2 className="text-lg font-bold">Administrator</h2>
          </div>
          <div className="flex flex-col gap-6 px-4">
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </Link>
            <Link href="/monitoring-layanan" className="text-sm text-gray-300 hover:text-white transition flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 12 12 17 22 12" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
              Monitoring Layanan
            </Link>
            <Link href="/monitoring-pesanan" className="text-sm text-gray-300 hover:text-white transition flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="15" y2="16" />
              </svg>
              Monitoring Pesanan
            </Link>
            <Link href="/monitoring-transaksi" className="text-sm text-gray-300 hover:text-white transition flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Monitoring Transaksi
            </Link>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-md transition">
          Keluar
        </button>
      </aside>
    </>
  );
}