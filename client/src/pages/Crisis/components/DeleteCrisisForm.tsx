import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import CrisisService from "../../../services/CrisisService";
import Spinner from "../../../components/Spinner/Spinner";

const DeletecrisisForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [crisis, setcrisis] = useState("");

  const { crisis_id } = useParams();
  const navigate = useNavigate();

  const handleGetcrisis = async (crisisId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await CrisisService.getCrisis(crisisId);

      if (res.status === 200) {
        setcrisis(res.data.crisis.crisis);
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

  const handleDestroycrisis = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await CrisisService.destroyCrisis(crisis_id!);

      if (res.status === 200) {
        setcrisis("");
        navigate("/crisiss", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting crisis: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting crisis: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroycrisis}>
          <div className="mb-4">
            <FloatingLabelInput
              label="crisis"
              type="text"
              name="crisis"
              value={crisis}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/crisiss" />}
            <SubmitButton
              label="Delete crisis"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting crisis..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeletecrisisForm;
