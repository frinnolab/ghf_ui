import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Donation,
  DonationCurrencyType,
  DonationType,
} from "./dash-donations-list";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil } from "react-icons/go";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

export default function DashDonationView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const nav = useNavigate();
  const route = useLocation();
  const [donationId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [donation, setDonation] = useState<Donation | null>(null);

  const handleBack = () => nav("/dashboard/donations");

  const [donationTypes, setDonationTypes] = useState<DonationType[] | null>(
    null
  );
  const [selectedDonorType, setSelectedselectedDonorType] =
    useState<DonationType>();

  const [currencyTypes, setCurrencyTypes] = useState<
    DonationCurrencyType[] | null
  >(null);

  const [selectedDonorCurrType, setSelectedselectedDonorCurrType] =
    useState<DonationCurrencyType>();

  const fetchDonationTypes = () => {
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

        setDonationTypes([...data]);
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        return null;
      });
  };

  const fetchDonations = () => {
    axios
      .get(`${api}/donations/${donationId}`)
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const data: Donation = {
            amountPledged: res?.data?.amountPledged,
            company: res?.data?.company,
            description: res?.data?.description,
            donationId: res?.data?.donationId,
            email: res?.data?.email,
            firstname: res?.data?.firstname,
            lastname: res?.data?.lastname,
            mobile: res?.data?.mobile,
            donorCurrencyType: Number(res?.data?.donorCurrencyType),
            donorType: Number(res?.data?.donorType),
          };

          setDonation(data);

          console.log(res?.data);
          

          //SetDonation Type
          const donorType: DonationType = {
            title: `${donationTypes?.find((d) => d?.type === Number(res?.data?.donorType))?.title}`,
            type: Number(
              donationTypes?.find(
                (d) => d?.type === Number(res?.data?.donorType)
              )?.type
            ),
          };
          setSelectedselectedDonorType(donorType);

          //Setcurrency Type
          const donorCurrType: DonationCurrencyType = {
            title: `${currencyTypes?.find((d) => d?.type === Number(res?.data?.donorCurrencyType))?.title}`,
            type: Number(
              donationTypes?.find(
                (d) => d?.type === Number(res?.data?.donorCurrencyType)
              )?.type
            ),
            shortName: `${currencyTypes?.find((d) => d?.type === Number(res?.data?.donorCurrencyType))?.shortName}`,
          };
          setSelectedselectedDonorCurrType(donorCurrType);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const fetchCurrencyTypes = () => {
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

        setCurrencyTypes([...data]);
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        return null;
      });
  };

  const { register, handleSubmit } = useForm<Donation>();
  const onDonationSubmit: SubmitHandler<Donation> = (d) => {
    onSaveDonor(d);
  };

  const changeDonorType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = donationTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setSelectedselectedDonorType(statusVal);
  };

  const changeDonorCurrType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = currencyTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setSelectedselectedDonorCurrType(statusVal);
  };

  const onSaveDonor = (p: Donation) => {
    const data: Donation = {
      amountPledged: p?.amountPledged,
      company: p?.company,
      description: p?.description,
      email: p?.email,
      firstname: p?.firstname,
      lastname: p?.lastname,
      mobile: p?.mobile,
      donorCurrencyType: Number(`${selectedDonorCurrType?.type ?? 0}`),
      donorType: Number(`${selectedDonorType?.type ?? 0}`),
    };

    axios
      .put(`${api}/donations`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          alert("Successfully Submitted.");
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchDonationTypes();
    fetchCurrencyTypes();
    if (donationId) {
      fetchDonations();
    }
  }, [donationId]);

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "" : ` ${isEdit ? "" : "View"} Donation`}`}</h1>
      </div>

      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={` flex justify-end items-center gap-5 `}>
          <p>{`Mode: ${isEdit ? "Edit" : "View"}`}</p>

          <Switch
            onClick={() => {
              if (!isEdit) {
                setIsEdit(true);
              } else {
                setIsEdit(false);
              }
            }}
            defaultSelected={isEdit}
            size="lg"
            startContent={<GoPencil />}
            endContent={<GoEye />}
            title={`${isEdit ? "Edit mode" : "View mode"}`}
          ></Switch>
        </div>

        <div className="w-full rounded-2xl bg-default-200 shadow flex p-5 justify-center">
          <form
            onSubmit={handleSubmit(onDonationSubmit)}
            className=" flex flex-col gap-3 p-5 space-y-2"
          >
            {/* Fullnames */}
            <div className="w-full gap-5 flex justify-between items-center">
              {/* Fname */}
              <div className="w-full space-y-2">
                <label htmlFor="Firstname">Firstname</label>
                <Input
                  disabled
                  type="text"
                  defaultValue={`${donation?.firstname ?? ""}`}
                  {...register("firstname")}
                  placeholder={`${donation?.firstname ?? "Enter Firstname"}`}
                />
              </div>

              {/* Lname */}
              <div className="w-full space-y-2">
                <label htmlFor="Lastname">Lastname</label>
                <Input
                  disabled
                  type="text"
                  defaultValue={`${donation?.lastname ?? ""}`}
                  {...register("lastname")}
                  placeholder={`${donation?.lastname ?? "Enter Lastname"}`}
                />
              </div>
            </div>

            {/* Fullnames End*/}

            {/* Contact */}
            <div className="w-full gap-5 flex justify-between items-center">
              {/* Email */}
              <div className="w-full space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  disabled
                  type="text"
                  defaultValue={`${donation?.email ?? ""}`}
                  {...register("email")}
                  placeholder={`${donation?.email ?? "Enter email"}`}
                />
              </div>

              {/* Mobile */}
              <div className="w-full space-y-2">
                <label htmlFor="mobile">Mobile</label>
                <Input
                  disabled
                  type="text"
                  defaultValue={`${donation?.mobile ?? ""}`}
                  {...register("mobile")}
                  placeholder={`${donation?.mobile ?? "Enter mobile"}`}
                />
              </div>
            </div>

            {/* Contact End*/}

            {/* Types */}
            <div className="w-full gap-5 flex justify-between items-center">
              {/* Type */}
              {donationTypes === null ? (
                <></>
              ) : (
                <div className="w-full space-y-2">
                  <label htmlFor="donorType">Donor Type</label>
                  <Select
                    disabled
                    label="Select Donor Type"
                    // selectedKeys={`${selectedDonorType?.type ?? donationTypes[1]?.type}`}
                    className="max-w-xs"
                    defaultSelectedKeys={`${selectedDonorType?.type ?? donationTypes[1]?.type}`}
                    onChange={(e) => {
                      changeDonorType(e);
                    }}
                  >
                    {donationTypes?.map((status, i) => (
                      <SelectItem key={`${i}`}>
                        {status.title}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {/* Company */}
              <div className="w-full space-y-2">
                <label htmlFor="company">Company</label>
                <Input
                  disabled
                  type="text"
                  defaultValue={`${donation?.company ?? ""}`}
                  {...register("company")}
                  placeholder={`${donation?.company ?? "Enter company"}`}
                />
              </div>
            </div>

            {/* Types End*/}

            {/* Currencies */}
            <div className="w-full gap-5 flex justify-between items-center">
              {/* Currency Type */}

              {currencyTypes === null ? (
                <></>
              ) : (
                <div className="w-full space-y-2">
                  <label htmlFor="currency">Currency Type</label>
                  <Select
                    disabled
                    label="Select Currency Type"
                    // selectedKeys={`${selectedDonorCurrType?.type ?? currencyTypes[1]?.type}`}
                    className="max-w-xs"
                    defaultSelectedKeys={`${selectedDonorCurrType?.type ?? currencyTypes[1]?.type}`}
                    onChange={(e) => {
                      changeDonorCurrType(e);
                    }}
                  >
                    {currencyTypes?.map((status,i) => (
                      <SelectItem key={`${i}`}>
                        {status.shortName}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {/* Pledge */}
              <div className="w-full space-y-2">
                <label htmlFor="amount">Amount</label>
                <Input
                  disabled
                  type="number"
                  min={0}
                  defaultValue={`${donation?.amountPledged ?? ""}`}
                  {...register("amountPledged")}
                  placeholder={`${donation?.amountPledged ?? "Enter Amount Pledge"}`}
                />
              </div>
            </div>

            {/* Editor */}
            <div className="w-full space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                disabled
                type="text"
                defaultValue={`${donation?.description ?? ""}`}
                {...register("description")}
                placeholder={`${donation?.description ?? "Enter Description"}`}
              />
            </div>

            {/* Actions */}
            <div className="w-full space-y-2 flex items-center justify-end">
              <Button color="primary" type="submit">
                {"Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
