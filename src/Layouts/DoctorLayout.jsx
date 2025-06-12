import { BaseLayout } from "./BaseLayout";
import logo from "../Assets/logo.png";
import { Outlet } from "react-router-dom";

const doctorNavItems = [
  { text: "Dashboard", path: "/doctor" },
  { text: "Appointments", path: "/doctor/appointments" },
  { text: "Patients", path: "/doctor/patients" },
  { text: "Settings", path: "/doctor/settings" },
];

const DoctorLayout = () => {
  return (
    <BaseLayout navItems={doctorNavItems} logo={logo} title="Doctor Dashboard">
      <Outlet />
    </BaseLayout>
  );
};
export default DoctorLayout;
