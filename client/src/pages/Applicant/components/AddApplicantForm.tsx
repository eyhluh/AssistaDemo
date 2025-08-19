import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import ApplicantService from "../../../services/ApplicantService";
import type { ApplicantFieldErrors } from "../../../interfaces/ApplicantInterface";

interface AddApplicantFormProps {
  onApplicantAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddApplicantForm: FC<AddApplicantFormProps> = ({
  onApplicantAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [applicant, setApplicant] = useState("");
  const [errors, setErrors] = useState<ApplicantFieldErrors>({});

  const handleStoreApplicant = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await ApplicantService.storeApplicant({ applicant });

      if (res.status === 200) {
        setApplicant("");
        setErrors({});
        onApplicantAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store applicant: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store applicant: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreApplicant}>
        <div className="mb-4">
          <FloatingLabelInput
            label="applicant"
            type="text"
            name="applicant"
            value={applicant}
            onChange={(e) => setApplicant(e.target.value)}
            required
            autoFocus
            errors={errors.applicant}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Applicant"
            loading={loadingStore}
            loadingLabel="Saving Applicant..."
          />
        </div>
      </form>
    </>
  );
};

export default AddApplicantForm;
