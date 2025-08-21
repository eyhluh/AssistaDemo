import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { BsPeople } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

const AppSidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  const menuItems = [
    {
      icon: <LuLayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
      name: "Dashboard",
    },
    // {
    //   icon: <BsGenderAmbiguous className="w-5 h-5" />,
    //   path: "/genders",
    //   name: "Gender",
    // },
    // {
    //   icon: <BsPeople className="w-5 h-5" />,
    //   path: "/crisiss",
    //   name: "Crisis",
    // },
    // {
    //   icon: <BsPeople className="w-5 h-5" />,
    //   path: "/situations",
    //   name: "Situation",
    // },
    {
      icon: <BsPeople className="w-5 h-5" />,
      path: "/applicants",
      name: "Applicant",
    },
    // {
    //   icon: <BsPeople className="w-5 h-5" />,
    //   path: "/users",
    //   name: "User",
    // },
  ];

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 z-30 blur-lg sm:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? "-translate-x-full" : "translate-x-0"
        } bg-white border-r border-gray-200 sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {menuItems.map((menuItem, index) => (
              <li key={index}>
                <Link
                  to={menuItem.path}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  {menuItem.icon && (
                    <span className="text-gray-500 group-hover:text-gray-900">
                      {menuItem.icon}
                    </span>
                  )}
                  <span className="ms-3">{menuItem.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
