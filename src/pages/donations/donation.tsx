import DefaultLayout from "@/layouts/default";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Donation,
  DonationCurrencyType,
  DonationType,
} from "../dashboard/donations/dash-donations-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  Image,
} from "@nextui-org/react";

export default function DonationPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [donation] = useState<Donation | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Donation>();
  const onDonationSubmit: SubmitHandler<Donation> = (d) => {
    setIsloading(true);

    onSaveDonor(d);
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
      statusType: 0,
    };

    axios
      .post(`${api}/donations`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          setIsloading(false);
          alert("Successfully Submitted.");
        }
      })
      .catch((err: AxiosError) => {
        setIsloading(false);
        alert(JSON.stringify(err?.response));
      });
  };

  const fetchDonationTypes = () => {
    let data: DonationType[] = [];
    axios
      .get(`${api}/donations/types`)
      .then((res: AxiosResponse) => {
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

  const fetchCurrencyTypes = () => {
    let data: DonationCurrencyType[] = [];
    axios
      .get(`${api}/donations/currencies`)
      .then((res: AxiosResponse) => {
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

  const changeDonorCurrType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = currencyTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );
    setSelectedselectedDonorCurrType(statusVal);
  };

  const changeDonorType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = donationTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setSelectedselectedDonorType(statusVal);
  };

  useEffect(() => {
    fetchCurrencyTypes();
    fetchDonationTypes();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4">
        <div className="h-screen w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-10">
            <div className="w-full flex justify-between">
              <div></div>

              <div className="text-primary flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute md:top-[200%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">
                  DONATIONS
                </h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[8%] filter">
            <Image
              className=" bg-cover "
              radius="none"
              alt="Header img"
              src={`/assets/images/static/donation.JPG`}
            />
          </div>
        </div>
        {/* <h1 className={title()}>Donation</h1> */}

        <div className="w-full px-10 flex flex-col gap-5">
          <div className="w-full flex flex-col px-20 gap-5 ">
            <h1 className=" text-2xl  font-semibold ">
              {" "}
              Become a Donor
            </h1>
          </div>

          <div
            className={`${" md:rounded-2xl md:bg-default-200 w-full flex flex-col gap-3 justify-center items-center p-4 panel"}`}
          >
            <div className={`w-full space-y-3 text-center`}>
              <p className="text-xl md:text-2xl text-default-500 ">
                To pledge donation, please fill in the form.
              </p>
            </div>

            <div className=" shadow rounded-2xl bg-default-50 p-5 ">
              {isLoading ? (
                <Spinner
                  className={` justify-center items-center `}
                  label="Submitting..."
                />
              ) : (
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
                        type="text"
                        defaultValue={`${donation?.firstname ?? ""}`}
                        {...register("firstname", { required: true })}
                        placeholder={`${donation?.firstname ?? "Enter Firstname"}`}
                      />

                      {errors.firstname && (
                        <span className="text-danger">
                          Firstname field is required
                        </span>
                      )}
                    </div>

                    {/* Lname */}
                    <div className="w-full space-y-2">
                      <label htmlFor="Lastname">Lastname</label>
                      <Input
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
                        type="text"
                        defaultValue={`${donation?.email ?? ""}`}
                        {...register("email", { required: true })}
                        placeholder={`${donation?.email ?? "Enter email"}`}
                      />

                      {errors.email && (
                        <span className="text-danger">
                          Email field is required
                        </span>
                      )}
                    </div>

                    {/* Mobile */}
                    <div className="w-full space-y-2">
                      <label htmlFor="mobile">Mobile</label>
                      <Input
                        isRequired
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
                        <label htmlFor="donorType">Donor</label>
                        <Select
                          isRequired
                          label="Select Donor Type"
                          className="max-w-xs"
                          onChange={(e) => {
                            changeDonorType(e);
                          }}
                        >
                          {donationTypes?.map((status) => (
                            <SelectItem key={`${status.type}`}>
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
                        <label htmlFor="currency">Currency</label>
                        <Select
                          isRequired
                          label="Select Currency Type"
                          className="max-w-xs"
                          onChange={(e) => {
                            changeDonorCurrType(e);
                          }}
                        >
                          {currencyTypes?.map((status) => (
                            <SelectItem key={`${status.type}`}>
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
              )}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
