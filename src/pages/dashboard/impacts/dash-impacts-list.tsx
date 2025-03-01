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

export type Impact = {
  impactId?: string;
  assetUrl?: string;
  title?: string;
  description?: string;
  schoolName?: string;
  schoolRegion?: string;
  schoolDistrict?: string;
  studentGirls?: number;
  studentBoys?: number;
  studentsTotal?: number;
  schoolsTotal?: number;
};

export type ImpactAsset = {
  impactId?: string;
  impactAssetId?: string;
  assetUrl?: string;
  isGeneralVideo?: boolean;
};


export type ImpactReport = {
  impactId?: string;
  impactReportId?: string;
  reportUrl?: string;
  title?: string;
};
const DashImpactsListPage = () => {
  const actionTypes = ["detail", "edit", "delete"];
  const columns = ["Title", "Total Schools", "Total students", "Actions"];
  const nav = useNavigate();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [isImpacts, setIsImpacts] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const handleSelectedRow = (p: Impact) => {
    nav(`/dashboard/impacts/${p?.impactId}`, {
      state: p?.impactId,
    });
  };

  const handleAction = (p: Impact, action: string) => {
    switch (action) {
      case actionTypes[0]:
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        handleSelectedRow(p);
        break;
      case actionTypes[2]:
        setIsloading(true);
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (i: Impact) => {
    axios
      .delete(`${api}/impacts/${i?.impactId}`, {
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

  useEffect(() => {
    if (!isImpacts) {
      setIsloading(true);
      axios
        .get(`${api}/impacts`)
        .then((res: AxiosResponse) => {
          setIsImpacts(true);
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const resData: Impact = {
              impactId: `${d?.impactId}`,
              title: d?.title,
              schoolName: d?.schoolName,
              studentsTotal: Number(d?.studentsTotal),
              schoolsTotal: Number(d?.schoolsTotal),
            };
            return [resData];
          });

          setImpacts(() => {
            return [...data];
          });

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          setIsImpacts(true);
          console.log(err);
        });
    }
  }, [impacts, isImpacts]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Impacts</h1>

          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              nav("/dashboard/impacts/create", {
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
            <TableBody emptyContent="No Impacts at the moment" items={impacts}>
              {impacts.map((impact, i) => (
                <TableRow className="w-full" key={i}>
                  <TableCell onClick={() => handleSelectedRow(impact)}>
                    {impact?.title}
                  </TableCell>

                  <TableCell onClick={() => handleSelectedRow(impact)}>
                    {impact?.schoolsTotal ?? 0}
                  </TableCell>

                  <TableCell onClick={() => handleSelectedRow(impact)}>
                    {impact?.studentsTotal}
                  </TableCell>

                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Detail">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(impact, actionTypes[0])}
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
                            onClick={() => handleAction(impact, actionTypes[2])}
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
};

export default DashImpactsListPage;
