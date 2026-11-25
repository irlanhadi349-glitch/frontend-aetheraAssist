"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ambilLayanan } from "@/lib/api/layananApi";
import { getToken } from "@/lib/auth";
import FilterLayanan from "@/components/FilterLayanan";
import CardLayanan from "@/components/CardLayanan";

export default function HalamanLayanan() {
  const router = useRouter();
  const [daftarLayanan, setDaftarLayanan] = useState([]);
  const [kataKunci, setKataKunci] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      alert("Silakan login terlebih dahulu untuk mengakses layanan.");
      router.push("/login");
      return;
    }

    const fetchLayanan = async () => {
      try {
        const res = await ambilLayanan();
        const dataLayanan = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setDaftarLayanan(dataLayanan);
      } catch (err) {
        alert(err.message);
        setDaftarLayanan([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayanan();
  }, [router]);

  const layananTersaring = daftarLayanan.filter((layanan) =>
    (layanan.namaJasa || "").toLowerCase().includes(kataKunci.toLowerCase())
  );

  if (isLoading) {
    return <div className="py-20 text-center text-[var(--warna-3)] font-medium">Memuat katalog jasa...</div>;
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <span className=" text-xs font-bold tracking-widest uppercase block mb-2">KATALOG LAYANAN TERVERIFIKASI</span>
        <div className="flex justify-between items-start border-white md:items-center flex-col md:flex-row gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">Temukan Desainer & Spesialis Media</h1>
          <div className="bg-[var(--warna-3)]/10  text-sm font-medium px-4 py-2 rounded-full border border-[var(--warna-3)]/20 flex items-center gap-2">
            <span className="w-2 h-2 bg-[var(--warna-2)] rounded-full"></span> 100% Ahli Profesional
          </div>
        </div>

        <FilterLayanan kataKunci={kataKunci} setKataKunci={setKataKunci} />
      </div>

      <div className="flex flex-col gap-8">
        <div></div>

        <div>
          <div className="bg-gradient-to-br from-[var(--warna-3)]/10 to-[var(--warna-2)] border border-[var(--warna-3)]/20 rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-gray-400 text-xs mb-4">Konsultasi gratis dengan teknisi dan desainer kami.</p>
              <button className=" text-sm font-bold hover:underline flex items-center gap-1">
                Hubungi CS →
              </button>
            </div>
          </div>
        </div>

        <div className="w-full ">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400 text-sm">
              Menampilkan <span className=" font-bold">{layananTersaring.length} Layanan</span> Terbaik
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {layananTersaring.length > 0 ? (
              layananTersaring.map((layanan) => (
                <CardLayanan
                  key={layanan.id}
                  id={layanan.id}
                  namaJasa={layanan.namaJasa}
                  harga={layanan.harga}
                  deskripsi={layanan.deskripsi}
                  fotoLayanan={layanan.gambarUrl}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10 bg-[var(--warna-2)] rounded-xl border border-gray-800">
                Layanan "{kataKunci}" tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}