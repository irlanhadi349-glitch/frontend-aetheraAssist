"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getToken} from '@/lib/auth';
import {
  ambilLayanan,
  tambahLayanan,
  editLayanan,
  hapusLayanan,
} from "@/lib/api/layananApi";
import { Table } from "@/components/table";
import Modal from "@/components/modal";

export default function MonitoringLayanan() {
  const [layanan, setLayanan] = useState([]);
  const [kataKunci, setKataKunci] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("tambah");
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    namaJasa: "",
    harga: "",
    deskripsi: "",
    foto: "",
  });
  const router = useRouter();


  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLayanan = async () => {
    if (!getToken()) {
    alert("Silakan login terlebih dahulu!");
    router.push("/login");
    return;
  }
    try {
      const res = await ambilLayanan();
      const dataLayanan = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setLayanan(dataLayanan);
    } catch (err) {
      alert(err.message || "Gagal memuat data layanan.");
      setLayanan([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, [router]);

  const totalLayanan = layanan.length;
  const hargaTertinggi =
    totalLayanan > 0
      ? Math.max(...layanan.map((item) => Number(item.harga || 0)))
      : 0;
  const hargaTerendah =
    totalLayanan > 0
      ? Math.min(...layanan.map((item) => Number(item.harga || 0)))
      : 0;
  const rataRataHarga =
    totalLayanan > 0
      ? layanan.reduce((acc, curr) => acc + Number(curr.harga || 0), 0) /
        totalLayanan
      : 0;

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  const layananTersaring = layanan.filter((item) =>
    (item.namaJasa || "").toLowerCase().includes(kataKunci.toLowerCase())
  );

  const handleOpenTambah = () => {
    setModalMode("tambah");
    setSelectedId(null);
    setFormData({
      namaJasa: "",
      harga: "",
      deskripsi: "",
      foto: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode("edit");
    setSelectedId(item.id);
    const fotoString = Array.isArray(item.foto)
      ? item.foto.join(", ")
      : item.foto || "";
    setFormData({
      namaJasa: item.namaJasa || "",
      harga: item.harga ?? "",
      deskripsi: item.deskripsi || "",
      foto: fotoString,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fotoArray = formData.foto
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      namaJasa: formData.namaJasa,
      harga: Number(formData.harga),
      deskripsi: formData.deskripsi,
      foto: fotoArray,
    };

    try {
      if (modalMode === "tambah") {
        await tambahLayanan(payload);
        alert("Layanan berhasil ditambahkan!");
      } else {
        await editLayanan(selectedId, payload);
        alert("Layanan berhasil diperbarui!");
      }
      setIsModalOpen(false);
      await fetchLayanan();
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat menyimpan layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKonfirmasiHapus = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await hapusLayanan(deleteTarget.id);
      alert("Layanan berhasil dihapus!");
      setDeleteTarget(null);
      await fetchLayanan();
    } catch (err) {
      alert(err.message || "Gagal menghapus layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const kolomLayanan = [
    {
      header: "ID",
      accessor: "id",
      className: "font-semibold text-white whitespace-nowrap",
    },
    {
      header: "Layanan",
      accessor: "namaJasa",
      className: "whitespace-nowrap",
      render: (item) => {
        const gambar = Array.isArray(item.foto) ? item.foto[0] : item.foto;
        return (
          <div className="flex items-center gap-3">
            <img
              src={gambar || "/dummy-image.jpg"}
              alt={item.namaJasa}
              className="w-10 h-10 rounded-lg object-cover border border-warna-2/60 shrink-0"
            />
            <span className="font-semibold text-gray-100">{item.namaJasa}</span>
          </div>
        );
      },
    },
    {
      header: "Harga Dasar",
      accessor: "harga",
      className: "whitespace-nowrap",
      render: (item) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
          {formatRupiah(item.harga)}
        </span>
      ),
    },
    {
      header: "Deskripsi",
      accessor: "deskripsi",
      render: (item) => (
        <span
          className="block text-gray-400 truncate max-w-[300px]"
          title={item.deskripsi}
        >
          {item.deskripsi}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 w-full min-h-screen flex items-center justify-center text-white">
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Memuat data layanan...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full min-h-screen text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Monitoring Layanan
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Kelola katalog, harga, dan ketersediaan jasa Aethera Assist.
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
          Tambah Layanan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Total Layanan
          </p>
          <h2 className="text-4xl font-bold text-white mt-auto">
            {totalLayanan}
          </h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Harga Tertinggi
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-green-400 mt-auto truncate">
            {formatRupiah(hargaTertinggi)}
          </h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Harga Terendah
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mt-auto truncate">
            {formatRupiah(hargaTerendah)}
          </h2>
        </div>
        <div className="flex flex-col bg-gradient-to-br from-warna-2 to-black rounded-xl p-6 shadow-lg border border-warna-2/60 transition hover:-translate-y-1 duration-300">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Rata-rata Harga
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mt-auto truncate">
            {formatRupiah(rataRataHarga)}
          </h2>
        </div>
      </div>

      <div className="bg-black rounded-2xl shadow-2xl border border-warna-2 overflow-hidden">
        <div className="bg-gradient-to-r from-warna-2 to-black p-6 border-b border-warna-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">Daftar Layanan</h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/70 text-gray-200 border border-warna-2">
              {layananTersaring.length} Item
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              placeholder="Cari nama jasa..."
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

        <Table
          columns={kolomLayanan}
          data={layananTersaring}
          onEdit={handleOpenEdit}
          onDelete={(item) => setDeleteTarget(item)}
          emptyMessage={
            kataKunci
              ? `Layanan "${kataKunci}" tidak ditemukan.`
              : "Belum ada data layanan tersedia."
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "tambah" ? "Tambah Layanan Baru" : "Edit Layanan"}
      >
        <form onSubmit={handleSimpan} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Nama Jasa
            </label>
            <input
              type="text"
              name="namaJasa"
              value={formData.namaJasa}
              onChange={handleChange}
              required
              placeholder="Contoh: Desain Logo Profesional"
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Harga Dasar (Rp)
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              required
              min="0"
              placeholder="Contoh: 150000"
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              URL Foto Layanan
            </label>
            <input
              type="text"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              placeholder="https://contoh.com/gambar1.jpg, https://contoh.com/gambar2.jpg"
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Pisahkan dengan tanda koma jika memasukkan lebih dari satu URL gambar.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Deskripsi Layanan
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Jelaskan detail pengerjaan, revisi, dan hasil akhir..."
              className="w-full px-3.5 py-2.5 bg-black border border-warna-2/80 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/60 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-warna-2/40">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-warna-2 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting
                ? "Menyimpan..."
                : modalMode === "tambah"
                ? "Simpan Layanan"
                : "Perbarui Layanan"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Konfirmasi Hapus Layanan"
      >
        <div className="flex flex-col gap-5">
          <p className="text-sm text-gray-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus layanan{" "}
            <span className="font-bold text-white">
              "{deleteTarget?.namaJasa}"
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
              {isSubmitting ? "Menghapus..." : "Hapus Layanan"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}