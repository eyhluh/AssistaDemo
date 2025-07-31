import { Link } from "react-router-dom";
import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import type { GenderColumns } from "../../../interfaces/GenderColumns";
import GenderService from "../../../services/GenderService";
import Spinner from "../../../components/Spinner/Spinner";

interface GenderListProps {
  refreshKey: boolean;
}

const GenderList: FC<GenderListProps> = ({ refreshKey }) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);

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
  useEffect(() => {
    handleLoadGenders();
  }, [refreshKey]);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh-15)] overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-blue-600 text-white sticky top-0 z-30 text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-500">
              {loadingGenders ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                genders.map((gender, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-5 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {gender.gender}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <div className="flex justify-center items-center">
                        <Link
                          to={`/gender/edit/${gender.gender_id}`}
                          className="text-green-600 hover-underline font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default GenderList;
