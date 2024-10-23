import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
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
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
export type Project = {
  projectId?: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  regionsReached?: number;
  districtsReached?: number;
  schoolsReached?: number;
  studentsReached?: number;
  status?: number;
  dateStart?: string;
  dateEnd?: string;
  publisherId?: string;
};

export type ProjectAsset = {
  assetId?:string;
  projectId?:string;
  assetUrl?:string;
}

export enum projectStatusEnum {
  Completed = 0,
  Ongoing,
}

export type ProjectStatus = {
  key?: number;
  value?: string;
};

export default function DashProjectsListPage() {
  const columns = [
    "Title",
    "Description",
    "Regions Reached",
    "Districts Reached",
    "Schools Reached",
    "Students Reached",
    "Actions",
  ];
  const actionTypes = ["detail", "edit", "delete"];
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjects, setIsProjects] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const [] = useState<ProjectStatus[]>(() => {
    return [
      {
        key: projectStatusEnum.Completed,
        value: "Completed",
      },
      {
        key: projectStatusEnum.Ongoing,
        value: "Ongoing",
      },
    ];
  });
  const nav = useNavigate();

  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();

  useEffect(() => {
    if (!isProjects) {
      setIsloading(true);
      axios
        .get(`${api}/projects`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          const dataList: Project[] = Array.from(res.data).flatMap((p: any) => {
            const data: Project = {
              projectId: `${p?.projectId}`,
              title: `${p?.title}`,
              description: `${p?.description}`,
              status: Number(`${p?.status}`),
              regionsReached: Number(`${p?.regionsReached}`),
              districtsReached: Number(`${p?.districtsReached}`),
              schoolsReached: Number(`${p?.schoolsReached}`),
              studentsReached: Number(`${p?.studentsReached}`),
              thumbnailUrl: `${p?.thumbnailUrl ?? ""}`,
              publisherId: `${p?.publisherId ?? ""}`,
            };
            return [data];
          });
          setIsProjects(true);

          setProjects(dataList);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [isProjects]);

  const handleSelectedRow = (p: Project) => {
    nav(`/dashboard/projects/${p?.projectId}`, {
      state: p?.projectId,
    });
  };

  const handleAction = (p: Project, action: string) => {
    switch (action) {
      case actionTypes[0]:
        //alert(`Detail ${p.title}`);
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        handleSelectedRow(p);
        break;
      case actionTypes[2]:
        //alert(`Delete ${p.title}`);
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (i: Project) => {
    axios
      .delete(`${api}/projects/${i?.projectId}`, {
        headers:{
          Authorization:`Bearer ${authed?.token}`,
          "Content-Type":'application/json',
          Accept:'application/json'
        },
        method: "DELETE",
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

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Projects</h1>

          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              nav("/dashboard/projects/create", {
                state: null,
              });
            }}
          >
            Add{" "}
            <span>
              <GoPlus size={20} />
            </span>
          </Button>
        </div>
        <Divider />

        {isLoading ? (
          <>
            <Spinner
              size="lg"
              className=" flex justify-center "
              label="Loading..."
              color="primary"
            />
          </>
        ) : (
          <Table fullWidth isStriped removeWrapper>
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column}>{column}</TableColumn>
              ))}
            </TableHeader>
            <TableBody
              emptyContent="No Projects at the moment"
              items={projects}
            >
              {projects.map((project, i) => (
                <TableRow className="w-full" key={i}>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.title}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.description}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.regionsReached}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.districtsReached}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.schoolsReached}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(project)}>
                    {project?.studentsReached}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Detail">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() =>
                              handleAction(project, actionTypes[0])
                            }
                          />
                        </span>
                      </Tooltip>

                      {/* <Tooltip content="Edit">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoPencil
                          onClick={() => handleAction(project, actionTypes[1])}
                        />
                      </span>
                    </Tooltip> */}

                      <Tooltip color="danger" content="Delete">
                        <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                          <GoTrash
                            onClick={() =>
                              handleAction(project, actionTypes[2])
                            }
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
