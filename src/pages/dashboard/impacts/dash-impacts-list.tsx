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
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export type Impact = {
  impactId?: string;
  title?: string;
  description?: string;
  schoolName?: string;
  schoolRegion?: string;
  schoolDistrict?: string;
  studentGirls?: number;
  studentBoys?: number;
  studentsTotal?: number;
};

export type ImpactAsset = {
  impactId?: string;
  impactAssetId?: string;
  title?: string;
  description?: string;
  assetUrl?: string;
};
const DashImpactsListPage = () => {
  const actionTypes = ["detail", "edit", "delete"];
  const columns = ["Title", "School Name", "Total students", "Actions"];
  const nav = useNavigate();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [isImpacts, setIsImpacts] = useState<boolean>(false);

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
        alert(`Delete ${p.title}`);
        break;
    }
  };

  useEffect(() => {
    if (!isImpacts) {
      axios
        .get(`${api}/impacts`)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          setIsImpacts(true);
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const resData: Impact = {
              impactId: `${d?.impactId}`,
              title: `${d?.title}`,
              schoolName: `${d?.schoolName}`,
              studentsTotal: Number(d?.studentsTotal),
            };
            return [resData];
          });

          setImpacts(() => {
            return [...data];
          });
        })
        .catch((err: AxiosError) => {
          setIsImpacts(true);
          console.log(err);
        });
    }
  }, [impacts]);

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
                  {impact?.schoolName}
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
      </div>
    </DashboardLayout>
  );
};

export default DashImpactsListPage;
