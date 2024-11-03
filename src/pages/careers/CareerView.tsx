import { useLocation, useNavigate } from "react-router-dom";
import {
  Career,
  CareerApplication,
  CareerStatus,
  CareerType,
} from "../dashboard/careers/dash-careers";
import { useEffect, useState } from "react";
import { Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { GoArrowLeft } from "react-icons/go";
import { Button } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthRole } from "@/types";
import { AxiosResponse } from "axios";

const CareerView = () => {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  //const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [quillValue] = useState<string>("");
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

  const [, setSelectedRole] = useState<{
    key: AuthRole;
    value: string;
  }>();

  const { register, handleSubmit } = useForm<CareerApplication>();

  const handleCreate: SubmitHandler<CareerApplication> = (
    data: CareerApplication
  ) => {
    console.log(quillValue);

    setIsloading(true);

    const newData: CareerApplication = {
      careerId: `${careerId}`,
      email: data?.email,
      firstname: data?.firstname,
      lastname: data?.lastname,
      mobile: data?.mobile,
      biography: data?.biography,
      city: data?.city,
      country: data?.country,
      careerStatus: Number(selectedStatus?.key),
      careerRoleType: Number(selectedStatus?.key),
    };

    axios
      .post(`${api}/careers/${careerId}/applications`, newData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          console.log(res?.data);
          setIsloading(false);
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

  const careerTypeText = (cType: CareerType) => {
    switch (cType) {
      case CareerType.Employment:
        return "Employment";
      case CareerType.Volunteering:
        return "Volunteering";
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
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
              size="lg"
              className=" flex justify-center "
              label="Loading..."
              color="primary"
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
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full space-y-2">
                <label htmlFor="firstName">First Name</label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  required
                  {...register("firstname")}
                />
              </div>

              <div className="w-full space-y-2">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastname")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full space-y-2">
                <label htmlFor="city">City</label>
                <Input
                  id="firstNamcitye"
                  type="text"
                  placeholder="Enter your city"
                  required
                  {...register("city")}
                />
              </div>

              <div className="w-full space-y-2">
                <label htmlFor="country">Country</label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Enter your country"
                  required
                  {...register("country")}
                />
              </div>
            </div>

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

            <div className="w-full space-y-2" hidden>
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
              <label htmlFor="resume">Resume/CV</label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
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
