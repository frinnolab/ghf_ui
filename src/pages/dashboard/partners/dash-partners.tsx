import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { AuthRole, PartnerType } from "@/types";
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
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export type Partner = {
  partnerId?: string;
  logoUrl?: string;
  name?: string;
  description?: string;
  type?: number;
};

export type PartnerTypes = {
  key?: string;
  value?: number;
};
export default function DashboardPartnersPage() {
  const columns = ["Name", "Type", "Actions"];
  const actionTypes = ["detail", "edit", "delete"];
  const authed = useAuthedProfile();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [partners, setpartners] = useState<Partner[]>([]);
  const [isPartner, setIsPartners] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPartner) {
      axios
        .get(`${api}/partners`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          //console.log(res.data);

          const partnersData: Partner[] = Array.from(res?.data).flatMap(
            (p: any) => {
              console.log(p);

              const data: Partner = {
                partnerId: `${p?.partnerId}`,
                name: `${p?.name}`,
                type: Number(p?.type) ?? Number(PartnerType.PARTNER) ?? 0,
              };
              return [data];
            }
          );
          setpartners(partnersData);

          setIsPartners(true);
        });
    }
  }, [partners, isPartner]);

  const handleSelectedRow = (p: Partner) => {
    navigate(`/dashboard/partners/${p.partnerId}`, {
      state: p.partnerId,
    });
  };

  const handleDelete = (p: Partner) => {
    if (authed?.role == AuthRole.User) {
      alert(HttpStatusCode.Unauthorized);
    }

    axios
      .delete(`${api}/partners/${p?.partnerId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data ?? err.response?.statusText);
      });
  };

  const handleAction = (p: Partner, action: string) => {
    switch (action) {
      case actionTypes[0]:
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        //        alert(`Edit ${p.name}`);
        handleSelectedRow(p);

        break;
      case actionTypes[2]:
        handleDelete(p);
        break;
    }
  };

  const typeName = (type: number) => {
    switch (type) {
      case PartnerType.DONOR:
        return "DONOR";
      case PartnerType.PARTNER:
        return "PARTNER";
      case PartnerType.COLLABORATOR:
        return "COLLABORATOR";
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Partners</h1>

          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              navigate("/dashboard/partners/create", {
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

          <TableBody emptyContent="No Partners at the moment" items={partners}>
            {partners.map((partner, i) => (
              <TableRow className="w-full" key={i}>
                <TableCell onClick={() => handleSelectedRow(partner)}>
                  {partner?.name}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(partner)}>
                  {typeName(Number(partner?.type))}
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="View">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoEye
                          onClick={() => handleAction(partner, actionTypes[0])}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip color="danger" content="Delete">
                      <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                        <GoTrash
                          onClick={() => handleAction(partner, actionTypes[2])}
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
