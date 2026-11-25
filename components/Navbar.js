"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "../lib/auth";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (getToken()) setIsLogin(true);
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLogin(false);
    router.push("/");
  };

  return (
    <nav className={`p-4 border-b border-[var(--warna-2)] sticky top-0 z-50 ${isScrolled ? "bg-gray-200 border-b-4 border-[var(--warna-2)] text-[var(--warna-2)] shadow-md" : "bg-[var(--warna-1)] text-white"}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <img src="/images/aethera.jpeg" alt="Logo Aethera" className="object-cover w-10 h-10 rounded-full" />
          <h2 className="text-xl font-bold">
            Aethera <span className="text-warna-2">Assist</span>
          </h2>
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          <Link href="/layanan" className="hover:text-[var(--warna-3)] transition">Layanan</Link>
          {isLogin ? (
            <>
              <Link href="/pesanan" className="hover:text-[var(--warna-3)] transition">Pesanan</Link>
              <Link href="/riwayat" className="hover:text-[var(--warna-3)] transition">Riwayat</Link>
              <button onClick={handleLogout} className="hover:text-red-500 transition cursor-pointer">Keluar</button>
            </>
          ) : (
            <Link href="/login" className="bg-[var(--warna-3)] px-5 py-2 text-white rounded-full font-bold hover:opacity-90 transition">
              Masuk
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileOpen && (
          <div className="md:hidden absolute top-full left-0 w-full transition-all duration-300">
            <div className="py-4 bg-gray-100 text-black flex flex-col items-center gap-3 text-sm font-medium border-b-4 border-[var(--warna-2)]">
              <Link href="/layanan" onClick={() => setIsMobileOpen(false)} className="hover:text-[var(--warna-3)] transition">Layanan</Link>
              {isLogin ? (
                <>
                  <Link href="/pesanan" onClick={() => setIsMobileOpen(false)} className="hover:text-[var(--warna-3)] transition">Pesanan</Link>
                  <Link href="/riwayat" onClick={() => setIsMobileOpen(false)} className="hover:text-[var(--warna-3)] transition">Riwayat</Link>
                  <button onClick={handleLogout} className="hover:text-red-500 transition">Keluar</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileOpen(false)} className="text-black px-5 py-2 font-bold hover:opacity-90 transition">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}