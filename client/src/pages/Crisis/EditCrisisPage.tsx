import { useEffect } from "react";
import EditCrisisForm from "./components/EditCrisisForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditCrisisPage = () => {
  useEffect(() => {
    document.title = "Crisis Edit Page";
  }, []);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <EditCrisisForm onCrisisUpdated={showToastMessage} />
    </>
  );
};

export default EditCrisisPage;
