import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="app-shell min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
