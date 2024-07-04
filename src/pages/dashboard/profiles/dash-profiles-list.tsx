import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { GoEye, GoPencil, GoPlus, GoTrash } from "react-icons/go";
import useAuthedProfile from "@/hooks/use-auth";
import axios, { AxiosResponse } from "axios";
import { AuthRole } from "@/types";

export type Profile = {
  profileId?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  position?: string;
  role?: number;
};

export default function DashProfilesListPage() {
  const columns = ["Email", "Firstname", "Lastname", "Role", "Actions"];
  const actionTypes = ["detail", "edit", "delete"];
  const authed = useAuthedProfile();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const handleSelectedRow = (p: Profile) => {
    console.log(p);
  };

  const handleAction = (p: Profile, action: string) => {
    switch (action) {
      case actionTypes[0]:
        alert(`Detail ${p.email}`);
        break;
      case actionTypes[1]:
        alert(`Edit ${p.email}`);
        break;
      case actionTypes[2]:
        alert(`Delete ${p.email}`);
        break;
    }
  };

  const roleName = (role: number) => {
    switch (role) {
      case AuthRole.Admin:
        return "Admin";
      case AuthRole.SuperAdmin:
        return "Super Admin";
      default:
        return "User";
    }
  };

  useEffect(() => {
    axios
      .get(`${api}/profiles`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        //console.log(res.data);

        const profilesData: Profile[] = Array.from(res?.data).flatMap(
          (p: any) => {
            console.log(p);

            const data: Profile = {
              profileId: `${p?.profileId}`,
              firstname: `${p?.firstname ?? ""}`,
              lastname: `${p?.lastname ?? ""}`,
              email: `${p?.email ?? ""}`,
              position: `${p?.position ?? ""}`,
              role: Number(p.roleType) ?? AuthRole.User,
            };
            return [data];
          }
        );
        setProfiles(profilesData);
      });
  }, [api]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Profiles</h1>

          <Button variant="solid" color="primary">
            Add{" "}
            <span>
              <GoPlus size={20} />
            </span>
          </Button>
        </div>
        <Divider />

        <Table fullWidth isStriped removeWrapper>
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="No profiles at the moment" items={profiles}>
            {profiles.map((profile, i) => (
              <TableRow className="w-full" key={i}>
                <TableCell onClick={() => handleSelectedRow(profile)}>
                  {profile?.email}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(profile)}>
                  {profile?.firstname}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(profile)}>
                  {profile?.lastname}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(profile)}>
                  {roleName(Number(profile?.role ?? 0))}
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Detail">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoEye
                          onClick={() => handleAction(profile, actionTypes[0])}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip content="Edit">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoPencil
                          onClick={() => handleAction(profile, actionTypes[1])}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip color="danger" content="Delete">
                      <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                        <GoTrash
                          onClick={() => handleAction(profile, actionTypes[2])}
                        />
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
