import { NavLink } from "react-router-dom";
import { FiUploadCloud, FiFileText, FiActivity, FiSettings } from "react-icons/fi";

const links = [
  { to: "/dashboard", label: "Analyze", icon: <FiUploadCloud /> },
  { to: "/reports", label: "Reports", icon: <FiFileText /> },
  { to: "/activity", label: "Activity", icon: <FiActivity /> },
  { to: "/settings", label: "Settings", icon: <FiSettings /> },
];

export default function SidebarLinks() {
  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${
              isActive
                ? "bg-black text-white"
                : "text-neutral-700 hover:bg-neutral-200 hover:text-black"
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
