import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import SituationService from "../../../services/SituationService";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { SituationFieldErrors } from "../../../interfaces/SituationInterface";

interface EditSituationFormProps {
  onSituationUpdated: (message: string) => void;
}

const EditSituationForm: FC<EditSituationFormProps> = ({
  onSituationUpdated,
}) => {
  const { situation_id } = useParams();
  const navigate = useNavigate();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [situation, setSituation] = useState("");
  const [errors, setErrors] = useState<SituationFieldErrors>({});

  const handleGetSituation = async (situationId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await SituationService.getSituation(situationId);

      if (res.status === 200) {
        setSituation(res.data.situation.situation);
      } else {
        console.error(
          "Unexpected error occurred during getting Situation: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting Situation: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateSituation = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await SituationService.updateSituation(situation_id!, {
        situation,
      });

      if (res.status === 200) {
        setErrors({});
        setSituation(res.data.situation.situation);
        onSituationUpdated(res.data.message);
        // Navigate back to situations list after successful update
        setTimeout(() => {
          navigate("/Situations", {
            state: { message: res.data.message },
          });
        }, 1500);
      } else {
        console.error(
          "Unexpected error occurred during updating Situation: ",
          res.data
        );
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: { errors: SituationFieldErrors } };
        };
        if (axiosError.response && axiosError.response.status === 422) {
          setErrors(axiosError.response.data.errors);
        } else {
          console.error(
            "Unexpected server error occurred during updating Situation: ",
            error
          );
        }
      } else {
        console.error(
          "Unexpected server error occurred during updating Situation: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (situation_id) {
      const parseSituationId = parseInt(situation_id);
      handleGetSituation(parseSituationId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting Situation:",
        situation_id
      );
    }
  }, [situation_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateSituation}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Situation"
              type="text"
              name="Situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              errors={errors.situation}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/Situations" />

            <SubmitButton
              label="Edit Situation"
              loading={loadingUpdate}
              loadingLabel="Updating Situation..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditSituationForm;
