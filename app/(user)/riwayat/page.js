'use client';
import { useEffect, useState } from "react";
import CardPesanan from "@/components/cardpesanan";
import { getTransaksiById } from "@/lib/api/transaksiApi";
import FilterLayanan from "@/components/FilterLayanan";
import Link from "next/link";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function HalamanTransaksi() {
    const [daftarTransaksi, setDaftarTransaksi] = useState([]);
    const [kataKunci, setKataKunci] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!getToken()) {
            alert("Silakan login terlebih dahulu");
            router.push('/login');
            return;
        }

        const fetchTransaksi = async () => {
            try {
                const res = await getTransaksiById();
                const dataTransaksi = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res)
                    ? res
                    : [];
                setDaftarTransaksi(dataTransaksi);
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
                setDaftarTransaksi([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransaksi();
    }, [router]);

    const transaksiTersaring = daftarTransaksi.filter((transaksi) => {
        const namaJasa =
            transaksi.pesanan?.layanan?.namaJasa ||
            transaksi.layanan?.namaJasa ||
            transaksi.namaJasa ||
            "";
        return namaJasa.toLowerCase().includes(kataKunci.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="text-sm font-bold py-20 text-center text-white">
                Sedang memuat...
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-black min-h-screen text-white">
            <div className="m-8">
                <div className="w-full">
                    <h2 className="font-bold text-4xl">Daftar Transaksi</h2>
                    <p className="py-4 text-gray-300">
                        Ini adalah daftar transaksi Anda. Untuk informasi lebih lanjut silakan hubungi CS yang tersedia!
                    </p>
                    <FilterLayanan kataKunci={kataKunci} setKataKunci={setKataKunci} />
                </div>
            </div>

            {transaksiTersaring.length > 0 ? (
                transaksiTersaring.map((t) => {
                    const namaJasa =
                        t.pesanan?.layanan?.namaJasa ||
                        t.layanan?.namaJasa ||
                        t.namaJasa ||
                        "Transaksi Layanan";
                    const fotoRaw =
                        t.pesanan?.layanan?.gambarUrl ||
                        t.layanan?.gambarUrl ||
                        t.pesanan?.layanan?.foto ||
                        t.layanan?.foto;
                    const gambarLayanan = Array.isArray(fotoRaw) ? fotoRaw[0] : fotoRaw;
                    const hargaTransaksi =
                        t.jumlahBayar ??
                        t.pesanan?.totalHarga ??
                        t.pesanan?.layanan?.harga ??
                        t.layanan?.harga ??
                        0;
                    const statusTransaksi =
                        t.statusLunas === true ? "Lunas" : "Belum Lunas";

                    return (
                        <CardPesanan
                            key={t.id}
                            id={t.id}
                            namaJasa={namaJasa}
                            gambar={gambarLayanan || "/dummy-image.jpg"}
                            status={statusTransaksi}
                            harga={hargaTransaksi}
                        />
                    );
                })
            ) : (
                <div className="mx-auto py-8 text-gray-400">
                    {kataKunci
                        ? `Data "${kataKunci}" tidak ditemukan`
                        : "Belum ada riwayat transaksi."}
                </div>
            )}

            <div className="flex flex-col items-center m-8">
                <img
                    src="/images/qris.jpeg"
                    alt="Informasi Pembayaran Aethera"
                    className="object-cover w-80 h-80 max-w-full rounded-xl border border-warna-2/60"
                />
                <Link
                    href="https://wa.me/6285176845642"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-medium rounded-md px-6 py-4 m-4 bg-warna-2 text-white hover:bg-white hover:text-gray-800 transition"
                >
                    Kirim bukti pembayaran
                </Link>
            </div>
        </div>
    );
}