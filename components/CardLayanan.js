import Link from "next/link";

export default function CardLayanan({ id, namaJasa, harga, deskripsi, fotoLayanan }) {
  const gambarUrl = Array.isArray(fotoLayanan) ? fotoLayanan[0] : fotoLayanan;

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full border border-gray-800 hover:border-warna-3 transition duration-300 shadow-lg group">
      <div className="w-full h-40 bg-gray-800 relative overflow-hidden">
        <img
          src={gambarUrl || "/dummy-image.jpg"}
          alt={`Gambar ${namaJasa}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-warna opacity-40 group-hover:opacity-10 transition duration-300"></div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{namaJasa}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 flex-grow">
          {deskripsi}
        </p>

        <div className="mb-5">
          <p className="font-bold text-xl text-white">
            Rp {harga?.toLocaleString("id-ID")} <span className="text-xs font-normal text-gray-400">/ unit</span>
          </p>
        </div>

        <Link
          href={`/layanan/${id}`}
          className="block w-full text-center text-white font-bold py-2.5 rounded-lg hover:opacity-90 hover:bg-white hover:text-black transition bg-warna-2"
        >
          Detail Layanan
        </Link>
      </div>
    </div>
  );
}