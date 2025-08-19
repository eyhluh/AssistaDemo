import { useEffect } from "react";
import DeleteApplicantForm from "./components/DeleteApplicantForm";

const DeleteApplicantPage = () => {
  useEffect(() => {
    document.title = "Applicant Delete Page";
  }, []);
  return (
    <>
      <DeleteApplicantForm />
    </>
  );
};

export default DeleteApplicantPage;
