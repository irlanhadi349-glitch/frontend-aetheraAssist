"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ambilLayanan } from "@/lib/api/layananApi";
import CardLayanan from "@/components/CardLayanan";

export default function Beranda() {
  const [daftarLayanan, setDaftarLayanan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await ambilLayanan();
        const dataLayanan = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setDaftarLayanan(dataLayanan);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
        setDaftarLayanan([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayanan();
  }, []);

  return (
    <div className="flex flex-col gap-12 py-8">
      <section className="bg-[var(--warna)] rounded-2xl p-8 md:p-12 border border-[var(--warna-2)]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--warna-2)] opacity-5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Selamat Datang di Aethera Assist!
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl">
            Jaga kualitas media digital Anda dengan mitra muda dari komunitas Aethera.
          </p>
          <div className="flex gap-4 items-center">
            <Link 
              href="/layanan" 
              className="bg-[var(--warna-3)] text-[var(--warna-1)] font-bold px-8 py-3 rounded-md hover:opacity-90 transition inline-block"
            >
              Klaim Promo Layanan
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
           <div>
              <h2 className="text-2xl font-bold text-white">Rekomendasi Layanan Pilihan</h2>
              <p className="text-sm text-gray-400 mt-1">Layanan dengan tingkat kepuasan tinggi</p>
           </div>
        </div>
        
        {isLoading ? (
          <div className="text-center text-[var(--warna-3)] py-10 font-medium">Memuat layanan...</div>
        ) : (
          <div className=" flex overflow-x-auto snap-x  snap-x gap-6 pb-4 items-stretch">
            {daftarLayanan.slice(0,3).map((layanan) => (
              <div key={layanan.id} className="flex-none w-[280px] md:w-[500px] snap-center">
                <CardLayanan
                  key={layanan.id}
                  id={layanan.id}
                  namaJasa={layanan.namaJasa}
                  harga={layanan.harga}
                  deskripsi={layanan.deskripsi}
                  fotoLayanan={layanan.gambarUrl}
                />
              </div>
            ))}
            <Link 
              href="/layanan" 
              className="border border w-auto text-white font-medium rounded-xl p-4 flex items-center justify-center text-center hover: transition-colors h-auto"
            >
              Eksplor Semua Layanan
            </Link>
          </div>
        )}
      </section>

      <section className="bg-[var(--warna-2)] rounded-2xl p-8 md:p-12 border border-[var(--warna-1)] shadow-xl text-center">
        <span className=" text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block">Standar Layanan</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Kenapa Ratusan Pelanggan Memilih Kami
        </h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-sm">
          Kami menerapkan pengawasan mutu ketat untuk menjamin keamanan dan kenyamanan kebutuhan desain Anda.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-[var(--warna-1)] p-6 rounded-xl border ">
            <div className="w-12 h-12 bg-[var(--warna-3)]/10  rounded-lg flex items-center justify-center mb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Ahli Profesional</h3>
            <p className="text-gray-400 text-sm">Dikerjakan oleh profesional berpengalaman untuk hasil yang maksimal dan memuaskan.</p>
          </div>
          <div className="bg-[var(--warna-1)] p-6 rounded-xl border ">
            <div className="w-12 h-12 bg-[var(--warna-3)]/10  rounded-lg flex items-center justify-center mb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Garansi Kepuasan</h3>
            <p className="text-gray-400 text-sm">Keluhan pada hasil pengerjaan? Kami revisi kembali tanpa biaya tambahan sama sekali.</p>
          </div>
          <div className="bg-[var(--warna-1)] p-6 rounded-xl border  ">
            <div className="w-12 h-12 bg-[var(--warna-3)]/10  rounded-lg flex items-center justify-center mb-4">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Transparan & Aman</h3>
            <p className="text-gray-400 text-sm">Harga pasti di muka tanpa biaya tersembunyi. Dana aman hingga pekerjaan selesai disetujui.</p>
          </div>
        </div>
      </section>
    </div>
  );
}