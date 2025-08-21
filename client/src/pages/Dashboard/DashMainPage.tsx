import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";

const DashMainPage = () => {
  useEffect(() => {
    document.title = "Assista Dashboard";
  }, []);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <Dashboard />
    </>
  );
};

export default DashMainPage;
