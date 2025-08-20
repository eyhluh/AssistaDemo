import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CrisisService from "../../../services/CrisisService";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { CrisisFieldErrors } from "../../../interfaces/CrisisInterface";

interface EditCrisisFormProps {
  onCrisisUpdated: (message: string) => void;
}

const EditCrisisForm: FC<EditCrisisFormProps> = ({ onCrisisUpdated }) => {
  const { crisis_id } = useParams();
  const navigate = useNavigate();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [crisis, setCrisis] = useState("");
  const [errors, setErrors] = useState<CrisisFieldErrors>({});

  const handleGetcrisis = async (crisisId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await CrisisService.getCrisis(crisisId);

      if (res.status === 200) {
        setCrisis(res.data.crisis.crisis);
      } else {
        console.error(
          "Unexpected error occurred during getting crisis: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting crisis: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdatecrisis = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await CrisisService.updateCrisis(crisis_id!, {
        crisis,
      });

      if (res.status === 200) {
        setErrors({});
        setCrisis(res.data.crisis.crisis);
        onCrisisUpdated(res.data.message);
        // Navigate back to crisis list after successful update
        setTimeout(() => {
          navigate("/crisiss", {
            state: { message: res.data.message },
          });
        }, 1500);
      } else {
        console.error(
          "Unexpected error occurred during updating crisis: ",
          res.data
        );
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: { errors: CrisisFieldErrors } };
        };
        if (axiosError.response && axiosError.response.status === 422) {
          setErrors(axiosError.response.data.errors);
        } else {
          console.error(
            "Unexpected server error occurred during updating crisis: ",
            error
          );
        }
      } else {
        console.error(
          "Unexpected server error occurred during updating crisis: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (crisis_id) {
      const parsecrisisId = parseInt(crisis_id);
      handleGetcrisis(parsecrisisId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting crisis:",
        crisis_id
      );
    }
  }, [crisis_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdatecrisis}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Crisis"
              type="text"
              name="crisis"
              value={crisis}
              onChange={(e) => setCrisis(e.target.value)}
              errors={errors.crisis}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/crisiss" />

            <SubmitButton
              label="Edit Crisis"
              loading={loadingUpdate}
              loadingLabel="Updating Crisis..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditCrisisForm;
