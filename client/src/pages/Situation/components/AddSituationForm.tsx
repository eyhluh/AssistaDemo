import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import SituationService from "../../../services/SituationService";
import type { SituationFieldErrors } from "../../../interfaces/SituationInterface";

interface AddSituationFormProps {
  onSituationAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddSituationForm: FC<AddSituationFormProps> = ({
  onSituationAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [situation, setSituation] = useState("");
  const [errors, setErrors] = useState<SituationFieldErrors>({});

  const handleStoreSituation = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await SituationService.storeSituation({ situation });

      if (res.status === 200) {
        setSituation("");
        setErrors({});
        onSituationAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store Situation: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store Situation: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreSituation}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Situation"
            type="text"
            name="Situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            required
            autoFocus
            errors={errors.situation}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Situation"
            loading={loadingStore}
            loadingLabel="Saving Situation..."
          />
        </div>
      </form>
    </>
  );
};

export default AddSituationForm;
