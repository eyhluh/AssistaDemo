import { useEffect, useState } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { GenderFieldErrors } from "../../../interfaces/GenderFieldErrors";
import GenderService from "../../../services/GenderService";
import { useParams } from "react-router-dom";

const EditGenderForm = () => {
  const { gender_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const handleGetGender = async (genderId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await GenderService.getGender(genderId);

      if (res.status === 200) {
        setGender(res.data.gender.gender);
      } else {
        console.error(
          "Unexpected error occurred during getting gender: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting gender: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {
    if (gender_id) {
      const parseGenderId = parseInt(gender_id);
      handleGetGender(parseGenderId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting gender:",
        gender_id
      );
    }
  }, [gender_id]);

  return (
    <>
      <form>
        <div className="mb-4">
          <FloatingLabelInput label="Gender" type="text" name="gender" />
        </div>
        <div className="flex justify-end gap-2">
          <BackButton label="Back" path="/" />
          <SubmitButton label="Save Gender" />
        </div>
      </form>
    </>
  );
};

export default EditGenderForm;
