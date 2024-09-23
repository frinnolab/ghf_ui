import DashboardLayout from "@/layouts/dash-layout";
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
import { useEffect, useState } from "react";
import { GoEye, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";

export default function DashDonations() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const actionTypes = ["detail", "edit", "delete"];
  const columns = ["Email", "Company", "Amount Pledged", "Actions"];
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const [] = useState<DonationType[] | null>(() => {
    let data: DonationType[] = [];
    axios
      .get(`${api}/donations/types`)
      .then((res: AxiosResponse) => {
        console.log(res?.data);
        data = Array.from(res?.data).flatMap((d: any) => {
          const dType: DonationType = {
            title: d?.title,
            type: Number(d?.type),
          };
          return [dType];
        });
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        return null;
      });

    if (data?.length > 0) {
      return [...data];
    } else {
      return null;
    }
  });

  const [] = useState<DonationCurrencyType[] | null>(() => {
    let data: DonationCurrencyType[] = [];
    axios
      .get(`${api}/donations/currencies`)
      .then((res: AxiosResponse) => {
        console.log(res?.data);
        data = Array.from(res?.data).flatMap((d: any) => {
          const dType: DonationCurrencyType = {
            title: d?.title,
            type: Number(d?.type),
            shortName: d?.shortname,
          };
          return [dType];
        });
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        return null;
      });

    if (data?.length > 0) {
      return [...data];
    } else {
      return null;
    }
  });
  const [hasDonations, setHasDonations] = useState<boolean>(false);

  const handleSelectedRow = (p: Donation) => {
    nav(`/dashboard/donations/${p?.donationId}`, {
      state: p?.donationId,
    });
  };

  const handleAction = (p: Donation, action: string) => {
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

  const handleDelete = (i: Donation) => {
    axios
      .delete(`${api}/donations/${i?.donationId}`, {
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
    if (!hasDonations) {
      setIsloading(true);

      axios
        .get(`${api}/donations`)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Donation[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const resData: Donation = {
              donationId: `${d?.donationId}`,
              email: d?.email,
              company: d?.company,
              amountPledged: d?.amountPledged,
            };
            return [resData];
          });

          setHasDonations(true);
          setDonations(data);

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
  }, [hasDonations]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Donations</h1>

          {/* <Button
            variant="solid"
            color="primary"
            onClick={() => {
              nav("/dashboard/donations/create", {
                state: null,
              });
            }}
          >
            Add{" "}
            <span>
              <GoPlus size={20} />
            </span>
          </Button> */}
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
              emptyContent="No Donations at the moment"
              items={donations ?? []}
            >
              {donations?.map((d) => (
                <TableRow className="w-full" key={d?.donationId}>
                  <TableCell onClick={() => handleSelectedRow(d)}>
                    {d?.email}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(d)}>
                    {d?.company}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(d)}>
                    {d?.amountPledged}
                  </TableCell>

                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="Detail">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(d, actionTypes[0])}
                          />
                        </span>
                      </Tooltip>

                      <Tooltip color="danger" content="Delete">
                        <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                          <GoTrash
                            onClick={() => handleAction(d, actionTypes[2])}
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

export type Donation = {
  donationId?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  description?: string;
  mobile?: string;
  amountPledged?: string;
  donorCurrencyType?: number;
  donorType?: number;
  statusType?: number;
};

export type DonationType = {
  id?: string;
  title?: string;
  type?: number;
};
export type DonationStatus = {
  id?: string;
  title?: string;
  type?: number;
};

export type DonationCurrencyType = {
  id?: string;
  title?: string;
  shortName?: string;
  type?: number;
};

//Type Enums
export enum DonationTypeEnum {
  "LOCAL DONOR" = 0,
  "FOREIGN DONOR" = 1,
}

export enum DonationCurrencyEnum {
  "TZS" = 0,
  "USD" = 1,
  "GBP" = 2,
}

export enum DonationStatusEnum {
  "UNPAID" = 0,
  "PAID" = 1,
}
