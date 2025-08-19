import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CrisisService from "../../../services/CrisisService";
import type { CrisisFieldErrors } from "../../../interfaces/CrisisInterface";

interface AddCrisisFormProps {
  onCrisisAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddcrisisForm: FC<AddCrisisFormProps> = ({
  onCrisisAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [crisis, setCrisis] = useState("");
  const [errors, setErrors] = useState<CrisisFieldErrors>({});

  const handleStorecrisis = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await CrisisService.storeCrisis({ crisis });

      if (res.status === 200) {
        setCrisis("");
        setErrors({});
        onCrisisAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store crisis: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store crisis: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStorecrisis}>
        <div className="mb-4">
          <FloatingLabelInput
            label="crisis"
            type="text"
            name="crisis"
            value={crisis}
            onChange={(e) => setCrisis(e.target.value)}
            required
            autoFocus
            errors={errors.crisis}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save crisis"
            loading={loadingStore}
            loadingLabel="Saving crisis..."
          />
        </div>
      </form>
    </>
  );
};

export default AddcrisisForm;
