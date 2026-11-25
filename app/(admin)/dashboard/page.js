'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {getToken} from '@/lib/auth';
import { getPesanan } from "@/lib/api/pesananApi";
import { ambilLayanan } from "@/lib/api/layananApi";
import { getTransaksi } from "@/lib/api/transaksiApi";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";



export default function Dashboard() {
    const [pesanan, setPesanan] = useState([]);
    const [layanan, setLayanan] = useState([]);
    const [transaksi, setTransaksi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter;

    useEffect(()=>{
        if(!getToken){
            alert("silahkan login terlebih dahulu!");
            router.push('/login')
        }
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resPesanan, resLayanan, resTransaksi] = await Promise.allSettled([
                    getPesanan(),
                    ambilLayanan(),
                    getTransaksi(),
                ]);

                if (resPesanan) {
                    const data = resPesanan.value?.data ?? resPesanan.value;
                    setPesanan(Array.isArray(data) ? data : []);
                }

                if (resLayanan) {
                    const data = resLayanan.value?.data ?? resLayanan.value;
                    setLayanan(Array.isArray(data) ? data : []);
                }

                if (resTransaksi) {
                    const data = resTransaksi.value?.data ?? resTransaksi.value;
                    setTransaksi(Array.isArray(data) ? data : []);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const jumlahPesanan = pesanan.length;
    const pesananMenunggu = pesanan.filter((item) => item.status === "MENUNGGU_KONFIRMASI");
    const pesananDiproses = pesanan.filter((item) => item.status === "DIPROSES");
    const pesananSelesai = pesanan.filter((item) => item.status === "SELESAI");
     const pesananDibatalkan = pesanan.filter((item) => item.status === "DIBATALKAN");

    const pendapatan = pesananSelesai.reduce(
        (total, item) => total + Number(item.totalHarga || 0),
        0
    );
    const potensiPendapatan = pesananDiproses.reduce(
        (total, item) => total + Number(item.totalHarga || 0),
        0
    );

    const totalLayanan = layanan.length;
    const totalTransaksi = transaksi.length;
    const transaksiLunas = transaksi.filter((item) => {
       
        return item.statusLunas === true;
    }).length;

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SELESAI':
                return 'bg-green-500/15 text-green-400 border border-green-500/30';
            case 'DIPROSES':
                return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
            case 'MENUNGGU':
                return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
            case 'DIBATALKAN':
                 return 'bg-red-500/15 text-yellow-400 border border-yellow-500/30';
            default:
                return 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
        }
    };

    const grafikPendapatan = Object.values(
        pesanan.reduce((acc, item) => {
            const dateObj = new Date(item.tanggalPesan);
            const sortKey = isNaN(dateObj.getTime())
                ? "0000-00-00"
                : dateObj.toISOString().split("T")[0];
            const label = isNaN(dateObj.getTime())
                ? "Lainnya"
                : dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });

            if (!acc[sortKey]) {
                acc[sortKey] = { tanggal: label, sortKey, pendapatan: 0, jumlah: 0 };
            }
            acc[sortKey].jumlah += 1;
            if (item.status === "SELESAI") {
                acc[sortKey].pendapatan += Number(item.totalHarga || 0);
            }
            return acc;
        }, {})
    ).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    const dataStatus = [
        { name: "Selesai", value: pesananSelesai.length, color: "#4ade80" },
        { name: "Diproses", value: pesananDiproses.length, color: "#60a5fa" },
        { name: "Menunggu", value: pesananMenunggu.length, color: "#facc15" },
        { name: "Batal", value: pesananDibatalkan.length, color: "#fa1530" },
    ].filter((item) => item.value > 0);

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 w-full min-h-screen flex items-center justify-center text-white">
                <p className="text-sm font-medium text-gray-400 animate-pulse">
                    Memuat data dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 w-full min-h-screen text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1 text-sm">
                    Ringkasan aktivitas dan performa layanan Aethera Assist Anda.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Total Pesanan
                    </p>
                    <h2 className="text-4xl font-bold text-white mt-auto">{jumlahPesanan}</h2>
                </div>

                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Pesanan Selesai
                    </p>
                    <h2 className="text-4xl font-bold text-green-400 mt-auto">
                        {pesananSelesai.length}
                    </h2>
                </div>

                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Sedang Diproses
                    </p>
                    <h2 className="text-4xl font-bold text-blue-400 mt-auto">
                        {pesananDiproses.length}
                    </h2>
                </div>

                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Total Pendapatan
                    </p>
                    <h2
                        className="text-2xl md:text-3xl font-bold text-yellow-400 mt-auto truncate"
                        title={formatRupiah(pendapatan)}
                    >
                        {formatRupiah(pendapatan)}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-black rounded-2xl p-6 shadow-xl border border-warna-2/70">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Grafik Pendapatan Pesanan
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Akumulasi pendapatan selesai berdasarkan tanggal pemesanan
                            </p>
                        </div>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-warna-2/30 text-gray-300 border border-warna-2 w-fit">
                            {grafikPendapatan.length} Periode
                        </span>
                    </div>

                    <div className="w-full h-72">
                        {grafikPendapatan.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={grafikPendapatan}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#1f2937"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="tanggal"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        tickFormatter={(val) =>
                                            val >= 1000 ? `${val / 1000}k` : val
                                        }
                                    />
                                    <Tooltip
                                        cursor={{ fill: "rgba(255,255,255,0.04)" }}
                                        contentStyle={{
                                            backgroundColor: "#000000",
                                            borderColor: "var(--warna-2)",
                                            borderRadius: "10px",
                                            color: "#ffffff",
                                        }}
                                        formatter={(value, name) => [
                                            name === "pendapatan"
                                                ? formatRupiah(value)
                                                : `${value} Pesanan`,
                                            name === "pendapatan" ? "Pendapatan" : "Total Order",
                                        ]}
                                    />
                                    <Bar
                                        dataKey="pendapatan"
                                        fill="#facc15"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={48}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                Belum ada data grafik untuk ditampilkan.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-black rounded-2xl p-6 shadow-xl border border-warna-2/70 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Distribusi Status</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Proporsi status seluruh pesanan masuk
                        </p>
                    </div>

                    <div className="w-full h-56 my-2">
                        {dataStatus.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataStatus}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={52}
                                        outerRadius={80}
                                        paddingAngle={4}
                                    >
                                        {dataStatus.map((entry, idx) => (
                                            <Cell key={idx} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#000000",
                                            borderColor: "var(--warna-2)",
                                            borderRadius: "10px",
                                            color: "#ffffff",
                                        }}
                                        formatter={(value) => [`${value} Pesanan`, "Jumlah"]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                                Tidak ada data status.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-2 border-t border-warna-2/40">
                        {dataStatus.map((item) => (
                            <div key={item.name} className="flex items-center gap-2 text-xs">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-gray-300">
                                    {item.name} ({item.value})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black border border-warna-2/60 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                            Katalog Layanan Aktif
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                            {totalLayanan} Jasa Tersedia
                        </p>
                    </div>
                    <Link
                        href="/monitoring-layanan"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-warna-2 text-white hover:opacity-90 transition"
                    >
                        Kelola
                    </Link>
                </div>

                <div className="bg-black border border-warna-2/60 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                            Total Transaksi API
                        </p>
                        <p className="text-xl font-bold text-white mt-1">
                            {totalTransaksi} Transaksi{" "}
                            <span className="text-xs font-normal text-green-400">
                                ({transaksiLunas} Lunas)
                            </span>
                        </p>
                    </div>
                    <Link
                        href="/monitoring-transaksi"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-warna-2 text-white hover:opacity-90 transition"
                    >
                        Detail
                    </Link>
                </div>

                <div className="bg-black border border-warna-2/60 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                            Menunggu Konfirmasi
                        </p>
                        <p className="text-xl font-bold text-yellow-400 mt-1">
                            {pesananDiproses.length} Pending{" "}
                            <span className="text-xs font-normal text-gray-400">
                                ({formatRupiah(potensiPendapatan)})
                            </span>
                        </p>
                    </div>
                    <Link
                        href="/monitoring-pesanan"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-warna-2 text-white hover:opacity-90 transition"
                    >
                        Pantau
                    </Link>
                </div>
            </div>

            <div className="bg-black rounded-2xl shadow-2xl border border-warna-2 overflow-hidden">
                <div className="bg-gradient-to-r from-warna-2 to-black p-6 border-b border-warna-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-bold text-white">Pesanan Terbaru</h3>
                        <p className="text-xs text-gray-300 mt-0.5">
                            Menampilkan 5 aktivitas pemesanan terakhir dari sistem
                        </p>
                    </div>
                    <Link
                        href="/monitoring-pesanan"
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-black/70 text-white border border-warna-2 hover:bg-warna-2 transition w-fit"
                    >
                        Lihat Semua Pesanan &rarr;
                    </Link>
                </div>

                <div className="overflow-x-auto bg-black">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-warna-2/35 text-gray-300 text-xs uppercase tracking-wider border-b border-warna-2/60">
                                <th className="p-4 font-semibold">ID Pesanan</th>
                                <th className="p-4 font-semibold">Layanan</th>
                                <th className="p-4 font-semibold">Tanggal</th>
                                <th className="p-4 font-semibold">Total Harga</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warna-2/30">
                            {pesanan.slice(0, 5).map((item) => (
                                <tr
                                    key={item.id}
                                    className="odd:bg-black even:bg-warna-2/15 hover:bg-warna-2/35 transition-colors"
                                >
                                    <td className="p-4 text-sm font-semibold text-white">
                                        {item.id}
                                    </td>
                                    <td className="p-4 text-sm text-gray-300 truncate max-w-[200px]">
                                        {item.layanan?.namaJasa || "Layanan Tidak Diketahui"}
                                    </td>
                                    <td className="p-4 text-sm text-gray-300">
                                        {new Date(item.tanggalPesan).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="p-4 text-sm font-semibold text-gray-200">
                                        {formatRupiah(item.totalHarga)}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {pesanan.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 bg-black">
                                        Belum ada data pesanan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}