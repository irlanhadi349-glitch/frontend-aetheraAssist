export const dummyPengguna = [
  {
    id: 1,
    namaLengkap: "Irlan Hadi",
    email: "irlan@aethera.id",
    telepon: "087596842678",
    role: "USER",
    createdAt: "2026-10-25T10:00:00Z",
  },
  {
    id: 2,
    namaLengkap: "Amanda",
    email: "amanda@contoh.com",
    telepon: "081234567890",
    role: "USER",
    createdAt: "2026-10-28T14:30:00Z",
  }
];

export const dummyLayanan = [
  {
    id: 1,
    namaJasa: "Edit AM prem",
    harga: 25000,
    deskripsi: "Pembuatan desain logo orisinal untuk identitas merek, perusahaan, atau UMKM. Termasuk 3 revisi dan file master resolusi tinggi (AI, EPS, PNG, SVG).",
    foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  },
  {
    id: 2,
    namaJasa: "Edit Video Sinematik",
    harga: 500000,
    deskripsi: "Jasa penyuntingan video untuk YouTube, Instagram Reels, atau TikTok. Termasuk color grading, transisi halus, dan penambahan musik.",
    foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  },
  {
    id: 3,
    namaJasa: "Desain Banner & Spanduk",
    harga: 150000,
    deskripsi: "Desain spanduk digital atau cetak untuk keperluan promosi acara, diskon, atau kampanye sosial media. Hasil desain tajam dan siap cetak.",
    foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  },
  {
    id: 4,
    namaJasa: "Pembuatan Animasi 2D",
    harga: 850000,
    deskripsi: "Video animasi 2D untuk explainer, presentasi bisnis, atau edukasi. Termasuk storyboard sederhana dan sulih suara standar.",
    foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  },
  {
    id: 5,
    namaJasa: "Manajemen Konten Sosmed",
    harga: 1200000,
    deskripsi: "Paket pembuatan 15 konten (feed & story) Instagram selama sebulan, lengkap dengan desain visual, copywriting, dan riset hashtag.",
    foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  },
  {
    id: 6,
    namaJasa: "UI/UX Design Web",
    harga: 1500000,
    deskripsi: "Perancangan antarmuka pengguna untuk aplikasi mobile atau website hingga 5 halaman utama menggunakan Figma.",
   foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
  }
];

export const dummyPesanan = [
  {
    id: "ORD-261031-001",
    penggunaId: 1, // ID Irlan Hadi
    layananId: 1,
    status: "PROSES", 
    tanggalPesan: "2026-10-31T09:00:00Z",
    catatan: "Tolong buatkan logo dengan nuansa warna biru gelap dan hijau (seperti tema web Aethera).",
    totalHarga: 250000,
    layanan: { // Relasi data layanan
      namaJasa: "Desain Logo Profesional",
      foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
    }
  },
  {
    id: "ORD-261028-002",
    penggunaId: 1,
    layananId: 2,
    status: "SELESAI",
    tanggalPesan: "2026-10-28T15:20:00Z",
    catatan: "Edit video cinematic durasi 3 menit untuk tugas kuliah.",
    totalHarga: 500000,
    layanan: {
      namaJasa: "Edit Video Sinematik",
      foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
    }
  },
  {
    id: "ORD-261025-003",
    penggunaId: 2, // ID Amanda
    layananId: 5,
    status: "PENDING",
    tanggalPesan: "2026-10-25T11:15:00Z",
    catatan: "Untuk akun instagram toko roti.",
    totalHarga: 1200000,
    layanan: {
      namaJasa: "Manajemen Konten Sosmed",
      foto:["https://cdn-www.bluestacks.com/bs-images/gametiles_com.alightcreative.motion.jpg"]
    }
  }
];