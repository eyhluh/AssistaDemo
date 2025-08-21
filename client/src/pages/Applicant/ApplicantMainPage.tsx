import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import AddApplicantFormModal from "./components/AddApplicantFormModal";
import EditApplicantFormModal from "./components/EditApplicantFormModal";
import DeleteApplicantFormModal from "./components/DeleteApplicantFormModal";
import ApplicantList from "./components/ApplicantList";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import { useEffect, useState } from "react";
import type { ApplicantColumns } from "../../interfaces/ApplicantInterface";

const ApplicantMainPage = () => {
  useEffect(() => {
    document.title = "Applicant";
  }, []);

  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantColumns | null>(null);

  const {
    isOpen: isAddApplicantFormModalOpen,
    openModal: openAddApplicantFormModal,
    closeModal: closeAddApplicantFormModal,
  } = useModal(false);

  const {
    isOpen: isEditApplicantFormModalOpen,
    openModal: openEditApplicantFormModal,
    closeModal: closeEditApplicantFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteApplicantFormModalOpen,
    openModal: openDeleteApplicantFormModal,
    closeModal: closeDeleteApplicantFormModal,
  } = useModal(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  const handleEditApplicant = (applicant: ApplicantColumns | null) => {
    setSelectedApplicant(applicant);
    openEditApplicantFormModal();
  };

  const handleDeleteApplicant = (applicant: ApplicantColumns | null) => {
    setSelectedApplicant(applicant);
    openDeleteApplicantFormModal();
  };

  const handleCloseEditModal = () => {
    setSelectedApplicant(null);
    closeEditApplicantFormModal();
  };

  const handleCloseDeleteModal = () => {
    setSelectedApplicant(null);
    closeDeleteApplicantFormModal();
  };

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
      <EditApplicantFormModal
        isOpen={isEditApplicantFormModalOpen}
        onClose={handleCloseEditModal}
        applicant={selectedApplicant}
        onApplicantUpdated={showToastMessage}
        refreshKey={handleRefresh}
      />
      <DeleteApplicantFormModal
        isOpen={isDeleteApplicantFormModalOpen}
        onClose={handleCloseDeleteModal}
        applicant={selectedApplicant}
        onApplicantDeleted={showToastMessage}
        refreshKey={handleRefresh}
      />
      <ApplicantList
        onAddApplicant={openAddApplicantFormModal}
        onEditApplicant={handleEditApplicant}
        onDeleteApplicant={handleDeleteApplicant}
        refreshKey={refresh}
      />
    </>
  );
};

export default ApplicantMainPage;
