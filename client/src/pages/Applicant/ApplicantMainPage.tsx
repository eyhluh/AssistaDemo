import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import AddApplicantFormModal from "./components/AddApplicantFormModal";
import ApplicantList from "./components/ApplicantList";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import { useEffect } from "react";

const ApplicantMainPage = () => {
  useEffect(() => {
    document.title = "Applicant Main Page";
  }, []);

  const {
    isOpen: isAddApplicantFormModalOpen,
    openModal: openAddApplicantFormModal,
    closeModal: closeAddApplicantFormModal,
  } = useModal(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <AddApplicantFormModal
        isOpen={isAddApplicantFormModalOpen}
        onClose={closeAddApplicantFormModal}
        onApplicantAdded={showToastMessage}
        refreshKey={handleRefresh}
      />
      <ApplicantList
        onAddApplicant={openAddApplicantFormModal}
        refreshKey={refresh}
      />
    </>
  );
};

export default ApplicantMainPage;
