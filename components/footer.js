import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--warna-1)] border-t border-[var(--warna-2)] pt-12 pb-6 mt-16 text-gray-400 text-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             
              Aethera Assist
            </h3>
            <p className="leading-relaxed">
              Platform layanan editor praktis dengan hasil berkualitas bagi masyarakat
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Menu Layanan</h4>
            <ul className="space-y-2">
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Desain Grafis</li>
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Edit Video</li>
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Pembuatan Banner</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Pusat Bantuan</h4>
            <ul className="space-y-2">
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Syarat & Ketentuan</li>
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Kebijakan Privasi</li>
              <li className="hover:text-[var(--warna-3)] cursor-pointer transition">Pusat Resolusi</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Layanan Pelanggan</h4>
            <ul className="space-y-2">
              <li>Senin - Minggu: 07:00 - 22:00</li>
              
              <li><Link href="mailto:irlanhadi349@gmail.com" className="hover:text-[var(--warna-3)] transition">irlanhadi349@gmail.com</Link></li>
              <li >
                <Link href="https://wa.me/6285176845642" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition">
                  +62 851 7684 5642
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--warna-2)] pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2026 Aethera Assist. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-[var(--warna-3)] cursor-pointer transition">Keamanan Transaksi</span>
            <span className="hover:text-[var(--warna-3)] cursor-pointer transition">Mitra Internal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}