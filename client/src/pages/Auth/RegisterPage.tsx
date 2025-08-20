import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import AuthPageLayout from "./AuthPageLayout";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  const { message, isFailed, isVisible, showToastMessage, closeToastMessage } =
    useToastMessage("", false, false);

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: 'url("/images/IAssistaLogo.png")' }}
    >
      <AuthPageLayout>
        <ToastMessage
          message={message}
          isFailed={isFailed}
          isVisible={isVisible}
          onClose={closeToastMessage}
        />
        <RegisterForm message={showToastMessage} />
      </AuthPageLayout>
    </div>
  );
};

export default RegisterPage;
