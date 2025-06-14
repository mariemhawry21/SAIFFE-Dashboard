import { BaseLayout } from "./BaseLayout";
import logo from "../Assets/logo.png";
import { Outlet } from "react-router-dom";
const adminNotifications = [
  {
    id: 1,
    title: "New Patient",
    message: "John Doe registered",
    avatar: "/path/to/avatar.jpg",
  },
  {
    id: 2,
    title: "Appointment",
    message: "Dr. Smith at 2:00 PM",
    avatar: "/path/to/avatar2.jpg",
  },
];

const adminNavItems = [
  { text: "Dashboard", path: "/admin" },
  { text: "Doctors", path: "/admin/doctors" },
  { text: "Patients", path: "/admin/patients" },
  { text: "Blog", path: "/admin/blog" },
];

const AdminLayout = () => {
  return (
    <BaseLayout
      navItems={adminNavItems}
      logo={logo}
      title="Admin Dashboard"
      notifications={adminNotifications}
    >
      <Outlet />
    </BaseLayout>
  );
};
export default AdminLayout;
