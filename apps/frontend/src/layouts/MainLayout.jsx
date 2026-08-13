import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="app-shell min-h-screen flex flex-col bg-[#F8FAFC]">
      <main className="flex-1 pt-[76px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
