import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import ApplicantService from "../../../services/ApplicantService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteApplicantForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [applicant, setApplicant] = useState("");

  const { applicant_id } = useParams();
  const navigate = useNavigate();

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

  const handleDestroyApplicant = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await ApplicantService.destroyApplicant(applicant_id!);

      if (res.status === 200) {
        setApplicant("");
        navigate("/applicants", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting applicant: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting applicant: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroyApplicant}>
          <div className="mb-4">
            <FloatingLabelInput
              label="applicant"
              type="text"
              name="applicant"
              value={applicant}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/applicants" />}
            <SubmitButton
              label="Delete Applicant"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Applicant..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteApplicantForm;
