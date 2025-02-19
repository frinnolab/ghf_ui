import { useLocation, useNavigate } from "react-router-dom";
import {
  Career,
  CareerApplication,
  CareerStatus,
  CareerType,
} from "../dashboard/careers/dash-careers";
import { ChangeEvent, useEffect, useState } from "react";
import { Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { GoArrowLeft, GoTrash } from "react-icons/go";
import { Button } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthRole } from "@/types";
import { AxiosResponse } from "axios";

const CareerView = () => {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  // const [quillValue] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [careerId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }

    return null;
  });
  const [career, setCareer] = useState<Career | null>(null);

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

  const [selectedStatus, setSelectedStatus] = useState<{
    key: CareerStatus;
    value: string;
  }>();

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

  const [careerRoleType, setSelectedRole] = useState<{
    key: AuthRole;
    value: string;
  }>();

  const { register, handleSubmit } = useForm<CareerApplication>();

  const handleCreate: SubmitHandler<CareerApplication> = (
    data: CareerApplication
  ) => {
    setIsloading(true);

    const cData = new FormData();

    cData.append("careerId", `${careerId}`);
    cData.append("email", `${data?.email}`);
    cData.append("firstname", `${data?.firstname}`);
    cData.append("lastname", `${data?.lastname}`);
    cData.append("mobile", `${data?.mobile}`);
    cData.append("biography", ``);
    cData.append("city", `${data?.city}`);
    cData.append("country", `${data?.country}`);
    cData.append("careerStatus", `${selectedStatus?.key}`);
    cData.append("careerRoleType", `${careerRoleType?.key}`);

    if (selectedCV) {
      cData.append("cv", selectedCV);
    }

    axios
      .post(`${api}/careers/${careerId}/applications`, cData, {
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

  const fetchCareer = (careerId: string) => {
    axios
      .get(`${api}/careers/${careerId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          const careerData: Career = {
            careerId: res.data.careerId,
            position: res.data.position,
            description: res.data.description,
            requirements: res.data.requirements,
            careerType: Number(res.data.careerType),
            careerValidity: Number(res.data.careerValidity),
          };

          setCareer(careerData);

          switch (Number(res?.data?.careerType)) {
            case CareerType.Employment:
              setSelectedRole(careerRoles[0]);
              break;
            default:
              setSelectedRole(careerRoles[1]);
              break;
          }

          setSelectedStatus(careerStatuses[0]);

          setIsloading(false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
      });
  };

  const removeSelectedCV = () => {
    setSelectedCV(null);
    window.location.reload();
  };

  const onChangeCV = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedCV(e.target.files[0]);
    }
  };

  const careerTypeText = (cType: CareerType) => {
    switch (cType) {
      case CareerType.Employment:
        return "Employment";
      case CareerType.Volunteering:
        return "Volunteering";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (career === null && careerId) {
      setIsloading(true);
      fetchCareer(careerId);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/careers");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>
      <Divider />
      <div className="w-full flex flex-col">
        {/* career data */}
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
          <div className="w-full flex flex-col gap-5 p-10">
            <div className="space-y-5">
              <h1 className="text-3xl">{career?.position}</h1>
            </div>

            <div className="space-y-5">
              <label className=" font-semibold " htmlFor="description">
                Description
              </label>
              <p>{career?.description}</p>
            </div>

            <div className="space-y-5">
              <label className=" font-semibold " htmlFor="type">
                Job Type
              </label>
              <p>{careerTypeText(Number(career?.careerType))}</p>
            </div>

            <div className="space-y-5">
              <label className=" font-semibold " htmlFor="requirements">
                Requirements
              </label>
              <div
                dangerouslySetInnerHTML={{
                  __html: `${career?.requirements ?? ""}`,
                }}
              />
            </div>
          </div>
        )}
        {/* career data End */}

        {/* career application form */}
        <div className="w-full flex flex-col gap-5 p-10">
          <div className="space-y-5">
            <h2 className="text-2xl">Apply for this Position</h2>
          </div>

          <form
            className="w-full space-y-5"
            onSubmit={handleSubmit(handleCreate)}
          >
            <div className="w-full space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                {...register("email")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input
                  required
                  id="firstName"
                  placeholder="Enter your first name"
                  type="text"
                  {...register("firstname")}
                />
              </div>

              <div className="w-full space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  type="text"
                  {...register("lastname")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full space-y-2">
                <label htmlFor="city">City</label>
                <Input
                  required
                  id="firstNamcitye"
                  placeholder="Enter your city"
                  type="text"
                  {...register("city")}
                />
              </div>

              <div className="w-full space-y-2">
                <label htmlFor="country">Country</label>
                <Input
                  required
                  id="country"
                  placeholder="Enter your country"
                  type="text"
                  {...register("country")}
                />
              </div>
            </div>

            {/* Phone & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full space-y-2">
                <label htmlFor="phone">Phone Number</label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  {...register("mobile")}
                  required
                />
              </div>

              <div className="w-full space-y-2">
                <label htmlFor="role">Role</label>
                <Input
                  disabled
                  type="text"
                  placeholder={`${careerTypeText(Number(career?.careerType))}`}
                  {...register("careerRoleType")}
                  required
                />
              </div>
            </div>

            {/* Phone & Role End */}

            {/* CV Upload */}
            <div className="w-full flex justify-between items-center gap-5">
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
            </div>
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

            <div className="w-full space-y-2" hidden>
              <label htmlFor="coverLetter">Cover Letter</label>
              <Textarea
                id="coverLetter"
                placeholder="Write your cover letter here..."
                rows={5}
              />
            </div>

            <div className="w-full flex justify-end">
              <Button color="primary" type="submit">
                Submit Application
              </Button>
            </div>
          </form>
        </div>
        {/* career application form End */}
      </div>
    </div>
  );
};

export default CareerView;
