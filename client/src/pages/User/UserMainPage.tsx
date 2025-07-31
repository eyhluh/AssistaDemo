import { useModal } from "../../hooks/useModal";
import AddUserModalForm from "./components/AddUserModalForm";
import UserList from "./components/UserList";

const UserMainPage = () => {
  const { isOpen, openModal, closeModal } = useModal(false);
  return (
    <>
      <AddUserModalForm isOpen={isOpen} onClose={closeModal} />
      <UserList onAddUser={openModal} />
    </>
  );
};

export default UserMainPage;
