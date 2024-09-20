import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Donation,
  DonationCurrencyEnum,
  // DonationCurrencyType,
  // DonationStatus,
  DonationStatusEnum,
  DonationType,
  DonationTypeEnum,
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
import useAuthedProfile from "@/hooks/use-auth";

export default function DashDonationView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const authed = useAuthedProfile();
  // const [isStatuses, setIsStatuses] = useState<boolean>(false);
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

  const [donorsStatus] = useState<DonationType[] | null>(() => {
    return [
      {
        id: "",
        type: DonationStatusEnum.UNPAID,
        title: "UNPAID",
      },
      {
        id: "",
        type: DonationStatusEnum.PAID,
        title: "PAID",
      },
    ];
  });

  const [currentDonorStatus, setCurrentDonorStatus] = useState<DonationType>();

  const [donorsType] = useState<DonationType[] | null>(() => {
    return [
      {
        id: "",
        type: DonationTypeEnum["LOCAL DONOR"],
        title: "LOCAL DONOR",
      },
      {
        id: "",
        type: DonationTypeEnum["FOREIGN DONOR"],
        title: "FOREIGN DONOR",
      },
    ];
  });

  const [currentDonorType, setCurrentDonorType] = useState<DonationType>();

  const [donorsCurrencies] = useState<DonationType[] | null>(() => {
    return [
      {
        id: "",
        type: DonationCurrencyEnum.TZS,
        title: "TZS",
      },
      {
        id: "",
        type: DonationCurrencyEnum.USD,
        title: "USD",
      },
      {
        id: "",
        type: DonationCurrencyEnum.GBP,
        title: "GBP",
      },
    ];
  });

  const [currentDonorCurrency, setCurrentDonorCurrency] =
    useState<DonationType>();

  const handleBack = () => nav("/dashboard/donations");

  //#region status fetches
  // const [donationTypes, setDonationTypes] = useState<DonationType[] | null>(
  //   null
  // );

  // const [donationStatus, setDonationStatus] = useState<DonationStatus[] | null>(
  //   null
  // );
  // const [selectedDonorStatus, setSelectedDonorStatus] =
  //   useState<DonationStatus>();
  // const [selectedDonorType, setSelectedselectedDonorType] =
  //   useState<DonationType>();

  // const [currencyTypes, setCurrencyTypes] = useState<
  //   DonationCurrencyType[] | null
  // >(null);

  // const [selectedDonorCurrType, setSelectedselectedDonorCurrType] =
  //   useState<DonationCurrencyType>();

  // const fetchDonationTypes = () => {
  //   let data: DonationType[] = [];
  //   axios
  //     .get(`${api}/donations/types`)
  //     .then((res: AxiosResponse) => {
  //       data = Array.from(res?.data).flatMap((d: any) => {
  //         const dType: DonationType = {
  //           title: d?.title,
  //           id: d?.donorTypeId,
  //           type: Number(d?.type),
  //         };
  //         return [dType];
  //       });

  //       setDonationTypes([...data]);
  //     })
  //     .catch((err: AxiosError) => {
  //       console.log(err.response);
  //       return null;
  //     });
  // };

  // const fetchCurrencyTypes = () => {
  //   let data: DonationCurrencyType[] = [];
  //   axios
  //     .get(`${api}/donations/currencies`)
  //     .then((res: AxiosResponse) => {
  //       data = Array.from(res?.data).flatMap((d: any) => {
  //         const dType: DonationCurrencyType = {
  //           id: d?.donorCurrencyId,
  //           title: d?.title,
  //           type: Number(d?.type),
  //           shortName: d?.shortname,
  //         };
  //         return [dType];
  //       });

  //       setCurrencyTypes([...data]);
  //     })
  //     .catch((err: AxiosError) => {
  //       console.log(err.response);
  //       return null;
  //     });
  // };

  // const fetchStatusTypes = () => {
  //   let data: DonationStatus[] = [];
  //   axios
  //     .get(`${api}/donations/status`)
  //     .then((res: AxiosResponse) => {
  //       data = Array.from(res?.data).flatMap((d: any) => {
  //         const dType: DonationStatus = {
  //           id: d?.donorStatusId,
  //           title: d?.title,
  //           type: d?.type,
  //         };
  //         return [dType];
  //       });

  //       setDonationStatus([...data]);
  //     })
  //     .catch((err: AxiosError) => {
  //       console.log(err.response);
  //       return null;
  //     });
  // };

  // const onSetDonorStatus = (status: Number) => {
  //   const donorStatus: DonationStatus = {
  //     title: donationStatus?.find((d) => Number(d?.type) === Number(status))
  //       ?.title,
  //     type: Number(
  //       donationStatus?.find((d) => Number(d?.type) === Number(status))?.type
  //     ),
  //   };
  //   setSelectedDonorStatus(donorStatus);
  // };

  // const onSetDonorType = (status: Number) => {

  //   console.log('Donor Type');
  //   console.log(status);
  //   console.log(donationTypes);

  //   const donorType: DonationType = {
  //     title: donationTypes?.find((d) => Number(d?.type) === Number(status))
  //       ?.title,
  //     type: Number(
  //       donationTypes?.find((d) => Number(d?.type) === Number(status))?.type
  //     ),
  //   };
  //   setSelectedselectedDonorType(donorType);
  // };

  // const onSetCurrencyType = (status: Number) => {
  //   const donorCurrType: DonationCurrencyType = {
  //     title: currencyTypes?.find((d) => Number(d?.type) === Number(status))
  //       ?.title,
  //     type: Number(
  //       donationTypes?.find((d) => Number(d?.type) === Number(status))?.type
  //     ),
  //     shortName: `${currencyTypes?.find((d) => Number(d?.type) === Number(status))?.shortName}`,
  //   };
  //   setSelectedselectedDonorCurrType(donorCurrType);
  // };

  // useEffect(() => {
  //   if (!isStatuses) {
  //     fetchDonationTypes();
  //     fetchCurrencyTypes();
  //     fetchStatusTypes();

  //     setIsStatuses(true);
  //   }
  // }, [isStatuses]);
  //#endregion

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
            statusType: Number(res?.data?.statusType),
          };

          setDonation(data);

          // //SetDonation Status Type
          onSetDonorStatus(Number(res?.data?.statusType));

          // //SetDonation Type
          onSetDonorType(Number(res?.data?.donorType));

          // //Setcurrency Type
          onSetCurrencyType(Number(res?.data?.donorCurrencyType));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const { register, handleSubmit } = useForm<Donation>();
  const onDonationSubmit: SubmitHandler<Donation> = () => {
    onSaveDonor();
  };

  const changeDonorType = (e: ChangeEvent<HTMLSelectElement>) => {
    // const statusVal = donationTypes?.find(
    //   (p) => p?.type === Number(e.target.value)
    // );

    // setSelectedselectedDonorType(statusVal);
    const statusVal = donorsType?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setCurrentDonorType(statusVal);
  };

  const changeDonorCurrType = (e: ChangeEvent<HTMLSelectElement>) => {
    // const statusVal = currencyTypes?.find(
    //   (p) => p?.type === Number(e.target.value)
    // );

    // setSelectedselectedDonorCurrType(statusVal);
    const statusVal = donorsCurrencies?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setCurrentDonorCurrency(statusVal);
  };

  const changeDonorStatusType = (e: ChangeEvent<HTMLSelectElement>) => {
    // const statusVal = donationStatus?.find(
    //   (p) => p?.type === Number(e.target.value)
    // );
    // setSelectedDonorStatus(statusVal);

    const statusVal = donorsStatus?.find(
      (p) => p?.type === Number(e.target.value)
    );
    setCurrentDonorStatus(statusVal);
  };

  const onSaveDonor = () => {
    const data: Donation = {
      amountPledged: donation?.amountPledged,
      company: donation?.company,
      description: donation?.description,
      email: donation?.email,
      firstname: donation?.firstname,
      lastname: donation?.lastname,
      mobile: donation?.mobile,
      donorCurrencyType: Number(
        Number.isNaN(currentDonorCurrency?.type)
          ? donation?.donorCurrencyType
          : currentDonorCurrency?.type
      ),
      donorType: Number(
        Number.isNaN(currentDonorType?.type)
          ? donation?.donorType
          : currentDonorType?.type
      ),
      statusType: Number(
        Number.isNaN(currentDonorStatus?.type)
          ? donation?.statusType
          : currentDonorStatus?.type
      ),
    };

    axios
      .put(`${api}/donations/${donation?.donationId}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          window.location.reload();
        }
      })
      .catch(() => {});
  };
  
  const onSetDonorStatus = (status: Number) => {
    const donorStatus: DonationType = {
      title: donorsStatus?.find((d) => Number(d?.type) === Number(status))
        ?.title,
      type: Number(
        donorsStatus?.find((d) => Number(d?.type) === Number(status))?.type
      ),
    };

    setCurrentDonorStatus(donorStatus);
    // const donorStatus: DonationStatus = {
    //   title: donationStatus?.find((d) => Number(d?.type) === Number(status))
    //     ?.title,
    //   type: Number(
    //     donationStatus?.find((d) => Number(d?.type) === Number(status))?.type
    //   ),
    // };
    // setSelectedDonorStatus(donorStatus);
  };

  const onSetDonorType = (status: Number) => {
    const donorType: DonationType = {
      title: donorsType?.find((d) => Number(d?.type) === Number(status))?.title,
      type: Number(
        donorsType?.find((d) => Number(d?.type) === Number(status))?.type
      ),
    };
    setCurrentDonorType(donorType);
    // const donorType: DonationType = {
    //   title: donationTypes?.find((d) => Number(d?.type) === Number(status))
    //     ?.title,
    //   type: Number(
    //     donationTypes?.find((d) => Number(d?.type) === Number(status))?.type
    //   ),
    // };
    // setSelectedselectedDonorType(donorType);
  };

  const onSetCurrencyType = (status: Number) => {
    const donorCurrType: DonationType = {
      title: donorsCurrencies?.find((d) => Number(d?.type) === Number(status))
        ?.title,
      type: Number(
        donorsCurrencies?.find((d) => Number(d?.type) === Number(status))?.type
      ),
    };
    setCurrentDonorCurrency(donorCurrType);

    // const donorCurrType: DonationCurrencyType = {
    //   title: currencyTypes?.find((d) => Number(d?.type) === Number(status))
    //     ?.title,
    //   type: Number(
    //     donationTypes?.find((d) => Number(d?.type) === Number(status))?.type
    //   ),
    //   shortName: `${currencyTypes?.find((d) => Number(d?.type) === Number(status))?.shortName}`,
    // };
    // setSelectedselectedDonorCurrType(donorCurrType);
  };

  useEffect(() => {
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
        <h1 className=" text-2xl ">{`${route?.state === null ? "Edit" : ` ${isEdit ? "" : "View"} Donation`}`}</h1>
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
            className=" flex flex-col gap-3 p-5 space-y-2 overflow-y-scroll h-[70dvh]"
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
              {donorsType === null ? (
                <></>
              ) : (
                <div className="w-full space-y-2">
                  <label htmlFor="donorType">Donor</label>
                  <Select
                    isDisabled
                    label="Select Donor"
                    // selectedKeys={`${selectedDonorType?.type ?? donationTypes[0]?.type}`}
                    className="max-w-xs"
                    defaultSelectedKeys={`${currentDonorType?.type ?? donorsType[0]?.type}`}
                    onChange={(e) => {
                      changeDonorType(e);
                    }}
                  >
                    {donorsType?.map((status) => (
                      <SelectItem key={`${status?.type}`}>
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

              {donorsCurrencies === null ? (
                <></>
              ) : (
                <div className="w-full space-y-2">
                  <label htmlFor="currency">Currency</label>
                  <Select
                    isDisabled
                    label="Select Currency"
                    // selectedKeys={`${selectedDonorCurrType?.type ?? currencyTypes[0]?.type}`}
                    className="max-w-xs"
                    defaultSelectedKeys={`${currentDonorCurrency?.type ?? donorsCurrencies[0]?.type}`}
                    onChange={(e) => {
                      changeDonorCurrType(e);
                    }}
                  >
                    {donorsCurrencies?.map((status) => (
                      <SelectItem key={`${status?.type}`}>
                        {status.title}
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

            {/* Status */}
            <div className="w-full gap-5 flex justify-between items-center">
              {donorsStatus === null ? (
                <></>
              ) : (
                <div className="w-full flex flex-col space-y-2">
                  <label htmlFor="status">Status</label>
                  <Select
                    isDisabled={!isEdit}
                    label="Select Status"
                    selectedKeys={`${currentDonorStatus?.type ?? donorsStatus[0]?.type}`}
                    className="max-w-xs"
                    defaultSelectedKeys={`${currentDonorStatus?.type ?? donorsStatus[0]?.type}`}
                    onChange={(e) => {
                      changeDonorStatusType(e);
                    }}
                  >
                    {donorsStatus?.map((status) => (
                      <SelectItem key={`${status?.type}`}>
                        {status.title}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}
            </div>
            {/* Status End*/}

            {/* Actions */}
            <div className="w-full space-y-2 flex items-center justify-end">
              <Button
                color={isEdit ? "primary" : "default"}
                type="submit"
                disabled={!isEdit}
              >
                {"Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
