import { NavLink, useLocation } from "react-router-dom";
import { sidebarMenus } from "./SidebarConfig";
import { USER_ROLES } from "../../core/constants/app.constant";

const Sidebar = () => {
  const location = useLocation();

  let role = USER_ROLES.INDUSTRY;

  if (location.pathname.startsWith("/admin")) {
    role = USER_ROLES.SUPER_ADMIN;
  } else if (location.pathname.startsWith("/industry")) {
    role = USER_ROLES.INDUSTRY;
  } else if (location.pathname.startsWith("/dealer")) {
    role = USER_ROLES.DEALER;
  } else if (location.pathname.startsWith("/buyer")) {
    role = USER_ROLES.BUYER;
  }

  const menus = sidebarMenus[role] || [];

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white">
      <div className="h-20 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Smart Scrap
        </h1>
      </div>

      <nav className="p-5">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg mb-2 ${
                isActive
                  ? "bg-green-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            <menu.icon size={20} />
            <span>{menu.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;