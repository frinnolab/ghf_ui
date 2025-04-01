/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
import {
  Button,
  Spinner,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
  Textarea,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  Career,
  CareerApplication,
  CareerStatus,
  CareerType,
} from "../dashboard/careers/dash-careers";

import DefaultLayout from "@/layouts/default";
// import { title } from "@/components/primitives";
import { AuthRole } from "@/types";

// import { GoTrash } from "react-icons/go";

export default function CareersPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();

  const [careers, setCareers] = useState<Career[] | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  // const [selectedCV, setSelectedCV] = useState<File | null>(null);
  // const [career] = useState<Career | null>(null);
  const [careerStatuses] = useState<{ key: CareerStatus; value: string }[]>(
    () => {
      return [
        {
          key: CareerStatus.Pending,
          value: "Pending",
        },
        {
          key: CareerStatus.Denied,
          value: "Denied",
        },
        {
          key: CareerStatus.Accepted,
          value: "Accepted",
        },
      ];
    }
  );
  const [selectedStatus] = useState<{
    key: CareerStatus;
    value: string;
  }>(careerStatuses[0]);

  const [careerRoles] = useState<{ key: AuthRole; value: string }[]>(() => {
    return [
      {
        key: AuthRole.Employee,
        value: "Employee",
      },
      {
        key: AuthRole.Volunteer,
        value: "Volunteer",
      },
    ];
  });

  const [careerRoleType] = useState<{
    key: AuthRole;
    value: string;
  }>(careerRoles[1]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerApplication>();

  const handleCreate: SubmitHandler<CareerApplication> = (
    data: CareerApplication
  ) => {
    setIsloading(true);

    onClose();

    const cData = new FormData();

    // cData.append("careerId", null);
    cData.append("email", `${data?.email}`);
    cData.append("firstname", `${data?.firstname}`);
    cData.append("lastname", `${data?.lastname}`);
    cData.append("mobile", `${data?.mobile}`);
    cData.append("biography", ``);
    cData.append("city", `${data?.city}`);
    cData.append("country", `${data?.country}`);
    cData.append("careerStatus", `${selectedStatus?.key}`);
    cData.append("careerRoleType", `${careerRoleType?.key}`);

    // console.log(`Selected Career: ${careerRoleType?.key}`);
    // console.log(`Selected Career Status: ${selectedStatus?.key}`);

    // if (selectedCV) {
    //   cData.append("cv", selectedCV);
    // }

    axios
      .post(`${api}/careers/applications/volunteer`, cData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          //console.log(res?.data);
          setIsloading(false);
          alert(`Application submitted succesfully!`);
          window.location.reload();
        }
      })
      .catch((e: AxiosError) => {
        console.log(e);
        setIsloading(false);
        //window.location.reload();
      });
  };

  const careerTypeText = (cType: CareerType) => {
    switch (cType) {
      case CareerType.Employment:
        return "Employment";
      case CareerType.Volunteering:
        return "Volunteering";
      case CareerType.Internship:
        return "Internship";
    }
  };

  const fetchCareers = () => {
    axios
      .get(`${api}/careers?validity=1`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res?.data) {
          const careerData: Career[] = Array.from(res.data).map(
            (career: any) => ({
              careerId: career.careerId,
              position: career.position,
              description: career.description,
              requirements: career.requirements,
              careerType: Number(career.careerType),
              careerValidity: Number(career.careerValidity),
            })
          );

          setCareers(careerData);

          setIsloading(false);
        }
      });
  };

  // const removeSelectedCV = () => {
  //   setSelectedCV(null);
  //   window.location.reload();
  // };

  // const onChangeCV = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setSelectedCV(e.target.files[0]);
  //   }
  // };

  useEffect(() => {
    if (careers === null) {
      setIsloading(true);

      fetchCareers();
    }
  }, [careers]);

  return (
    <DefaultLayout>
      <section className="w-full flex flex-col gap-5 cursor-default">
        <div className="h-[30dvh] md:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="hidden text-black hover:text-orange-500 md:flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">CAREERS</h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute md:top-[-50%] filter saturate-[90%]">
            <Image
              alt="Careers Bg"
              className=" object-fill "
              radius="none"
              src="assets/images/static/Careers_BG.jpg"
              width={3000}
            />
          </div>
        </div>
        {/* Main Actions */}
        <div className="w-full bg-default-200 z-10 p-10 space-y-5">
          <div className="w-full flex flex-col gap-5 space-y-5">
            <h1 className=" text-3xl md:text-4xl text-black uppercase font-semibold">
              Join us
            </h1>
            <p className={` text-2xl md:text-3xl text-black text-balance`}>
              Great Hope Foundation, yearly works with a pool of volunteers
              countrywide in implementing UWEZO PROGRAM, and some few succeed in
              joining Great Hope Foundation team as employees. Volunteers that
              are picked are normally form four/form six and University
              students. Write to us, with the intention of becoming a volunteer.
            </p>
          </div>

          {/* Career Content */}
          {isLoading ? (
            <>
              <Spinner
                className=" flex justify-center "
                color="primary"
                label="Loading..."
                size="lg"
              />
            </>
          ) : (
            <div>
              {careers?.length === 0 ? (
                <>
                  <div className="w-full flex justify-center">
                    {/* <p>No Careers open at the momment</p> */}
                  </div>
                </>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {careers?.map((ca) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <div
                      key={`${ca?.careerId}`}
                      className="w-full p-5 flex flex-col justify-between bg-default-100 rounded-lg space-y-3 hover:border-transparent"
                      onClick={() => {
                        nav(`/careers/${ca?.careerId}`, {
                          state: `${ca?.careerId}`,
                        });
                      }}
                    >
                      <div className="w-full space-y-2">
                        <h2 className="text-xl md:text-2xl uppercase font-semibold">
                          {ca?.position}
                        </h2>
                        <p className="text-medium text-black hover:text-orange-400">
                          {careerTypeText(Number(ca?.careerType))}
                        </p>
                      </div>
                      <div className="w-full space-y-2">
                        <p className=" text-lg truncate">{ca?.description}</p>
                      </div>
                      <div className="w-full flex justify-end">
                        <Button
                          className="text-sm font-normal  bg-orange-400 border border-transparent hover:border-orange-500 hover:bg-transparent hover:text-orange-500"
                          variant="flat"
                          onClick={() => {
                            nav(`/careers/${ca?.careerId}`, {
                              state: `${ca?.careerId}`,
                            });
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* Career Content End*/}

          {/* Career Constant form */}

          <div
            // className="w-full flex justify-center relative"
            className="hidden"
          >
            <Button color="primary" variant="solid" onPress={onOpen}>
              {" "}
              Apply as Volunteer
            </Button>

            {/* Career Form */}
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h1>Apply as a Volunteer</h1>
                    </ModalHeader>
                    <ModalBody>
                      <form
                        className=" flex flex-col gap-1 p-4 space-y-1"
                        onSubmit={handleSubmit(handleCreate)}
                      >
                        <div className="w-full space-y-2">
                          <label htmlFor="email">Email</label>
                          <Input
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", { required: true })}
                            // required
                          />
                          {errors.email && (
                            <span className="text-danger">
                              Email field is required
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="w-full space-y-2">
                            <label htmlFor="firstName">Firstname</label>
                            <Input
                              // required
                              id="firstName"
                              placeholder="Enter your first name"
                              type="text"
                              {...register("firstname", { required: true })}
                            />
                            {errors.firstname && (
                              <span className="text-danger">
                                Firstname field is required
                              </span>
                            )}
                          </div>

                          <div className="w-full space-y-2">
                            <label htmlFor="lastName">Lastname</label>
                            <Input
                              id="lastName"
                              placeholder="Enter your last name"
                              type="text"
                              {...register("lastname", { required: true })}
                            />
                            {errors.lastname && (
                              <span className="text-danger">
                                Lastname field is required
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="w-full space-y-2">
                            <label htmlFor="city">City</label>
                            <Input
                              // required
                              id="firstNamcitye"
                              placeholder="Enter your city"
                              type="text"
                              {...register("city", { required: true })}
                            />
                            {errors.city && (
                              <span className="text-danger">
                                City field is required
                              </span>
                            )}
                          </div>

                          <div className="w-full space-y-2">
                            <label htmlFor="country">Country</label>
                            <Input
                              // required
                              id="country"
                              placeholder="Enter your country"
                              type="text"
                              {...register("country", { required: true })}
                            />
                            {errors.country && (
                              <span className="text-danger">
                                Country field is required
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="w-full space-y-2">
                          <div className="w-full space-y-2">
                            <label htmlFor="phone">Phone number</label>
                            <Input
                              id="phone"
                              placeholder="Enter your phone number"
                              type="number"
                              {...register("mobile")}
                              // required
                            />
                          </div>
                        </div>

                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                          <div className="w-full space-y-2">
                            <label htmlFor="phone">Phone number</label>
                            <Input
                              id="phone"
                              placeholder="Enter your phone number"
                              type="text"
                              {...register("mobile")}
                              required
                            />
                          </div>

                          <div className="w-full space-y-2">
                            <label htmlFor="role">Role</label>
                            <Input
                              disabled
                              placeholder={`${careerTypeText(Number(careerRoleType?.key))}`}
                              type="text"
                              {...register("careerRoleType")}
                              required
                            />
                          </div>
                        </div> */}

                        {/* CV Upload */}
                        {/* <div className="w-full flex justify-between items-center gap-5" >
                          <div className="w-full space-y-2">
                            <label htmlFor="resume">Resume/CV</label>
                            <Input
                              accept=".pdf,.doc,.docx"
                              id="resume"
                              type="file"
                              onChange={(e) => {
                                onChangeCV(e);
                              }}
                            />
                          </div>

                          <div className="flex flex-col p-5 items-end">
                            <span
                              className={`flex items-center p-1 hover:bg-default-200 hover:rounded-full ${selectedCV ? "" : "hidden"}`}
                            >
                              <GoTrash
                                className=" text-danger-500"
                                size={20}
                                onClick={removeSelectedCV}
                              />
                            </span>
                          </div>
                        </div> */}
                        {/* CV Upload End */}

                        <div hidden className="w-full space-y-2">
                          <label htmlFor="careerStatus">Status</label>
                          <Input
                            disabled
                            id="role"
                            type="text"
                            {...register("careerStatus")}
                            required
                          />
                        </div>

                        <div hidden className="w-full space-y-2">
                          <label htmlFor="coverLetter">Cover Letter</label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Write your cover letter here..."
                            rows={5}
                          />
                        </div>

                        {/* <div className="w-full flex justify-end">
                          <Button color="primary" type="submit">
                            Submit Application
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
            {/* Career Form End */}
          </div>

          {/* Career Constant form End */}
        </div>
      </section>
    </DefaultLayout>
  );
}
