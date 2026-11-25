
export default function CardPesanan({ namaJasa, gambar, status, harga }) {
    return (
        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-betwen p-4 rounded-xl border border-gray-700  shadow-md mb-4 hover:border-gray-500 transition">

            <img
                src={gambar}
                alt={namaJasa}
                className="w-full  md:w-36 md:h-32 object-cover rounded-lg"
            />

            <div className="flex flex-col justify-between flex-1 gap-4">

                <div className="flex flex-col gap-3">

                    <p className={`text-xs font-semibold rounded-full px-3 py-1 w-fit ${
                        status === "SELESAI"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : status === "PROSES"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                        {status}
                    </p>

                    <h2 className="font-bold text-xl text-white">
                        {namaJasa}
                    </h2>

                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <p className="text-sm text-gray-400">
                        Total tagihan
                    </p>

                    <h2 className="font-bold text-xl text-white">
                        Rp{Number(harga || 0).toLocaleString('id-ID')}
                    </h2>
                </div>

            </div>
        </div>
    );
}
