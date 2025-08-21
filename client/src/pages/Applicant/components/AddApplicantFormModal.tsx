import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import GenderService from "../../../services/GenderService";
import CrisisService from "../../../services/CrisisService";
import SituationService from "../../../services/SituationService";
import ApplicationService from "../../../services/ApplicationService";
import type { ApplicantFieldErrors } from "../../../interfaces/ApplicantInterface";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { CrisisColumns } from "../../../interfaces/CrisisInterface";
import type { SituationColumns } from "../../../interfaces/SituationInterface";
import UploadInput from "../../../components/Input/UploadInput";

interface AddApplicantFormModalProps {
  onApplicantAdded: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const AddApplicantFormModal: FC<AddApplicantFormModalProps> = ({
  onApplicantAdded,
  refreshKey,
  isOpen,
  onClose,
}) => {
  // Loading states
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [loadingCrisis, setLoadingCrisis] = useState(false);
  const [loadingSituations, setLoadingSituations] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);

  // Data states
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [crisisOptions, setCrisisOptions] = useState<CrisisColumns[]>([]);
  const [situations, setSituations] = useState<SituationColumns[]>([]);

  // Form states - Program
  const [crisis, setCrisis] = useState("");
  const [incidentDate, setIncidentDate] = useState("");

  // Form states - Personal Details
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");

  // Form states - Contact Information
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  // Form states - Additional fields (from existing interface)
  const [birthDate, setBirthDate] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");
  const [situation, setSituation] = useState("");

  // File and consent states
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [errors, setErrors] = useState<ApplicantFieldErrors>({});

