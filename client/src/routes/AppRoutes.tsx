import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import GenderMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import ApplicantMainPage from "../pages/Applicant/ApplicantMainPage";
import EditApplicantPage from "../pages/Applicant/EditApplicantPage";
import DeleteApplicantPage from "../pages/Applicant/DeleteApplicantPage";
import UserMainPage from "../pages/User/UserMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import DashMainPage from "../pages/Dashboard/DashMainPage";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashMainPage />} />
            <Route path="/genders" element={<GenderMainPage />} />
            <Route
              path="/gender/edit/:gender_id"
              element={<EditGenderPage />}
            />
            <Route
              path="/gender/delete/:gender_id"
              element={<DeleteGenderPage />}
            />
            <Route path="/applicants" element={<ApplicantMainPage />} />
            <Route
              path="/applicant/edit/:applicant_id"
              element={<EditApplicantPage />}
            />
            <Route
              path="/applicant/delete/:applicant_id"
              element={<DeleteApplicantPage />}
            />
            <Route path="/users" element={<UserMainPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
};

export default AppRoutes;
