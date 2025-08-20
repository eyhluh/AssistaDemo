import { useEffect } from "react";
import AddSituationForm from "./components/AddSituationForm";
import SituationList from "./components/SituationList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import { useLocation } from "react-router-dom";

const SituationMainPage = () => {
  const location = useLocation();
  const {
    message: toastMessage,
    isVisible: toustMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  useEffect(() => {
    document.title = "Situation Main Page";
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message, false);
      handleRefresh();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToastMessage, handleRefresh]);
  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toustMessageIsVisible}
        onClose={closeToastMessage}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <AddSituationForm
            onSituationAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <SituationList refreshKey={refresh} />
        </div>
      </div>
    </>
  );
};

export default SituationMainPage;
