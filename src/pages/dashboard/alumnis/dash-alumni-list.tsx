/* eslint-disable no-console */
import DashboardLayout from "@/layouts/dash-layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "../profiles/dash-profiles-list";
import {
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { GoEye, GoTrash } from "react-icons/go";

import { AuthRole } from "@/types";
import useAuthedProfile from "@/hooks/use-auth";

export default function DashAlumniList() {
  const actionTypes = ["detail", "edit", "delete"];
  const authed = useAuthedProfile();

  const columns = ["Firstname", "School", "Year", "Actions"];
  const nav = useNavigate();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [isAlumniPublished, setIsAlumniPublished] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const handleSelectedRow = (p: Alumni) => {
    nav(`/dashboard/alumni/${p?.alumniId}`, {
      state:{
        'alumniId':`${p?.alumniId}`,
        'alumniProfileId':`${p?.profileId}`
      },
    });
  };

  const handleAction = (p: Alumni, action: string) => {
    switch (action) {
      case actionTypes[0]:
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        handleSelectedRow(p);
        break;
      case actionTypes[2]:
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (i: Alumni) => {
    axios
      .delete(`${api}/alumnis/${i?.alumniId}`, {
        method: "DELETE",
        headers:{
          "Authorization":`Bearer ${authed?.token}`
        }
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isAlumni) {
      setIsloading(true);
      axios
        .get(`${api}/alumnis`)
        .then((res: AxiosResponse) => {

          console.log(res?.data);
          
          setIsAlumni(true);
          const data: Alumni[] = Array.from(res?.data).flatMap((d: any) => {

            const data: Profile = {
              profileId: d?.alumniProfile?.profileId,
              firstname: d?.alumniProfile?.firstname ?? "",
              lastname: d?.alumniProfile?.lastname ?? "",
              email: d?.alumniProfile?.email ?? "",
              role: Number(d?.alumniProfile.roleType) ?? AuthRole.Alumni,
              avatarUrl: d?.alumniProfile?.avatarUrl ?? "",
              position: d?.alumniProfile?.position ?? "",
              mobile: d?.alumniProfile?.mobile ?? "",
            };

            const resData: Alumni = {
              alumniId: `${d?.alumniId}`,
              alumniProfile: data,
              participationSchool: d?.participationSchool,
              participationYear: d?.participationYear,
              currenctOccupation: d?.currenctOccupation,
              profileId: d?.profileId,
              age: d?.age,
              story: d?.story,
              isPublished: Boolean(Number(res?.data["isPublished"])),
            };

            console.log(Number(res?.data["isPublished"]));
            

            const isAlumniPub =
              Number(res?.data["isPublished"]) === 1 ? true : false;

            setIsAlumniPublished(isAlumniPub);

            return [resData];
          });

          setAlumnis(() => {
            return [...data];
          });

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          setIsAlumni(true);
          console.log(err);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [alumnis, isAlumni]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Alumnis</h1>
        </div>
        <Divider />

        {isLoading ? (
          <>
            <Spinner
              className=" flex justify-center "
              color="primary"
              label="Loading Alumnis..."
              size="lg"
            />
          </>
        ) : (
          <Table fullWidth isStriped removeWrapper>
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column}>{column}</TableColumn>
              ))}
            </TableHeader>

            <TableBody emptyContent="No Alumnis at the moment" items={alumnis}>
              {alumnis?.map((alumni, i) => (
                <TableRow className="w-full" key={i}>
                  <TableCell onClick={() => handleSelectedRow(alumni)}>
                    {alumni?.alumniProfile?.firstname}
                  </TableCell>

                  <TableCell onClick={() => handleSelectedRow(alumni)}>
                    {alumni?.participationSchool}
                  </TableCell>

                  <TableCell onClick={() => handleSelectedRow(alumni)}>
                    {alumni?.participationYear}
                  </TableCell>
{/* 
                  <TableCell onClick={() => handleSelectedRow(alumni)}>
                    {isAlumniPublished ? "Published" : " Not Published "}
                  </TableCell> */}

                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Detail">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(alumni, actionTypes[0])}
                          />
                        </span>
                      </Tooltip>

                      <Tooltip color="danger" content="Delete">
                        <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                          <GoTrash
                            onClick={() => handleAction(alumni, actionTypes[2])}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
}

export type Alumni = {
  alumniId?: string;
  profileId?: string;
  alumniProfile?: Profile;
  age?: number;
  participationSchool?: string;
  participationYear?: string;
  currenctOccupation?: string;
  story?: string;
  isPublished?: boolean;
};
