import Navbar from "../../components/Navbar";
import Footer from "../../components/footer"; 

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--warna-1)] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
}