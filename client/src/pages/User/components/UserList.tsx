import type { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";

interface AddUserModalProps {
  onAddUser: () => void;
}

const UserList: FC<AddUserModalProps> = ({ onAddUser }) => {
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh-15)] overflow-x-auto">
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="flex justify-end items-center p-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium shadow-sm transition cursor-pointer"
                    onClick={onAddUser}
                  >
                    Add User
                  </button>
                </div>
              </div>
            </caption>
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
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/*{users.map((user, index) => (
                <TableRow className="hover:bg-gray-100" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {user.no}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.first_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.middle_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.last_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.suffix_name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-start">
                    {user.gender}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.address}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {user.action}
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UserList;
