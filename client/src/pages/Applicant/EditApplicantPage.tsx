import { useEffect } from "react";
import EditApplicantForm from "./components/EditApplicantForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditApplicantPage = () => {
  useEffect(() => {
    document.title = "Applicant Edit Page";
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
      <EditApplicantForm onApplicantUpdated={showToastMessage} />
    </>
  );
};

export default EditApplicantPage;
