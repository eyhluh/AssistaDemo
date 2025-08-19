import { useEffect } from "react";
import EditSituationForm from "./components/EditSituationForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditSituationPage = () => {
  useEffect(() => {
    document.title = "Situation Edit Page";
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
      <EditSituationForm onSituationUpdated={showToastMessage} />
    </>
  );
};

export default EditSituationPage;
