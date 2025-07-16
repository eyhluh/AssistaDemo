import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

const Content = () => {
  return (
    <>
      <h1 className="text-red-600">Hello World</h1>
    </>
  );
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Content />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
