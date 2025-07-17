import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

const AddGenderForm = () => {
  return (
    <>
      <FloatingLabelInput
        label="Gender"
        type="text"
        name="gender"
        inputClassName="mb-4"
      />
      <SubmitButton label="Save Gender" className="w-full" />
    </>
  );
};

export default AddGenderForm;
