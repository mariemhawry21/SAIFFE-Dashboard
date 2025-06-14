import React from "react";
import AdminLayout from "../Layouts/AdminLayout";
import DoctorLayout from "../Layouts/DoctorLayout";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import Patients from "../Pages/Admin/Patients";
import DoctorDashboard from "../Pages/Doctor/DoctorDashboard";
import Appointments from "../Pages/Doctor/Appointments";
import ProtectedRoute from "../Components/global/ProtectedRoutes";
import Login from "../Pages/Global/Login";
import DoctorPatients from "../Pages/Doctor/DoctorPatients";
import { Navigate, Route, Routes } from "react-router-dom";
import Doctors from "../Pages/Admin/Doctors";
import Settings from "../Pages/Doctor/Settings";
import AddDoctor from "../Pages/Admin/AddDoctor";
import Blog from "../Pages/Global/Blog";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="adddoctor" element={<AddDoctor />} />
        <Route path="blog" element={<Blog />} />
      </Route>
      {/* </Route> */}
      {/* <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}> */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route path="settings" element={<Settings />} />
        <Route path="blog" element={<Blog />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
};

export default AppRoutes;
