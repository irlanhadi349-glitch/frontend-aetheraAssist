'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { getPesanan, updatePesanan, deletePesanan } from "@/lib/api/pesananApi";
import { Table } from "@/components/table";
import Modal from "@/components/modal";

export default function MonitoringPesanan() {
    const router = useRouter();
    const [pesanan, setPesanan] = useState([]);
    const [kataKunci, setKataKunci] = useState("");
    const [filterStatus, setFilterStatus] = useState("SEMUA");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedPesanan, setSelectedPesanan] = useState(null);
    const [statusBaru, setStatusBaru] = useState("MENUNGGU_KONFIRMASI");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchPesanan = async () => {
        try {
            const res = await getPesanan();
            const dataPesanan = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res)
                ? res
                : [];
            setPesanan(dataPesanan);
        } catch (err) {
            alert(err.message || "Gagal memuat data pesanan.");
            setPesanan([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!getToken()) {
            alert("Silakan login terlebih dahulu!");
            router.push('/login');
            return;
        }
        fetchPesanan();
    }, [router]);

    const jumlahPesanan = pesanan.length;
    const pesananMenunggu = pesanan.filter((item) => item.status === "MENUNGGU_KONFIRMASI").length;
    const pesananDiproses = pesanan.filter((item) => item.status === "DIPROSES").length;
    const pesananSelesai = pesanan.filter((item) => item.status === "SELESAI").length;

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka || 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SELESAI':
                return 'bg-green-500/15 text-green-400 border border-green-500/30';
            case 'DIPROSES':
                return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
            case 'MENUNGGU_KONFIRMASI':
                return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30';
            case 'DIBATALKAN':
                return 'bg-red-500/15 text-red-400 border border-red-500/30';
            default:
                return 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
        }
    };

    const pesananTersaring = pesanan.filter((item) => {
        const cocokStatus =
            filterStatus === "SEMUA" || item.status === filterStatus;
        const teksCari = kataKunci.toLowerCase();
        const cocokKataKunci =
            String(item.id || "").toLowerCase().includes(teksCari) ||
            (item.layanan?.namaJasa || "").toLowerCase().includes(teksCari) ||
            (item.pengguna?.namaLengkap || "").toLowerCase().includes(teksCari);

        return cocokStatus && cocokKataKunci;
    });

    const handleOpenEdit = (item) => {
        setSelectedPesanan(item);
        setStatusBaru(item.status || "MENUNGGU_KONFIRMASI");
    };

    const handleSimpanStatus = async (e) => {
        e.preventDefault();
        if (!selectedPesanan) return;
        setIsSubmitting(true);

        try {
            await updatePesanan(selectedPesanan.id, { status: statusBaru });
            alert("Status pesanan berhasil diperbarui!");
            setSelectedPesanan(null);
            await fetchPesanan();
        } catch (err) {
            alert(err.message || "Gagal memperbarui status pesanan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKonfirmasiHapus = async () => {
        if (!deleteTarget) return;
        setIsSubmitting(true);

        try {
            await deletePesanan(deleteTarget.id);
            alert("Pesanan berhasil dihapus!");
            setDeleteTarget(null);
            await fetchPesanan();
        } catch (err) {
            alert(err.message || "Gagal menghapus pesanan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const kolomPesanan = [
        {
            header: "ID Pesanan",
            accessor: "id",
            className: "font-semibold text-white whitespace-nowrap",
        },
        {
            header: "Layanan",
            accessor: "layanan",
            className: "whitespace-nowrap",
            render: (item) => {
                const gambar = Array.isArray(item.layanan?.foto)
                    ? item.layanan.foto[0]
                    : item.layanan?.foto;
                return (
                    <div className="flex items-center gap-3">
                        <img
                            src={gambar || "/dummy-image.jpg"}
                            alt={item.layanan?.namaJasa || "Layanan"}
                            className="w-10 h-10 rounded-lg object-cover border border-warna-2/60 shrink-0"
                        />
                        <div>
                            <p className="font-semibold text-gray-100">
                                {item.layanan?.namaJasa || "Layanan Tidak Diketahui"}
                            </p>
                            {item.pengguna?.namaLengkap && (
                                <p className="text-xs text-gray-400">
                                    Oleh: {item.pengguna.namaLengkap}
                                </p>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Tanggal Masuk",
            accessor: "tanggalPesan",
            className: "text-gray-300 whitespace-nowrap",
            render: (item) =>
                item.tanggalPesan
                    ? new Date(item.tanggalPesan).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-",
        },
        {
            header: "Total Harga",
            accessor: "totalHarga",
            className: "font-semibold text-gray-200 whitespace-nowrap",
            render: (item) => formatRupiah(item.totalHarga),
        },
        {
            header: "Catatan Pelanggan",
            accessor: "catatan",
            render: (item) => {
                const teksCatatan = item.catatan || item.catatanKebutuhan || "-";
                return (
                    <span
                        className="block text-gray-400 truncate max-w-[220px]"
                        title={teksCatatan}
                    >
                        {teksCatatan}
                    </span>
                );
            },
        },
        {
            header: "Status",
            accessor: "status",
            className: "whitespace-nowrap",
            render: (item) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status
                    )}`}
                >
                    {item.status}
                </span>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="p-6 md:p-8 w-full min-h-screen flex items-center justify-center text-white">
                <p className="text-sm font-medium text-gray-400 animate-pulse">
                    Memuat data pesanan...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 w-full min-h-screen text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Monitoring Pesanan
                </h1>
                <p className="text-gray-400 mt-1 text-sm">
                    Pantau dan kelola status pengerjaan pesanan dari pelanggan.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Total Pesanan
                    </p>
                    <h2 className="text-4xl font-bold text-white mt-auto">
                        {jumlahPesanan}
                    </h2>
                </div>
                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Pending (Menunggu)
                    </p>
                    <h2 className="text-4xl font-bold text-yellow-400 mt-auto">
                        {pesananMenunggu}
                    </h2>
                </div>
                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Sedang Diproses
                    </p>
                    <h2 className="text-4xl font-bold text-blue-400 mt-auto">
                        {pesananDiproses}
                    </h2>
                </div>
                <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Pesanan Selesai
                    </p>
                    <h2 className="text-4xl font-bold text-green-400 mt-auto">
                        {pesananSelesai}
                    </h2>
                </div>
            </div>

            <div className="bg-black rounded-2xl shadow-2xl border border-warna-2 overflow-hidden">
                <div className="bg-gradient-to-r from-warna-2 to-black p-6 border-b border-warna-2 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-white">
                                Daftar Pesanan Operasional
                            </h3>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/70 text-gray-200 border border-warna-2">
                                {pesananTersaring.length} Pesanan
                            </span>
                        </div>

                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                value={kataKunci}
                                onChange={(e) => setKataKunci(e.target.value)}
                                placeholder="Cari ID atau nama layanan..."
                                className="w-full pl-10 pr-4 py-2 bg-black/80 border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/50 transition"
                            />
                            <svg
                                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: "SEMUA", label: "Semua" },
                            { key: "MENUNGGU_KONFIRMASI", label: "Pending" },
                            { key: "DIPROSES", label: "Diproses" },
                            { key: "SELESAI", label: "Selesai" },
                            { key: "DIBATALKAN", label: "Dibatalkan" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setFilterStatus(tab.key)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    filterStatus === tab.key
                                        ? "bg-warna-2 text-white border border-white/20"
                                        : "bg-black/60 text-gray-400 border border-warna-2/40 hover:text-white"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Table
                    columns={kolomPesanan}
                    data={pesananTersaring}
                    onEdit={handleOpenEdit}
                    onDelete={(item) => setDeleteTarget(item)}
                    emptyMessage="Belum ada data pesanan yang sesuai."
                />
            </div>

            {/* Modal Kelola Status Pesanan */}
            <Modal
                isOpen={Boolean(selectedPesanan)}
                onClose={() => setSelectedPesanan(null)}
                title={`Kelola Pesanan #${selectedPesanan?.id || ""}`}
            >
                {selectedPesanan && (
                    <form onSubmit={handleSimpanStatus} className="flex flex-col gap-4">
                        <div className="bg-warna-2/20 border border-warna-2/50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Layanan:</span>
                                <span className="font-semibold text-white">
                                    {selectedPesanan.layanan?.namaJasa || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Harga:</span>
                                <span className="font-semibold text-green-400">
                                    {formatRupiah(selectedPesanan.totalHarga)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-warna-2/40">
                                <span className="text-xs text-gray-400 block mb-1">
                                    Catatan Kebutuhan Pelanggan:
                                </span>
                                <p className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap bg-black/60 p-3 rounded-lg border border-warna-2/40">
                                    {selectedPesanan.catatan ||
                                        selectedPesanan.catatanKebutuhan ||
                                        "Tidak ada catatan."}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                                Ubah Status Pengerjaan
                            </label>
                            <select
                                value={statusBaru}
                                onChange={(e) => setStatusBaru(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white focus:outline-none focus:border-white/60 transition"
                            >
                                <option value="MENUNGGU_KONFIRMASI">PENDING (Menunggu)</option>
                                <option value="DIPROSES">PROSES (Sedang Dikerjakan)</option>
                                <option value="SELESAI">SELESAI</option>
                                <option value="DIBATALKAN">DIBATALKAN</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-warna-2/40">
                            <button
                                type="button"
                                onClick={() => setSelectedPesanan(null)}
                                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-warna-2 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
                            >
                                {isSubmitting ? "Menyimpan..." : "Simpan Status"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal Konfirmasi Hapus Pesanan */}
            <Modal
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                title="Konfirmasi Hapus Pesanan"
            >
                <div className="flex flex-col gap-5">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Apakah Anda yakin ingin menghapus pesanan{" "}
                        <span className="font-bold text-white">
                            #{deleteTarget?.id}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-warna-2/40">
                        <button
                            type="button"
                            onClick={() => setDeleteTarget(null)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleKonfirmasiHapus}
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
                        >
                            {isSubmitting ? "Menghapus..." : "Hapus Pesanan"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}