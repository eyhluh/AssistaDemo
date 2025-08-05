import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../interfaces/UserInterface";

interface AddUserModalProps {
  onAddUser: () => void;
  onEditUser: (user: UserColumns | null) => void;
  onDeleteUser: (user: UserColumns | null) => void;
  refreshKey: boolean;
}

const UserList: FC<AddUserModalProps> = ({
  onAddUser,
  onEditUser,
  onDeleteUser,
  refreshKey,
}) => {
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [users, setUsers] = useState<UserColumns[]>([]);

  const handleLoadUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await UserService.loadUsers();

      if (res.status === 200) {
        setUsers(res.data.users);
      } else {
        console.error(
          "Unexpected status error while loading users:",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error uccured while loading users:",
        error
      );
    } finally {
      setLoadingUsers(false);
    }
  };
  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = "";
    if (user.middle_name) {
      fullName = `${user.last_name}, ${
        user.first_name
      } ${user.middle_name.charAt(0)}.`;
    } else {
      fullName = `${user.last_name} ,${user.first_name}`;
    }
    if (user.suffix_name) {
      fullName += ` ${user.suffix_name}`;
    }
    return fullName;
  };
  useEffect(() => {
    handleLoadUsers();
  }, [refreshKey]);

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
            <TableBody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-3 px-4">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-4 py-3 text-start">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleUserFullNameFormat(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.gender.gender}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.birth_date}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.age}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex  gap-4">
                        <button
                          type="button"
                          className="text-green-600 hover:underline font-medium cursor-pointer"
                          onClick={() => onEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:ubderline font-medium cursor-pointer"
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete
                        </button>
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

export default UserList;
