import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import RoutePath from "../core/constants/routes.constant";
import { USER_ROLES } from "../core/constants/app.constant";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import HelpCenter from "../pages/public/HelpCenter";


// Super Admin
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import Industries from "../pages/superAdmin/Industries";
import Dealers from "../pages/superAdmin/Dealers";
import Buyers from "../pages/superAdmin/Buyers";
import ScrapCategories from "../pages/superAdmin/ScrapCategories";
import Marketplace from "../pages/superAdmin/Marketplace";
import Auctions from "../pages/superAdmin/Auctions";
import Reports from "../pages/superAdmin/Reports";
import Notifications from "../pages/superAdmin/Notifications";
import Settings from "../pages/superAdmin/Settings";



// Industry
import IndustryDashboard from "../pages/industry/IndustryDashboard";
import MyScrap from "../pages/industry/MyScrap";
import IndustryInventory from "../pages/industry/IndustryInventory";
import IndustrySettings from "../pages/industry/Settings";


// Dealer
import DealerDashboard from "../pages/dealer/DealerDashboard";
import DealerProfile from "../pages/dealer/Profile";

// Buyer
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import BuyerProfile from "../pages/buyer/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route element={<MainLayout />}>
        <Route path={RoutePath.HOME} element={<Home />} />
        <Route path={RoutePath.ABOUT} element={<About />} />
        <Route path={RoutePath.CONTACT} element={<Contact />} />
        <Route path={RoutePath.LOGIN} element={<Login />} />
        <Route path={RoutePath.SIGNUP} element={<Signup />} />
        <Route path={RoutePath.HELP_CENTER} element={<HelpCenter />} />

      </Route>

      {/* ================= DASHBOARD LAYOUT ================= */}

      <Route element={<DashboardLayout />}>

        {/* ================= SUPER ADMIN ================= */}

        <Route
          // element={
          //   <ProtectedRoute
          //     allowedRoles={[USER_ROLES.SUPER_ADMIN]}
          //   />
          // }
        >
          <Route
            path={RoutePath.ADMIN_DASHBOARD}
            element={<SuperAdminDashboard />}
          />

          <Route
            path={RoutePath.ADMIN_INDUSTRIES}
            element={<Industries />}
          />

          <Route
            path={RoutePath.ADMIN_DEALERS}
            element={<Dealers />}
          />

          <Route
            path={RoutePath.ADMIN_BUYERS}
            element={<Buyers />}
          />

          <Route
            path={RoutePath.ADMIN_SCRAP_CATEGORIES}
            element={<ScrapCategories />}
          />

           <Route
            path={RoutePath.ADMIN_MARKETPLACE}
            element={<Marketplace/>}
          />

          <Route
            path={RoutePath.ADMIN_AUCTIONS}
            element={<Auctions/>}
          />

          <Route
            path={RoutePath.ADMIN_REPORTS}
            element={<Reports/>}
          />

          <Route
            path={RoutePath.ADMIN_NOTIFICATIONS}
            element={<Notifications/>}
          />

          <Route
            path={RoutePath.ADMIN_SETTINGS}
            element={<Settings/>}
          />
        </Route>

        {/* ================= INDUSTRY ================= */}

        <Route
          // element={
          //   <ProtectedRoute
          //     allowedRoles={[USER_ROLES.INDUSTRY]}
          //   />
          // }
        >
          <Route
            path={RoutePath.INDUSTRY_DASHBOARD}
            element={<IndustryDashboard />}
          />

           <Route
            path={RoutePath.INDUSTRY_MY_SCRAP}
            element={<MyScrap />} 
          />

          <Route
            path={RoutePath.INDUSTRY_INVENTORY}
            element={<IndustryInventory />}
          />

          <Route
            path={RoutePath.INDUSTRY_SETTINGS}
            element={<IndustrySettings />}
          />

        </Route>

        {/* ================= DEALER ================= */}

        <Route
          // element={
          //   <ProtectedRoute
          //     allowedRoles={[USER_ROLES.DEALER]}
          //   />
          // }
        >
          <Route
            path={RoutePath.DEALER_DASHBOARD}
            element={<DealerDashboard />}
          />

          <Route
            path={RoutePath.DEALER_PROFILE}
            element={<DealerProfile />}
          />
        </Route>

        {/* ================= BUYER ================= */}

        <Route
          // element={
          //   <ProtectedRoute
          //     allowedRoles={[USER_ROLES.BUYER]}
          //   />
          // }
        >
          <Route
            path={RoutePath.BUYER_DASHBOARD}
            element={<BuyerDashboard />}
          />

           <Route
            path={RoutePath.BUYER_REPORTS}
            element={<Reports/>}
          />

          <Route
            path={RoutePath.BUYER_PROFILE}
            element={<BuyerProfile />}
          />
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;