  // Civil status options
  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
    { value: "separated", label: "Separated" },
  ];

  const validateForm = () => {
    const newErrors: ApplicantFieldErrors = {};

    // Required field validation
    if (!crisis) newErrors.crisis = ["The field is required"];
    if (!incidentDate) newErrors.incident_date = ["The field is required"];
    if (!firstName) newErrors.first_name = ["The field is required"];
    if (!lastName) newErrors.last_name = ["The field is required"];
    if (!gender) newErrors.gender = ["The field is required"];
    if (!civilStatus) newErrors.civil_status = ["The field is required"];
    if (!mobileNumber) newErrors.contact_number = ["The field is required"];
    if (!emailAddress) newErrors.gmail = ["The field is required"];
    if (!birthDate) newErrors.birth_date = ["The field is required"];
    if (!houseNo) newErrors.house_no = ["The field is required"];
    if (!street) newErrors.street = ["The field is required"];
    if (!barangay) newErrors.barangay = ["The field is required"];
    if (!city) newErrors.city = ["The field is required"];
    if (!situation) newErrors.situation = ["The field is required"];

    // Additional validation rules
    if (mobileNumber && mobileNumber.length !== 11) {
      newErrors.contact_number = ["Mobile number must be exactly 11 digits"];
    }

    if (emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      newErrors.gmail = ["Please enter a valid email address"];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStoreApplicant = async (e: FormEvent) => {
    try {
      e.preventDefault();

      // Client-side validation
      if (!validateForm()) {
        return;
      }

      if (!consentAgreed) {
        alert("Please agree to the declaration and consent before submitting.");
        return;
      }

      setLoadingStore(true);

      const formData = new FormData();

      // Program fields
      formData.append("crisis", crisis);
      formData.append("incident_date", incidentDate);

      // Personal Details
      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("civil_status", civilStatus);
      formData.append("birth_date", birthDate);

      // Contact Information
      formData.append("contact_number", mobileNumber);
      formData.append("gmail", emailAddress);

      // Address fields (from existing interface)
      formData.append("house_no", houseNo);
      formData.append("street", street);
      formData.append("subdivision", subdivision || "");
      formData.append("barangay", barangay);
      formData.append("city", city);
      formData.append("situation", situation);

      // File attachment
      if (attachedFile) {
        formData.append("add_applicant_file", attachedFile);
      }

      // Debug logging
      console.log("Form data being sent:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await ApplicationService.storeApplication(formData);

      if (res.status === 200 || res.status === 201) {
        // Reset form
        setCrisis("");
        setIncidentDate("");
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setGender("");
        setCivilStatus("");
        setMobileNumber("");
        setEmailAddress("");
        setBirthDate("");
        setHouseNo("");
        setStreet("");
        setSubdivision("");
        setBarangay("");
        setCity("");
        setSituation("");
        setAttachedFile(null);
        setConsentAgreed(false);
        setErrors({});

        onApplicantAdded(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected error occurred during adding applicant: ",
          res.status
        );
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { status: number; data: { errors: ApplicantFieldErrors } };
        };
        if (axiosError.response?.status === 422) {
          setErrors(axiosError.response.data.errors);
        } else {
          console.error(
            "Unexpected server error occurred during adding applicant: ",
            error
          );
        }
      } else {
        console.error(
          "Unexpected server error occurred during adding applicant: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders: ", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleLoadCrisis = async () => {
    try {
      setLoadingCrisis(true);
      const res = await CrisisService.loadCrisiss();
      if (res.status === 200) {
        setCrisisOptions(res.data.crisiss || res.data.crisis || []);
      }
    } catch (error) {
      console.error("Error loading crisis options: ", error);
    } finally {
      setLoadingCrisis(false);
    }
  };

  const handleLoadSituations = async () => {
    try {
      setLoadingSituations(true);
      const res = await SituationService.loadSituations();
      if (res.status === 200) {
        setSituations(res.data.situations || []);
      }
    } catch (error) {
      console.error("Error loading situations: ", error);
    } finally {
      setLoadingSituations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadCrisis();
      handleLoadSituations();
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleStoreApplicant}>
          <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
            FILE APPLICATION
          </h1>

          {/* Directions Section */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">
              DIRECTIONS FOR FILLING:
            </h2>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                Fill out the information requested below. All fields marked with
                red asterisk (*) are required.
              </p>
            </div>
          </div>

          {/* Program Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Program
            </h3>
            {/* <div className="md:col-span-2"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FloatingLabelSelect
                  label="Assistance Program"
                  name="crisis"
                  value={crisis}
                  onChange={(e) => setCrisis(e.target.value)}
                  required
                  errors={errors.crisis}
                >
                  {loadingCrisis ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Assistance</option>
                      {crisisOptions.map((crisisOption, index) => (
                        <option value={crisisOption.crisis_id} key={index}>
                          {crisisOption.crisis}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
              </div>
              <div>
                <FloatingLabelInput
                  label="Date of Incident"
                  type="date"
                  name="incident_date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  errors={errors.incident_date}
                />
              </div>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FloatingLabelInput
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  errors={errors.first_name}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="Middle Name"
                  type="text"
                  name="middle_name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  errors={errors.middle_name}
                />
              </div>
              <div>
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
              <div>
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={suffixName}
                  onChange={(e) => setSuffixName(e.target.value)}
                  errors={errors.suffix_name}
                />
              </div>
              <div>
                <FloatingLabelSelect
                  label="Sex"
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
                      <option value="">Select Sex</option>
                      {genders.map((genderOption, index) => (
                        <option value={genderOption.gender_id} key={index}>
                          {genderOption.gender}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
              </div>
              <div>
                <FloatingLabelSelect
                  label="Civil Status"
                  name="civil_status"
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value)}
                  required
                >
                  <option value="">Select Civil Status</option>
                  {civilStatusOptions.map((option, index) => (
                    <option value={option.value} key={index}>
                      {option.label}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FloatingLabelInput
                  label="Mobile Number"
                  type="text"
                  name="mobile_number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  errors={errors.contact_number}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="Email Address"
                  type="email"
                  name="email_address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  errors={errors.gmail}
                />
              </div>
            </div>
          </div>

          {/* Additional Required Fields (from existing interface) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
              <div>
                <FloatingLabelInput
                  label="House No."
                  type="text"
                  name="house_no"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  required
                  errors={errors.house_no}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="Street"
                  type="text"
                  name="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  errors={errors.street}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="Subdivision"
                  type="text"
                  name="subdivision"
                  value={subdivision}
                  onChange={(e) => setSubdivision(e.target.value)}
                  errors={errors.subdivision}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="Barangay"
                  type="text"
                  name="barangay"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  required
                  errors={errors.barangay}
                />
              </div>
              <div>
                <FloatingLabelInput
                  label="City"
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  errors={errors.city}
                />
              </div>
              <div className="md:col-span-2">
                <FloatingLabelSelect
                  label="Current Situation"
                  name="situation"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  required
                  errors={errors.situation}
                >
                  {loadingSituations ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Current Situation</option>
                      {situations.map((situationOption, index) => (
                        <option
                          value={situationOption.situation_id}
                          key={index}
                        >
                          {situationOption.situation}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
              </div>
            </div>
          </div>

          {/* Attachment Files Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Attachment Files
            </h3>
            <div className="mb-4">
              <UploadInput
                label="Attach Supporting Documents (Optional)"
                name="attached_file"
                value={attachedFile}
                onChange={setAttachedFile}
                errors={errors.add_applicant_file}
              />
            </div>
          </div>

          {/* Declaration & Consent Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Declaration & Consent
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> I hereby declare that
                  the information provided above is true and correct to the best
                  of my knowledge. I understand that any false information may
                  result in the rejection of my application. I consent to the
                  processing of my personal data in accordance with the Data
                  Privacy Act of 2012.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            {!loadingStore && <CloseButton label="Cancel" onClose={onClose} />}
            <SubmitButton
              label="Submit Application"
              loading={loadingStore}
              loadingLabel="Submitting Application..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddApplicantFormModal;
