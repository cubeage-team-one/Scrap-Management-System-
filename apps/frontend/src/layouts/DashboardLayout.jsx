import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default DashboardLayout;