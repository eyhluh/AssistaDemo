import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import ApplicantService from "../../../services/ApplicantService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { ApplicantFieldErrors } from "../../../interfaces/ApplicantInterface";

interface EditApplicantFormProps {
  onApplicantUpdated: (message: string) => void;
}

const EditApplicantForm: FC<EditApplicantFormProps> = ({
  onApplicantUpdated,
}) => {
  const { applicant_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [applicant, setApplicant] = useState("");
  const [errors, setErrors] = useState<ApplicantFieldErrors>({});

  const handleGetApplicant = async (applicantId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await ApplicantService.getApplicant(applicantId);

      if (res.status === 200) {
        setApplicant(res.data.applicant.applicant);
      } else {
        console.error(
          "Unexpected error occurred during getting applicant: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting applicant: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateApplicant = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await ApplicantService.updateApplicant(applicant_id!, {
        applicant,
      });

      if (res.status === 200) {
        setErrors({});
        setApplicant(res.data.applicant.applicant);
        onApplicantUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during updating Applicant: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating Applicant: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (applicant_id) {
      const parseApplicantId = parseInt(applicant_id);
      handleGetApplicant(parseApplicantId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting Applicant:",
        applicant_id
      );
    }
  }, [applicant_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateApplicant}>
          <div className="mb-4">
            <FloatingLabelInput
              label="applicant"
              type="text"
              name="applicant"
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              errors={errors.applicant}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingUpdate && <BackButton label="Back" path="/applicants" />}

            <SubmitButton
              label="Edit Applicant"
              loading={loadingUpdate}
              loadingLabel="Upadting Applicant..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditApplicantForm;
