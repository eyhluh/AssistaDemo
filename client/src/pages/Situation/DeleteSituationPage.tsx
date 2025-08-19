import { useEffect } from "react";
import DeleteSituationForm from "./components/DeleteSituationForm";

const DeleteSituationPage = () => {
  useEffect(() => {
    document.title = "Situation Delete Page";
  }, []);
  return (
    <>
      <DeleteSituationForm />
    </>
  );
};

export default DeleteSituationPage;
