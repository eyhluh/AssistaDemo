import { useEffect, useState, type FC } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import GenderService from "../../../services/GenderService";
import crisisService from "../../../services/crisisService";
import UserService from "../../../services/UserService";
import { useAuth } from "../../../contexts/AuthContext";
import type {
  UserColumns,
  UserFieldErrors,
} from "../../../interfaces/UserInterface";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { crisisColumns } from "../../../interfaces/crisisInterface";
import UploadInput from "../../../components/Input/UploadInput";

interface EditUserFormModalProps {
  user: UserColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (message: string) => void;
  refreshKey: () => void;
}

const EditUserFormModal: FC<EditUserFormModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
  refreshKey,
}) => {
  const { updateUser } = useAuth();
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [crisiss, setcrisiss] = useState<crisisColumns[]>([]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
    string | null
  >(null);
  const [editUserProfilePicture, setEditUserProfilePicture] =
    useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [crisis, setcrisis] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gmail, setGmail] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleUpdateUser = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const formData = new FormData();
      formData.append("_method", "PUT");

      if (editUserProfilePicture) {
        formData.append("edit_user_profile_picture", editUserProfilePicture);
      } else if (!existingProfilePicture) {
        formData.append("remove_profile_picture", "1");
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("crisis", crisis);
      formData.append("birth_date", birthDate);
      formData.append("gmail", gmail);

      const res = await UserService.updateUser(user?.user_id!, formData);

      if (res.status === 200) {
        setExistingProfilePicture(
          res.data.user.profile_picture ? res.data.user.profile_picture : null
        );

        setEditUserProfilePicture(null);
        setFirstName(res.data.user.first_name);
        setMiddleName(res.data.user.middle_name ?? "");
        setLastName(res.data.user.last_name);
        setSuffixName(res.data.user.suffix_name ?? "");
        setGender(res.data.user.gender_id);
        setBirthDate(res.data.user.birth_date);
        setGmail(res.data.user.gmail);
        setErrors({});

        // Update the user state in AuthContext to reflect the changes immediately
        updateUser({
          user: res.data.user,
          token: localStorage.getItem("token") || "",
        });

        onUserUpdated(res.data.message);
        handleLoadGenders();
        refreshKey();
      } else {
        console.error(
          "Unexpected status error during updating user:",
          res.status
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected status error during updating user:", error);
      }
    } finally {
      setLoadingUpdate(false); // <-- Always stop loading
    }
  };

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      } else {
        console.error(
          "Unexpected error occurred during loading genders: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading genders: ",
        error
      );
    } finally {
      setLoadingGenders(false);
    }
  };
  const handleLoadcrisiss = async () => {
    try {
      const res = await crisisService.loadcrisiss();
      if (res.status === 200) {
        setcrisiss(res.data.crisiss);
      } else {
        console.error(
          "Unexpected error occurred during loading crisiss: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading crisiss: ",
        error
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadcrisiss();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setEditUserProfilePicture(null);

        setExistingProfilePicture(
          user.profile_picture ? user.profile_picture : null
        );
        setFirstName(user.first_name);
        setMiddleName(user.middle_name ?? "");
        setLastName(user.last_name);
        setSuffixName(user.suffix_name ?? "");
        setGender(user.gender.gender_id.toString());
        setcrisis(user.crisis.crisis_id.toString());
        setBirthDate(user.birth_date);
        setGmail(user.gmail);
      } else {
        console.error(
          "Unexpected user error occured  during getting user details: ",
          user
        );
      }
    }
  }, [isOpen, user]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleUpdateUser}>
          <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
            Edit User Form
          </h1>
          <div className="mb-4">
            <UploadInput
              label="Profile Picture"
              name="edit_user_profile_picture"
              value={editUserProfilePicture}
              onChange={setEditUserProfilePicture}
              onRemoveExistingImageUrl={() => setExistingProfilePicture(null)}
              existingImageUrl={existingProfilePicture}
              errors={errors.edit_user_profile_picture}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoFocus
                  errors={errors.first_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Middle Name"
                  type="text"
                  name="middle_name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  errors={errors.middle_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  errors={errors.last_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={suffixName}
                  onChange={(e) => setSuffixName(e.target.value)}
                  errors={errors.suffix_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelSelect
                  label="Gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  errors={errors.gender}
                >
                  {loadingGenders ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Gender</option>
                      {genders.map((gender, index) => (
                        <option value={gender.gender_id} key={index}>
                          {gender.gender}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
              </div>
              <div className="mb-4">
                <FloatingLabelSelect
                  label="crisis"
                  name="crisis"
                  value={crisis}
                  onChange={(e) => setcrisis(e.target.value)}
                  required
                  errors={errors.crisis}
                >
                  <>
                    <option value="">Select crisis</option>
                    {crisiss.map((crisis, index) => (
                      <option value={crisis.crisis_id} key={index}>
                        {crisis.crisis}
                      </option>
                    ))}
                  </>
                </FloatingLabelSelect>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="Birth Date"
                  type="date"
                  name="birth_date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  errors={errors.birth_date}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Gmail"
                  type="email"
                  name="gmail"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  required
                  errors={errors.gmail}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update User"
              loading={loadingUpdate}
              loadingLabel="Updating User..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditUserFormModal;
