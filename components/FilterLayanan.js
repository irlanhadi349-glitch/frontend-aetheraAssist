"use client";

export default function FilterLayanan({ kataKunci, setKataKunci }) {
  return (
    <div className="mb-8">
      <div className="relative w-full md:w-1/2">
        <input
          type="text"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
          placeholder="Cari layanan (contoh: Poster, Video)..."
          className="w-full p-4 pl-12 bg-[var(--warna-2)] border border-[var(--warna-2)] rounded-xl text-white focus:outline-none focus:border-[var(--warna-3)] transition placeholder-gray-500"
        />
        <svg className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>
  );
}