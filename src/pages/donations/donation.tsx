import { ChangeEvent, useEffect, useState } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
  Divider,
} from "@nextui-org/react";
// import { title } from "@/components/primitives";
import * as motion from "motion/react-client";

import {
  Donation,
  DonationCurrencyType,
  DonationType,
} from "../dashboard/donations/dash-donations-list";

import DefaultLayout from "@/layouts/default";

export default function DonationPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [donation] = useState<Donation | null>(null);

  const [isLoading, setIsloading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

          onClose();
        }
      })
      .catch((err: AxiosError) => {
        setIsloading(false);
        alert(JSON.stringify(err?.response));
        onClose();
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
        <div className="w-full flex flex-col items-center gap-5 md:p-10 md:min-h-[100dvh] relative">
          <motion.div className={`w-full absolute top-[-10%] saturate-[100%]`}>
            <Image
              alt="About Bg"
              radius="none"
              src="assets/images/static/DONATE_BBG.jpg"
              width={5000}
            />
          </motion.div>

          {/* <div className="inline-block max-w-lg text-center justify-center p-3 z-10"> */}
          <div className="flex flex-col z-10">
            <motion.h1
              className={`text-3xl md:text-5xl text-orange-500 font-semibold`}
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  ease: "easeIn",
                  delay: 0.8,
                  duration: 1,
                },
              }}
            >
              Donate
            </motion.h1>
            <motion.span
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  ease: "linear",
                  delay: 0.8,
                  duration: 1,
                },
              }}
            >
              <Divider className="p-1 bg-orange-500 -rotate-3" />
            </motion.span>
            <div />
          </div>

          {/* Bio */}
          <motion.div
            className="rounded-2xl z-10 bg-default-50/75"
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                ease: "linear",
                delay: 0.8,
                duration: 1.5,
              },
            }}
          >
            <motion.p className=" text-2xl md:text-4xl text-balance md:text-justify p-5 md:py-10">
              “At Great Hope Foundation, we believe in the limitless potential
              of our youth. Our empowerment programs equip young minds with the
              skills, resources, and opportunities they need to lead, innovate,
              and uplift their communities. By donating today, you are not just
              giving funds you are investing in brighter futures, breaking
              barriers, and creating lasting change. Together, we can turn
              dreams into realities, hope into action, and potential into
              progress. Every contribution, big or small, makes a difference in
              building stronger communities and shaping the leaders of
              tomorrow.”
            </motion.p>
          </motion.div>

          {/* Donate Pop-up */}
          <div className="w-full flex justify-center relative">
            <Button
              className=" bg-orange-400 "
              size="lg"
              variant="solid"
              onPress={onOpen}
            >
              {" "}
              Donate Here
            </Button>

            {/* Donate Form */}
            <Modal
              backdrop="blur"
              isOpen={isOpen}
              size="2xl"
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h1>Donate</h1>
                    </ModalHeader>
                    <ModalBody>
                      <form
                        className=" flex flex-col gap-3 p-5 space-y-2"
                        onSubmit={handleSubmit(onDonationSubmit)}
                      >
                        {/* Fullnames */}
                        <div className="w-full gap-5 flex justify-between items-center">
                          {/* Fname */}
                          <div className="w-full space-y-2">
                            <label htmlFor="Firstname">Firstname</label>
                            <Input
                              defaultValue={`${donation?.firstname ?? ""}`}
                              type="text"
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
                              defaultValue={`${donation?.lastname ?? ""}`}
                              type="text"
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
                              defaultValue={`${donation?.email ?? ""}`}
                              type="text"
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
                              defaultValue={`${donation?.mobile ?? ""}`}
                              type="text"
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
                              defaultValue={`${donation?.company ?? ""}`}
                              type="text"
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
                              defaultValue={`${donation?.amountPledged ?? ""}`}
                              min={0}
                              type="number"
                              {...register("amountPledged")}
                              placeholder={`${donation?.amountPledged ?? "Enter Amount Pledge"}`}
                            />
                          </div>
                        </div>

                        {/* Editor */}
                        <div className="w-full space-y-2">
                          <label htmlFor="description">Description</label>
                          <Textarea
                            defaultValue={`${donation?.description ?? ""}`}
                            type="text"
                            {...register("description")}
                            placeholder={`${donation?.description ?? "Enter Description"}`}
                          />
                        </div>

                        {/* Actions */}
                        {/* <div className="w-full space-y-2 flex items-center justify-end">
                          <Button color="primary" type="submit">
                            {"Submit"}
                          </Button>
                        </div> */}

                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>

                          <Button
                            color="primary"
                            type="submit"
                            // onPress={onClose}
                          >
                            Submit
                          </Button>
                        </ModalFooter>
                      </form>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/* Donate Form End */}
          </div>
          {/* Donate Pop-up End */}
        </div>

        <div hidden className="w-full bg-default-200 z-10 p-5">
          {/* <div>
            <h1 className={title()}>Donations</h1>
          </div> */}

          <div className="w-full px-10 flex flex-col gap-5">
            <div className="w-full flex flex-col px-20 gap-5 ">
              <h1 className=" text-2xl  font-semibold "> Become a Donor</h1>
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
                    className=" flex flex-col gap-3 p-5 space-y-2"
                    onSubmit={handleSubmit(onDonationSubmit)}
                  >
                    {/* Fullnames */}
                    <div className="w-full gap-5 flex justify-between items-center">
                      {/* Fname */}
                      <div className="w-full space-y-2">
                        <label htmlFor="Firstname">Firstname</label>
                        <Input
                          defaultValue={`${donation?.firstname ?? ""}`}
                          type="text"
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
                          defaultValue={`${donation?.lastname ?? ""}`}
                          type="text"
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
                          defaultValue={`${donation?.email ?? ""}`}
                          type="text"
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
                          defaultValue={`${donation?.mobile ?? ""}`}
                          type="text"
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
        </div>
      </section>
    </DefaultLayout>
  );
}
