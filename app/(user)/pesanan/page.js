'use client';
import { useEffect, useState } from "react";
import CardPesanan from "@/components/cardpesanan";
import { getPesananSaya } from "@/lib/api/pesananApi";
import FilterLayanan from "@/components/FilterLayanan";
import { getToken,clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HalamanPesanan() {
    const [daftarPesanan, setDaftarPesanan] = useState([]);
    const [kataKunci, setKataKunci] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!getToken()) {
            alert("Silakan login terlebih dahulu");
            router.push('/login');
            return;
        }

        const fetchPesanan = async () => {
            try {
                const res = await getPesananSaya();
                const dataPesanan = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                    ? res
                    : [];
                setDaftarPesanan(dataPesanan);
            } catch (err) {
               const pesanError = err.message || "";
                if (
                    pesanError.toLowerCase().includes("token") ||
                    pesanError.toLowerCase().includes("kadaluarsa") ||
                    pesanError.toLowerCase().includes("unauthorized") ||
                    err.status === 401 ||
                    err.status === 403
                ) {
                    clearToken();
                    alert("Sesi Anda telah berakhir. Silakan login kembali.");
                    router.replace('/login');
                    return;
                }

                alert(pesanError);
                setDaftarPesanan([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPesanan();
    }, [router]);

    const pesananTersaring = daftarPesanan.filter((pesanan) => {
        const namaJasa = pesanan.layanan?.namaJasa || "";
        return namaJasa.toLowerCase().includes(kataKunci.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="text-sm font-bold py-20">
                Sedang memuat...
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-black">
            <div className="m-8">
                <div className="w-full">
                    <h2 className="font-bold text-4xl">Daftar Pesanan</h2>
                    <p className="py-4">ini adalah daftar pesanan untuk informasi lebih lanjut silahkan hubungi CS yang tersedia!</p>
                    <FilterLayanan kataKunci={kataKunci} setKataKunci={setKataKunci} />
                </div>
            </div>

            {pesananTersaring.length > 0 ? (
                pesananTersaring.map((p) => {
                    const gambarLayanan = Array.isArray(p.layanan?.gambarUrl)
                        ? p.layanan.gambarUrl[0]
                        : p.layanan?.gambarUrl;

                    return (
                        <CardPesanan
                            key={p.id}
                            id={p.id}
                            namaJasa={p.layanan?.namaJasa || "Layanan"}
                            gambar={gambarLayanan || "/dummy-image.jpg"}
                            status={p.status}
                            harga={p.Harga}
                        />
                    );
                })
            ) : (
                <div className="mx-auto">
                    data {kataKunci} tidak ditemukan
                </div>
            )}
        </div>
    );
}