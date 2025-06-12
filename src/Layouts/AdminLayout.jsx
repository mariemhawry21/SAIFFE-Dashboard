import { BaseLayout } from "./BaseLayout";
import logo from "../Assets/logo.png";
import { Outlet } from "react-router-dom";

const adminNavItems = [
  { text: "Dashboard", path: "/admin" },
  { text: "Doctors", path: "/admin/doctors" },
  { text: "Patients", path: "/admin/patients" },
];

const AdminLayout = () => {
  return (
    <BaseLayout navItems={adminNavItems} logo={logo} title="Admin Dashboard">
      <Outlet />
    </BaseLayout>
  );
};
export default AdminLayout;
