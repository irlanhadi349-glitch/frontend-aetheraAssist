"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import {
  getTransaksi,
  buatTransaksi,
  updateStatusTransaksi,
  deleteTransaksi,
} from "@/lib/api/transaksiApi";
import { Table } from "@/components/table";
import Modal from "@/components/modal";

export default function MonitoringTransaksi() {
  const router = useRouter();
  const [transaksi, setTransaksi] = useState([]);
  const [kataKunci, setKataKunci] = useState("");
  const [filterStatus, setFilterStatus] = useState("SEMUA");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [statusLunas, setStatusLunas] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    pesananId: "",
    jumlahBayar: "",
    metodeBayar: "Transfer Bank",
  });

  const fetchTransaksi = async () => {
    try {
      const res = await getTransaksi();
      const dataTransaksi = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setTransaksi(dataTransaksi);
    } catch (err) {
      alert(err.message || "Gagal memuat data transaksi.");
      setTransaksi([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      alert("Silakan login terlebih dahulu!");
      router.push("/login");
      return;
    }
    fetchTransaksi();
  }, [router]);

  const getStatusColor = (isLunas) => {
    if (isLunas === true) {
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    }
    return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  // Kalkulasi metrik keuangan & status transaksi
  const totalTransaksi = transaksi.length;
  const transaksiLunas = transaksi.filter((item) => item.statusLunas === true);
  const transaksiBelumLunas = transaksi.filter(
    (item) => item.statusLunas !== true
  );
  const totalPemasukan = transaksiLunas.reduce(
    (acc, curr) =>
      acc + Number(curr.jumlahBayar ?? curr.pesanan?.totalHarga ?? 0),
    0
  );

  // Filter berdasarkan tab status dan kata kunci pencarian
  const transaksiTersaring = transaksi.filter((item) => {
    const isLunas = item.statusLunas === true;
    const cocokStatus =
      filterStatus === "SEMUA" ||
      (filterStatus === "LUNAS" && isLunas) ||
      (filterStatus === "BELUM_LUNAS" && !isLunas);

    const keyword = kataKunci.toLowerCase();
    const namaJasa =
      item.pesanan?.layanan?.namaJasa || item.namaJasa || "";
    const metode = item.metodeBayar || "";

    const cocokKataKunci =
      String(item.id || "").toLowerCase().includes(keyword) ||
      String(item.pesananId || "").toLowerCase().includes(keyword) ||
      namaJasa.toLowerCase().includes(keyword) ||
      metode.toLowerCase().includes(keyword);

    return cocokStatus && cocokKataKunci;
  });

  const handleOpenTambah = () => {
    setFormData({
      pesananId: "",
      jumlahBayar: "",
      metodeBayar: "Transfer Bank",
    });
    setIsTambahOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedTransaksi(item);

    setIsEditOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimpanTambah = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedPesananId = isNaN(Number(formData.pesananId))
      ? formData.pesananId.trim()
      : Number(formData.pesananId);

    const payload = {
      pesananId: parsedPesananId,
      jumlahBayar: Number(formData.jumlahBayar),
      metodeBayar: formData.metodeBayar,
      statusLunas: false,
    };

    try {
      await buatTransaksi(payload);
      alert("Transaksi berhasil ditambahkan!");
      setIsTambahOpen(false);
      await fetchTransaksi();
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimpanEditStatus = async (e) => {
    e.preventDefault();
    if (!selectedTransaksi) return;
    setIsSubmitting(true);

    try {
      await updateStatusTransaksi(selectedTransaksi.id,  statusLunas );
      alert("Status pembayaran berhasil diperbarui!");
      setIsEditOpen(false);
      setSelectedTransaksi(null);
      await fetchTransaksi();
    } catch (err) {
      alert(err.message || "Gagal memperbarui status transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKonfirmasiHapus = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteTransaksi(deleteTarget.id);
      alert("Transaksi berhasil dihapus!");
      setDeleteTarget(null);
      await fetchTransaksi();
    } catch (err) {
      alert(err.message || "Gagal menghapus transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kolomTransaksi = [
    {
      header: "ID",
      accessor: "id",
      className: "font-semibold text-white whitespace-nowrap",
    },
    {
      header: "Layanan & Pesanan",
      accessor: "pesananId",
      className: "whitespace-nowrap",
      render: (item) => {
        const namaJasa =
          item.pesanan?.layanan?.namaJasa ||
          item.namaJasa ||
          `Pesanan #${item.pesananId}`;
        const fotoRaw = item.pesanan?.layanan?.gambarUrl || item.gambarUrl;
        const gambar = Array.isArray(fotoRaw) ? fotoRaw[0] : fotoRaw;

        return (
          <div className="flex items-center gap-3">
            <img
              src={gambar || "/dummy-image.jpg"}
              alt={namaJasa}
              className="w-10 h-10 rounded-lg object-cover border border-warna-2/60 shrink-0"
            />
            <div>
              <p className="font-semibold text-gray-100">{namaJasa}</p>
              <p className="text-xs text-gray-400">
                ID Pesanan: {item.pesananId ?? "-"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Jumlah Bayar",
      accessor: "jumlahBayar",
      className: "whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-gray-100">
          {formatRupiah(item.jumlahBayar ?? item.pesanan?.totalHarga)}
        </span>
      ),
    },
    {
      header: "Metode Bayar",
      accessor: "metodeBayar",
      className: "whitespace-nowrap",
      render: (item) => (
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-300 border border-gray-700">
          {item.metodeBayar || "-"}
        </span>
      ),
    },
    {
      header: "Status Pembayaran",
      accessor: "statusLunas",
      className: "whitespace-nowrap",
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            item.statusLunas
          )}`}
        >
          {item.statusLunas === true ? "Lunas" : "Belum Lunas"}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 w-full min-h-screen flex items-center justify-center text-white">
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Memuat data transaksi...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full min-h-screen text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Monitoring Transaksi
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Kelola pembayaran dan verifikasi status pelunasan jasa Aethera Assist.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenTambah}
          className="inline-flex items-center justify-center gap-2 bg-warna-2 hover:opacity-90 text-white font-semibold px-5 py-3 rounded-xl shadow-lg border border-white/10 transition cursor-pointer w-fit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Transaksi
        </button>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Total Transaksi
          </p>
          <h2 className="text-4xl font-bold text-white mt-auto">
            {totalTransaksi}
          </h2>
        </div>

        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Sudah Lunas
          </p>
          <h2 className="text-4xl font-bold text-green-400 mt-auto">
            {transaksiLunas.length}
          </h2>
        </div>

        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Belum Lunas
          </p>
          <h2 className="text-4xl font-bold text-yellow-400 mt-auto">
            {transaksiBelumLunas.length}
          </h2>
        </div>

        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Total Pemasukan Lunas
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-blue-400 mt-auto truncate"
            title={formatRupiah(totalPemasukan)}
          >
            {formatRupiah(totalPemasukan)}
          </h2>
        </div>
      </div>

      {/* Tabel Data Transaksi */}
      <div className="bg-black rounded-2xl shadow-2xl border border-warna-2 overflow-hidden">
        <div className="bg-gradient-to-r from-warna-2 to-black p-6 border-b border-warna-2 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">Daftar Transaksi</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/70 text-gray-200 border border-warna-2">
                {transaksiTersaring.length} Item
              </span>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={kataKunci}
                onChange={(e) => setKataKunci(e.target.value)}
                placeholder="Cari ID, layanan, metode..."
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

          {/* Filter Tab Status */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "SEMUA", label: "Semua" },
              { key: "LUNAS", label: "Lunas" },
              { key: "BELUM_LUNAS", label: "Belum Lunas" },
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
          columns={kolomTransaksi}
          data={transaksiTersaring}
          onEdit={handleOpenEdit}
          onDelete={(item) => setDeleteTarget(item)}
          emptyMessage={
            kataKunci
              ? `Transaksi "${kataKunci}" tidak ditemukan.`
              : "Belum ada data transaksi tersedia."
          }
        />
      </div>

      {/* Modal 1: Tambah Transaksi Baru */}
      <Modal
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        title="Tambah Transaksi Baru"
      >
        <form onSubmit={handleSimpanTambah} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              ID Pesanan
            </label>
            <input
              type="text"
              name="pesananId"
              value={formData.pesananId}
              onChange={handleChange}
              required
              placeholder="Contoh: 1"
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Jumlah Bayar (Rp)
            </label>
            <input
              type="number"
              name="jumlahBayar"
              value={formData.jumlahBayar}
              onChange={handleChange}
              required
              min="0"
              placeholder="Contoh: 150000"
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Metode Pembayaran
            </label>
            <select
              name="metodeBayar"
              value={formData.metodeBayar}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white focus:outline-none focus:border-white/60 transition"
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="QRIS">QRIS</option>
              <option value="E-Wallet">E-Wallet (Dana / GoPay / OVO)</option>
              <option value="Tunai">Tunai</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-warna-2/40">
            <button
              type="button"
              onClick={() => setIsTambahOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-warna-2 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Update Status Pembayaran */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Update Status Transaksi #${selectedTransaksi?.id || ""}`}
      >
        {selectedTransaksi && (
          <form
            onSubmit={handleSimpanEditStatus}
            className="flex flex-col gap-4"
          >
            <div className="bg-warna-2/20 border border-warna-2/50 rounded-xl p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">ID Pesanan:</span>
                <span className="font-semibold text-white">
                  #{selectedTransaksi.pesananId ?? "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jumlah Bayar:</span>
                <span className="font-semibold text-green-400">
                  {formatRupiah(
                    selectedTransaksi.jumlahBayar ??
                      selectedTransaksi.pesanan?.totalHarga
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Metode Bayar:</span>
                <span className="font-medium text-gray-200">
                  {selectedTransaksi.metodeBayar || "-"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Status Pembayaran
              </label>
              <select
                value={statusLunas ? "true" : "false"}
                onChange={(e) => setStatusLunas(e.target.value === "true")}
                className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white focus:outline-none focus:border-white/60 transition"
              >
                <option value="false">Belum Lunas</option>
                <option value="true">Lunas</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-warna-2/40">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
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

      {/* Modal 3: Konfirmasi Hapus Transaksi */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus Transaksi"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus transaksi{" "}
            <span className="font-bold text-white">#{deleteTarget?.id}</span>?
            Tindakan ini tidak dapat dibatalkan.
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
              {isSubmitting ? "Menghapus..." : "Hapus Transaksi"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}