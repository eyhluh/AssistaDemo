import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";

interface RegisterFormProps {
  message: (message: string, isFailed: boolean) => void;
}

interface RegisterCredentialsErrorFields {
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  contact_number?: string[];
  gmail?: string[];
  password?: string[];
  password_confirmation?: string[];
}

const RegisterForm: FC<RegisterFormProps> = ({ message }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<RegisterCredentialsErrorFields>({});

  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      const response = await AuthService.register({
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix_name: suffixName,
        contact_number: contactNumber,
        gmail: gmail,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status === 201) {
        // Reset form
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setContactNumber("");
        setGmail("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});

        // Show success message and navigate to login
        message(response.data.message, false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during registration: ",
          error
        );
        message("An unexpected error occurred. Please try again.", true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <FloatingLabelInput
              label="First Name"
              type="text"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoFocus
              errors={errors.first_name}
            />
          </div>
          <div>
            <FloatingLabelInput
              label="Middle Name (Optional)"
              type="text"
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              errors={errors.middle_name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <FloatingLabelInput
              label="Last Name"
              type="text"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              errors={errors.last_name}
            />
          </div>
          <div>
            <FloatingLabelInput
              label="Suffix Name (Optional)"
              type="text"
              name="suffix_name"
              value={suffixName}
              onChange={(e) => setSuffixName(e.target.value)}
              errors={errors.suffix_name}
            />
          </div>
        </div>

        <div className="mb-4">
          <FloatingLabelInput
            label="Contact Number"
            type="text"
            name="contact_number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
            errors={errors.contact_number}
          />
        </div>

        <div className="mb-4">
          <FloatingLabelInput
            label="Gmail"
            type="email"
            name="gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            required
            errors={errors.gmail}
          />
        </div>

        <div className="mb-4">
          <FloatingLabelInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            errors={errors.password}
          />
        </div>

        <div className="mb-4">
          <FloatingLabelInput
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            errors={errors.password_confirmation}
          />
        </div>

        <SubmitButton
          className="w-full mb-4"
          label="Sign Up"
          loading={isLoading}
          loadingLabel="Signing Up..."
        />

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
