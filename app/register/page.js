"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/api/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    telepon: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await registerUser(formData);
      alert("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--warna-1)] px-4 py-8">
      <div className="bg-[var(--warna-2)] p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800">
        <div className="text-center mb-8">
           <Link href="/" className="text-2xl font-bold flex items-center justify-center gap-2 mb-2 text-white">
            <span className="w-6 h-6 bg-[var(--warna-3)] rounded-full block"></span>
            Aethera Assist
          </Link>
          <h1 className="text-xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-gray-400 text-sm mt-1">Gabung dan nikmati layanan profesional kami</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="namaLengkap" 
              value={formData.namaLengkap} 
              onChange={handleChange} 
              required 
              className="w-full p-3 bg-[var(--warna-1)] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--warna-3)] focus:border-[var(--warna-3)] transition placeholder-gray-600" 
              placeholder="Nama Lengkap" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full p-3 bg-[var(--warna-1)] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--warna-3)] focus:border-[var(--warna-3)] transition placeholder-gray-600" 
              placeholder="contoh@email.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nomor Telepon</label>
            <input 
              type="text" 
              name="telepon" 
              value={formData.telepon} 
              onChange={handleChange} 
              className="w-full p-3 bg-[var(--warna-1)] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--warna-3)] focus:border-[var(--warna-3)] transition placeholder-gray-600" 
              placeholder="081234567890 (Opsional)" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full p-3 bg-[var(--warna-1)] border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[var(--warna-3)] focus:border-[var(--warna-3)] transition placeholder-gray-600" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[var(--warna-3)] text-[var(--warna-1)] font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition mt-2"
          >
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400 mt-8">
          Sudah punya akun? <Link href="/login" className="text-[var(--warna-3)] font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}