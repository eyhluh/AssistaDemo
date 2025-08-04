import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import AddUserModalForm from "./components/AddUserModalForm";
import UserList from "./components/UserList";
import { useToastMessage } from "../../hooks/useToastMessage";

const UserMainPage = () => {
  const { isOpen, openModal, closeModal } = useModal(false);
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
      <AddUserModalForm
        isOpen={isOpen}
        onClose={closeModal}
        onUserAdded={showToastMessage}
      />
      <UserList onAddUser={openModal} />
    </>
  );
};

export default UserMainPage;
