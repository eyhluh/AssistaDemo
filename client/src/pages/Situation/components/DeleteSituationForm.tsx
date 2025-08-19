import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import SituationService from "../../../services/SituationService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteSituationForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [situation, setSituation] = useState("");

  const { situation_id } = useParams();
  const navigate = useNavigate();

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

  const handleDestroySituation = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await SituationService.destroySituation(situation_id!);

      if (res.status === 200) {
        setSituation("");
        navigate("/Situations", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting Situation: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting Situation: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroySituation}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Situation"
              type="text"
              name="Situation"
              value={situation}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/Situations" />}
            <SubmitButton
              label="Delete Situation"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Situation..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteSituationForm;
