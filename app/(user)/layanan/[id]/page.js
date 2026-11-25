"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ambilDetailLayanan, ambilLayanan } from "@/lib/api/layananApi";
import { buatPesanan } from "@/lib/api/pesananApi";
import { getToken, clearToken } from "@/lib/auth";
import Modal from "@/components/modal";
import CardLayanan from "@/components/CardLayanan";

export default function DetailLayanan() {
  const { id } = useParams();
  const router = useRouter();
  const [layanan, setLayanan] = useState(null);
  const [daftarLayanan, setDaftarLayanan] = useState([]);
  const [fotoAktif, setFotoAktif] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resDetail = await ambilDetailLayanan(id);
        const detailData = resDetail?.data || resDetail;
        setLayanan(detailData);
        setFotoAktif(0);
      } catch (err) {
        alert(err.message);
        setLayanan(null);
      } finally {
        setIsLoading(false);
      }

      try {
        const resSemua = await ambilLayanan();
        const listData = Array.isArray(resSemua?.data)
          ? resSemua.data
          : Array.isArray(resSemua)
          ? resSemua
          : [];
        setDaftarLayanan(listData);
      } catch {
        setDaftarLayanan([]);
      }
    };

    fetchData();
  }, [id]);

  const handleBukaModal = () => {
    if (!getToken()) {
      alert("Silakan login terlebih dahulu.");
      router.replace("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const handlePesan = async (e) => {
    e.preventDefault();
    if (!getToken()) {
      alert("Silakan login terlebih dahulu.");
      router.replace("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const layananId = isNaN(Number(id)) ? id : Number(id);
      await buatPesanan({ layananId, catatanKebutuhan: catatan });
      alert("Pesanan berhasil dibuat!");
      setCatatan("");
      setIsModalOpen(false);
      router.push("/pesanan");
    } catch (error) {
      const pesanError = error.message || "";
      if (
        pesanError.toLowerCase().includes("token") ||
        pesanError.toLowerCase().includes("kadaluarsa") ||
        pesanError.toLowerCase().includes("unauthorized") ||
        error.status === 401 ||
        error.status === 403
      ) {
        clearToken();
        setIsModalOpen(false);
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        router.replace("/login");
        return;
      }
      alert(pesanError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Memuat...</div>;
  }

  if (!layanan) {
    return <div className="text-center p-10">Layanan tidak ditemukan.</div>;
  }

  const fotoList = Array.isArray(layanan.gambarUrl) && layanan.gambarUrl.length > 0
    ? layanan.gambarUrl
    : layanan.gambarUrl && !Array.isArray(layanan.gambarUrl)
    ? [layanan.gambarUrl]
    : ["/dummy-image.jpg"];

  const thumbnailList = [
    fotoList[0],
    fotoList[1] || fotoList[0],
    fotoList[2] || fotoList[0],
    fotoList[3] || fotoList[0],
  ];

  const layananLainnya = daftarLayanan.filter(
    (item) => String(item.id) !== String(id)
  );

  return (
    <>
      <div className="w-full mx-auto mb-10 border p-6 rounded-lg shadow-md mt-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 min-w-0">
            <img
              src={thumbnailList[fotoAktif] || fotoList[0]}
              alt={layanan.namaJasa}
              className="w-full h-96 lg:h-[600px] object-cover rounded-md"
            />
          </div>
          <div className="p-4 flex lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:snap-y lg:h-[600px] lg:flex-none gap-2 overflow-x-auto snap-x">
            {thumbnailList.map((src, index) => (
              <div
                key={index}
                onClick={() => setFotoAktif(index)}
                className={`flex-none snap-center cursor-pointer rounded overflow-hidden border-2 ${
                  fotoAktif === index ? "border-warna-2" : "border-transparent"
                }`}
              >
                <img
                  src={src}
                  alt={`${layanan.namaJasa} ${index + 1}`}
                  className="w-60 h-48 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold mb-2">{layanan.namaJasa}</h1>
          <p className="text-2xl font-semibold mb-4">
            Rp {Number(layanan.harga || 0).toLocaleString("id-ID")}
          </p>
          <div className="text-gray-400 mb-6 whitespace-pre-wrap">
            {layanan.deskripsi}
          </div>
          <button
            onClick={handleBukaModal}
            className="w-full bg-warna-2 text-white font-bold py-3 rounded-md hover:bg-blue-700"
          >
            Pesan Jasa Ini
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Pesan ${layanan.namaJasa}`}
        >
          <form onSubmit={handlePesan} className="flex flex-col gap-4">
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="border p-2 rounded-md h-32 w-full text-black"
              placeholder="Detail kebutuhan..."
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 text-blue-900 font-bold py-2 rounded-md hover:bg-amber-400 disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pesanan"}
            </button>
          </form>
        </Modal>
      </div>

      {layananLainnya.length > 0 && (
        <div className="md:flex md:overflow-x-auto snap-x gap-6 pb-4 items-stretch">
          {layananLainnya.map((item) => (
            <div
              key={item.id}
              className="flex-none w-[280px] md:w-[320px] snap-center"
            >
              <CardLayanan
                id={item.id}
                namaJasa={item.namaJasa}
                harga={item.harga}
                deskripsi={item.deskripsi}
                fotoLayanan={item.gambarUrl}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
} 