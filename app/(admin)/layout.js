import Sidebar from "../../components/Sidebar";
import HeaderAdmin from "../../components/HeaderAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row text-white">
      <Sidebar />
      <div className="flex-1">
        <main className="flex-grow container  p-4">{children}</main>
      </div>
    </div>
  );
}