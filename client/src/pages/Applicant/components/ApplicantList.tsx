import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";

import { BsPencilSquare, BsTrash } from "react-icons/bs";

import type { ApplicantColumns } from "../../../interfaces/ApplicantInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Spinner from "../../../components/Spinner/Spinner";
import ApplicationService from "../../../services/ApplicationService";

interface ApplicantListProps {
  onAddApplicant: () => void;
  //onEditApplicant: (applicant: ApplicantColumns | null) => void;
  //onDeleteApplicant: (applicant: ApplicantColumns | null) => void;
  refreshKey: boolean;
}

const ApplicantList: FC<ApplicantListProps> = ({
  onAddApplicant,
  //onEditApplicant,
  //onDeleteApplicant,
  refreshKey,
}) => {
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantColumns[]>([]);
  const [applicantsTableCurrentPage, setApplicantsTableCurrentPage] =
    useState(1);
  const [applicantsTableLastPages, setApplicantsTableLastPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadApplicants = async (
    page: number,
    append = false,
    search: string
  ) => {
    try {
      setLoadingApplicants(true);

      const res = await ApplicationService.loadApplications(search);

      if (res.status === 200) {
        const applicationsData =
          res.data.applications.data || res.data.applications || [];
        const lastPage =
          res.data.applications.last_page ||
          res.data.last_page ||
          applicantsTableLastPages ||
          1;

        setApplicants(
          append ? [...applicants, ...applicationsData] : applicationsData
        );
        setApplicantsTableCurrentPage(page);
        setApplicantsTableLastPages(lastPage);
        setHasMore(page < lastPage);
      } else {
        setApplicants(append ? applicants : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      setApplicants(append ? applicants : []);
      setHasMore(false);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingApplicants
    ) {
      handleLoadApplicants(
        applicantsTableCurrentPage + 1,
        true,
        debounceSearch
      );
    }
  }, [hasMore, loadingApplicants, applicantsTableCurrentPage, debounceSearch]);

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

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setApplicants([]);
    setApplicantsTableCurrentPage(1);
    setHasMore(true);

    handleLoadApplicants(1, false, debounceSearch);
  }, [refreshKey, debounceSearch]);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          ref={tableRef}
          className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto"
        >
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="p-4 flex justify-between">
                  <div className="w-64">
                    <FloatingLabelInput
                      label="Search Applications"
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-colors cursor-pointer"
                    onClick={onAddApplicant}
                  >
                    Add Application
                  </button>
                </div>
              </div>
            </caption>
            <TableHeader className="border-b border-gray-200 bg-blue-600 text-white sticky top-0 z-10 text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Contact Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Gmail
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Crisis
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Attached Files
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {applicants.length > 0 ? (
                applicants.map((applicant, index) => (
                  <TableRow
                    className="hover:bg-gray-100"
                    key={applicant.application_id || applicant.applicant_id}
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleApplicantFullNameFormat(applicant)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {applicant.gender?.gender || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {applicant.contact_number}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {applicant.gmail}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {applicant.crisis?.crisis || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {applicant.attached_file_url ? (
                        <a
                          href={applicant.attached_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "No File"
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-3 justify-center">
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          //onClick={() => onEditApplicant(applicant)}
                          title="Edit Application"
                        >
                          <BsPencilSquare className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          //onClick={() => onDeleteApplicant(applicant)}
                          title="Delete Application"
                        >
                          <BsTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingApplicants && applicants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-4 py-3 text-center font-medium"
                  >
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : null}
              {loadingApplicants && applicants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              {loadingApplicants && applicants.length > 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ApplicantList;
