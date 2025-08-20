import { useState, useEffect, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import SubmitButton from "../../../components/Button/SubmitButton";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import UploadInput from "../../../components/Input/UploadInput";
import ApplicationService from "../../../services/ApplicationService";
import GenderService from "../../../services/GenderService";
import CrisisService from "../../../services/CrisisService";
import SituationService from "../../../services/SituationService";
import type {
  ApplicantColumns,
  ApplicantFieldErrors,
} from "../../../interfaces/ApplicantInterface";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { CrisisColumns } from "../../../interfaces/CrisisInterface";
import type { SituationColumns } from "../../../interfaces/SituationInterface";

interface EditApplicantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantColumns | null;
  onApplicantUpdated: (message: string) => void;
  refreshKey: () => void;
}

const EditApplicantFormModal: FC<EditApplicantFormModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onApplicantUpdated,
  refreshKey,
}) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [loadingCrises, setLoadingCrises] = useState(false);
  const [loadingSituations, setLoadingSituations] = useState(false);

  // Form data
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [genderId, setGenderId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gmail, setGmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [crisisId, setCrisisId] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [situationId, setSituationId] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [removeAttachedFile, setRemoveAttachedFile] = useState(false);

  // Options
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [crises, setCrises] = useState<CrisisColumns[]>([]);
  const [situations, setSituations] = useState<SituationColumns[]>([]);

  const [errors, setErrors] = useState<ApplicantFieldErrors>({});

  // Load options
  const loadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders || []);
      }
    } catch (error) {
      console.error("Error loading genders:", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  const loadCrises = async () => {
    try {
      setLoadingCrises(true);
      const res = await CrisisService.loadCrisiss();
      if (res.status === 200) {
        setCrises(res.data.crisiss || res.data.crisis || []);
      }
    } catch (error) {
      console.error("Error loading crises:", error);
    } finally {
      setLoadingCrises(false);
    }
  };

  const loadSituations = async () => {
    try {
      setLoadingSituations(true);
      const res = await SituationService.loadSituations();
      if (res.status === 200) {
        setSituations(res.data.situations || []);
      }
    } catch (error) {
      console.error("Error loading situations:", error);
    } finally {
      setLoadingSituations(false);
    }
  };

  // Calculate age from birth date
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  const handleUpdateApplication = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoadingUpdate(true);

      // Client-side validation
      const newErrors: ApplicantFieldErrors = {};

      if (!firstName.trim()) newErrors.first_name = ["First name is required"];
      if (!lastName.trim()) newErrors.last_name = ["Last name is required"];
      if (!genderId) newErrors.gender = ["Gender is required"];
      if (!birthDate) newErrors.birth_date = ["Birth date is required"];
      if (!contactNumber.trim())
        newErrors.contact_number = ["Contact number is required"];
      if (!gmail.trim()) newErrors.gmail = ["Email is required"];
      if (!crisisId) newErrors.crisis = ["Crisis is required"];
      if (!situationId) newErrors.situation = ["Situation is required"];

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();
      formData.append("first_name", firstName.trim());
      formData.append("middle_name", middleName.trim());
      formData.append("last_name", lastName.trim());
      formData.append("suffix_name", suffixName.trim());
      formData.append("gender_id", genderId);
      formData.append("birth_date", birthDate);
      formData.append("age", age);
      formData.append("contact_number", contactNumber.trim());
      formData.append("gmail", gmail.trim());
      formData.append("house_no", houseNo.trim());
      formData.append("street", street.trim());
      formData.append("subdivision", subdivision.trim());
      formData.append("barangay", barangay.trim());
      formData.append("city", city.trim());
      formData.append("crisis_id", crisisId);
      formData.append("incident_date", incidentDate);
      formData.append("situation_id", situationId);

      if (attachedFile) {
        formData.append("edit_applicant_file", attachedFile);
      }

      if (removeAttachedFile) {
        formData.append("remove_attached_file", "1");
      }

      // Debug logging
      console.log("Form data being sent:", {
        first_name: firstName,
        gender_id: genderId,
        crisis_id: crisisId,
        situation_id: situationId,
      });

      const applicationId =
        applicant?.application_id || applicant?.applicant_id;
      if (!applicationId) {
        throw new Error("Application ID not found");
      }

      const res = await ApplicationService.updateApplication(
        applicationId,
        formData
      );

      if (res.status === 200) {
        setErrors({});
        onApplicantUpdated(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected error occurred during updating application:",
          res.data
        );
      }
    } catch (error: unknown) {
      console.error("Full error object:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            status: number;
            data: { errors: ApplicantFieldErrors; message?: string };
          };
        };
        if (axiosError.response && axiosError.response.status === 422) {
          console.log(
            "Validation errors from server:",
            axiosError.response.data.errors
          );
          setErrors(axiosError.response.data.errors);
        } else {
          console.error(
            "Unexpected server error occurred during updating application:",
            error
          );
        }
      } else {
        console.error(
          "Unexpected server error occurred during updating application:",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Helper function to format date for input
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Initialize form with applicant data
  useEffect(() => {
    if (applicant && isOpen) {
      setFirstName(applicant.first_name || "");
      setMiddleName(applicant.middle_name || "");
      setLastName(applicant.last_name || "");
      setSuffixName(applicant.suffix_name || "");
      setGenderId(applicant.gender?.gender_id?.toString() || "");
      setBirthDate(formatDateForInput(applicant.birth_date));
      setAge(applicant.age?.toString() || "");
      setContactNumber(applicant.contact_number || "");
      setGmail(applicant.gmail || "");
      setHouseNo(applicant.house_no || "");
      setStreet(applicant.street || "");
      setSubdivision(applicant.subdivision || "");
      setBarangay(applicant.barangay || "");
      setCity(applicant.city || "");
      setCrisisId(applicant.crisis?.crisis_id?.toString() || "");
      setIncidentDate(formatDateForInput(applicant.incident_date));
      setSituationId(applicant.situation?.situation_id?.toString() || "");
      setAttachedFile(null);
      setRemoveAttachedFile(false);
      setErrors({});
    }
  }, [applicant, isOpen]);

  // Load options when modal opens
  useEffect(() => {
    if (isOpen) {
      loadGenders();
      loadCrises();
      loadSituations();
    }
  }, [isOpen]);

  // Calculate age when birth date changes
  useEffect(() => {
    if (birthDate) {
      setAge(calculateAge(birthDate));
    }
  }, [birthDate]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Application
          </h2>
          <ModalCloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleUpdateApplication} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="First Name"
              type="text"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              errors={errors.first_name}
            />
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              errors={errors.middle_name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="Last Name"
              type="text"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              errors={errors.last_name}
            />
            <FloatingLabelInput
              label="Suffix Name"
              type="text"
              name="suffix_name"
              value={suffixName}
              onChange={(e) => setSuffixName(e.target.value)}
              errors={errors.suffix_name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingLabelSelect
              label="Gender"
              name="gender_id"
              value={genderId}
              onChange={(e) => setGenderId(e.target.value)}
              required
              errors={errors.gender}
            >
              <option value="">Select Gender</option>
              {loadingGenders ? (
                <option disabled>Loading...</option>
              ) : (
                genders.map((gender) => (
                  <option key={gender.gender_id} value={gender.gender_id}>
                    {gender.gender}
                  </option>
                ))
              )}
            </FloatingLabelSelect>
            <FloatingLabelInput
              label="Birth Date"
              type="date"
              name="birth_date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              errors={errors.birth_date}
            />
            <FloatingLabelInput
              label="Age"
              type="text"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              readOnly
              errors={errors.age}
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="Contact Number"
              type="text"
              name="contact_number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              errors={errors.contact_number}
            />
            <FloatingLabelInput
              label="Email"
              type="email"
              name="gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
              errors={errors.gmail}
            />
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              label="House No."
              type="text"
              name="house_no"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              errors={errors.house_no}
            />
            <FloatingLabelInput
              label="Street"
              type="text"
              name="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              errors={errors.street}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingLabelInput
              label="Subdivision"
              type="text"
              name="subdivision"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
              errors={errors.subdivision}
            />
            <FloatingLabelInput
              label="Barangay"
              type="text"
              name="barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              errors={errors.barangay}
            />
            <FloatingLabelInput
              label="City"
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              errors={errors.city}
            />
          </div>

          {/* Crisis Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatingLabelSelect
              label="Crisis"
              name="crisis_id"
              value={crisisId}
              onChange={(e) => setCrisisId(e.target.value)}
              required
              errors={errors.crisis}
            >
              <option value="">Select Crisis</option>
              {loadingCrises ? (
                <option disabled>Loading...</option>
              ) : (
                crises.map((crisis) => (
                  <option key={crisis.crisis_id} value={crisis.crisis_id}>
                    {crisis.crisis}
                  </option>
                ))
              )}
            </FloatingLabelSelect>
            <FloatingLabelInput
              label="Incident Date"
              type="date"
              name="incident_date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              errors={errors.incident_date}
            />
            <FloatingLabelSelect
              label="Situation"
              name="situation_id"
              value={situationId}
              onChange={(e) => setSituationId(e.target.value)}
              required
              errors={errors.situation}
            >
              <option value="">Select Situation</option>
              {loadingSituations ? (
                <option disabled>Loading...</option>
              ) : (
                situations.map((situation) => (
                  <option
                    key={situation.situation_id}
                    value={situation.situation_id}
                  >
                    {situation.situation}
                  </option>
                ))
              )}
            </FloatingLabelSelect>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <UploadInput
              label="Update Attached File"
              name="edit_applicant_file"
              value={attachedFile}
              onChange={(file) => setAttachedFile(file)}
              errors={errors.edit_applicant_file}
            />
            {applicant?.attached_file_url && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remove_file"
                  checked={removeAttachedFile}
                  onChange={(e) => setRemoveAttachedFile(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="remove_file" className="text-sm text-gray-600">
                  Remove current attached file
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loadingUpdate}
            >
              Cancel
            </button>
            <SubmitButton
              label="Update Application"
              loading={loadingUpdate}
              loadingLabel="Updating Application..."
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditApplicantFormModal;
