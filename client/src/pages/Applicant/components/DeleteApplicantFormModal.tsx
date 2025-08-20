import { useState, type FC } from "react";
import Modal from "../../../components/Modal";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import ApplicationService from "../../../services/ApplicationService";
import type { ApplicantColumns } from "../../../interfaces/ApplicantInterface";

interface DeleteApplicantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantColumns | null;
  onApplicantDeleted: (message: string) => void;
  refreshKey: () => void;
}

const DeleteApplicantFormModal: FC<DeleteApplicantFormModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onApplicantDeleted,
  refreshKey,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);

  // Function to format applicant's full name
  const handleApplicantFullNameFormat = (applicant: ApplicantColumns) => {
    let fullName = "";

    if (applicant.middle_name) {
      fullName = `${applicant.last_name}, ${
        applicant.first_name
      } ${applicant.middle_name.charAt(0)}.`;
    } else {
      fullName = `${applicant.last_name}, ${applicant.first_name}`;
    }

    if (applicant.suffix_name) {
      fullName += ` ${applicant.suffix_name}`;
    }

    return fullName;
  };

  const handleDeleteApplication = async () => {
    try {
      setLoadingDelete(true);

      const applicationId =
        applicant?.application_id || applicant?.applicant_id;
      if (!applicationId) {
        throw new Error("Application ID not found");
      }

      const res = await ApplicationService.destroyApplication(applicationId);

      if (res.status === 200) {
        onApplicantDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected error occurred during deleting application:",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting application:",
        error
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  if (!applicant) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Delete Application
          </h2>
          <ModalCloseButton onClose={onClose} />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete this application?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action will permanently delete the application for:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-800">
                {handleApplicantFullNameFormat(applicant)}
              </p>
              <p className="text-sm text-gray-600">{applicant.gmail}</p>
              <p className="text-sm text-gray-600">
                {applicant.contact_number}
              </p>
              {applicant.crisis && (
                <p className="text-sm text-gray-600">
                  Crisis: {applicant.crisis.crisis}
                </p>
              )}
            </div>
            <p className="text-sm text-red-600 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loadingDelete}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteApplication}
            disabled={loadingDelete}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingDelete ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting Application...
              </div>
            ) : (
              "Delete Application"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteApplicantFormModal;
