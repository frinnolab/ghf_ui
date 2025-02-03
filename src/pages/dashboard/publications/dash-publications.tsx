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
export default function DashPublications() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const actionTypes = ["detail", "edit", "delete"];
  const columns = ["Title", "Type", "Actions"];
  const [publications, setPublication] = useState<Publication[]>([]);
  const [hasPubs, setHasPub] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const authed = useAuthedProfile();


  const handleSelectedRow = (p: Publication) => {
    nav(`/dashboard/publications/${p?.publishId}`, {
      state: p?.publishId,
    });
  };

  const handleAction = (p: Publication, action: string) => {
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

  const handleDelete = (i: Publication) => {
    axios
      .delete(`${api}/publications/${i?.publishId}`, {
        headers:{
          Authorization: `Bearer ${authed?.token}`,
        },
        method: "DELETE",
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.warn(err?.response);
      });
  };

  const setTypeName = (pubType: PublishTypeEnum) => {
    switch (pubType) {
      case PublishTypeEnum.Report:
        return "Report";
      case PublishTypeEnum.Newsletter:
        return "Newsletter";
      case PublishTypeEnum["Student Manual"]:
        return "Student Manual";
    }
  };

  useEffect(() => {
    if (!hasPubs) {
      setIsloading(true);

      axios
        .get(`${api}/publications`)
        .then((res: AxiosResponse) => {
          const data: Publication[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const resData: Publication = {
                publishId: `${d?.publishId}`,
                title: d?.title,
                publishType: d?.publishType,
              };
              return [resData];
            }
          );

          setHasPub(true);
          setPublication(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [hasPubs]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Publications</h1>

          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              nav("/dashboard/publications/create", {
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
              emptyContent="No publications at the moment"
              items={publications ?? []}
            >
              {publications.map((pub, i) => (
                <TableRow className="w-full" key={i}>
                  <TableCell onClick={() => handleSelectedRow(pub)}>
                    {pub?.title}
                  </TableCell>

                  <TableCell onClick={() => handleSelectedRow(pub)}>
                    {setTypeName(Number(pub.publishType))}
                  </TableCell>

                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Detail">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(pub, actionTypes[0])}
                          />
                        </span>
                      </Tooltip>

                      <Tooltip color="danger" content="Delete">
                        <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                          <GoTrash
                            onClick={() => handleAction(pub, actionTypes[2])}
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

export type Publication = {
  publishId?: string;
  title?: string;
  description?: string;
  publishType?: PublishTypeEnum;
  publishDate?: string;
  authorId?: string;
};

export type PublicationStatus = {
  key?: number;
  value?: string;
};

export type PublicationAsset = {
  publishId?: string;
  assetId?: string;
  assetUrl?: string;
  title?: string;
  assetType?: string;
};

export enum PublishTypeEnum {
  Report = 0,
  Newsletter = 1,
  "Student Manual" = 2,
}
