import { useEffect } from "react";
import DeleteCrisisForm from "./components/DeleteCrisisForm";

const DeleteCrisisPage = () => {
  useEffect(() => {
    document.title = "crisis Delete Page";
  }, []);
  return (
    <>
      <DeleteCrisisForm />
    </>
  );
};

export default DeleteCrisisPage;
