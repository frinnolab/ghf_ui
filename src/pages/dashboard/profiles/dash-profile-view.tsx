import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Input,
  Spinner,
  Image,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { GoArrowLeft, GoTrash } from "react-icons/go";

import { Profile } from "./dash-profiles-list";

import { AuthRole } from "@/types";
import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";

export type RoleTypeOption = {
  key?: number;
  value?: string;
};

export default function DashboardProfilePage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const [profileId] = useState<string | null>(() => {
    return route?.state;
  });
  const authed = useAuthedProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const passRef = useRef<HTMLInputElement>(null);
  const coPassRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [roleTypeOptions] = useState<RoleTypeOption[]>(() => {
    return [
      {
        key: AuthRole.SuperAdmin,
        value: "SuperAdmin",
      },
      {
        key: AuthRole.Admin,
        value: "Admin",
      },
      {
        key: AuthRole.Alumni,
        value: "Alumni",
      },
      {
        key: AuthRole.Employee,
        value: "Employee",
      },
      {
        key: AuthRole.User,
        value: "User",
      },
      {
        key: AuthRole.Volunteer,
        value: "Volunteer",
      },
      {
        key: AuthRole.BoardMember,
        value: "Board Member",
      },
    ];
  });

  const [selectedRoleType, setSelectedRoleType] = useState<RoleTypeOption>(
    roleTypeOptions[4]
  );

  const nav = useNavigate();

  //Form State
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>();

  useEffect(() => {
    if (profile === null) {
      setIsloading(true);
      setIsEdit(true);

      if (profileId === null) {
        //Create new
        setIsloading(false);
        setSelectedRoleType(roleTypeOptions[4]);
      } else {
        axios
          .get(`${api}/profiles/${profileId}`, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
          .then((res: AxiosResponse) => {
            const data: Profile = {
              profileId: res.data?.profileId,
              firstname: res.data?.firstname ?? null,
              lastname: res.data?.lastname ?? null,
              email: res.data?.email ?? null,
              role: Number(res.data.roleType) ?? AuthRole.User,
              avatarUrl: res.data?.avatarUrl ?? null,
              mobile: res.data?.mobile ?? null,
              position: res.data?.position ?? null,
              biography: res.data?.biography ?? null,
            };

            setProfile(data);

            //console.log(res?.data);

            const statusVal = roleTypeOptions.find(
              (p) => p?.key === Number(res.data.roleType)
            );

            //console.log(statusVal);

            setSelectedRoleType(statusVal ?? roleTypeOptions[4]);

            setTimeout(() => {
              setIsloading(false);
            }, 2000);
          });
      }
    }
  }, [profile]);

  // const roleName = (role: number) => {
  //   switch (role) {
  //     case AuthRole.Admin:
  //       return "Admin";
  //     case AuthRole.SuperAdmin:
  //       return "Super Admin";
  //     case AuthRole.Alumni:
  //       return "Alumni";
  //     default:
  //       return "User";
  //   }
  // };

  const handleBack = () => nav("/dashboard/profiles");

  const onSubmit: SubmitHandler<Profile> = (d) => {
    handleProfileUpdate(d);
  };

  const handleProfileUpdate = (d: Profile) => {
    setIsloading(true);
    const data = new FormData();

    if (profileId === null) {
      data.append("_method", `POST`);
    } else {
      data.append("_method", `PUT`);
      data.append("profileId", `${profile?.profileId}`);
    }

    data.append("email", `${d?.email ?? profile?.email}`);
    data.append("creatorProfileId", `${authed?.profileId}`);
    data.append("firstname", `${d?.firstname ?? profile?.firstname ?? ""}`);
    data.append("lastname", `${d?.lastname ?? profile?.lastname ?? ""}`);
    data.append("mobile", `${d?.mobile ?? profile?.mobile ?? ""}`);
    data.append("position", `${d?.position ?? profile?.position ?? ""}`);
    data.append("roleType", `${selectedRoleType?.key}`);
    data.append("biography", `${d?.biography ?? profile?.biography ?? ""}`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

    if (passRef?.current?.value) {
      if (passRef?.current?.value !== coPassRef?.current?.value) {
        alert("Passwords dont match.");
      } else {
        data.append("password", `${passRef?.current?.value}`);
      }
    } else {
      if (profileId === null) {
        data.append("password", `${d?.email}`);
      }
    }

    if (profileId === null) {
      alert(`Create a New profile`);
      //Create new profile
      axios
        .post(`${api}/profiles`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setProfile(null);
          setSelectedImage(null);
          nav(`/dashboard/profiles`);
          // window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    } else {
      //Update Profile
      alert(`Update profiled ${profile?.email}`);

      axios
        .post(`${api}/profiles/${profile?.profileId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setProfile(null);
          setSelectedImage(null);
          nav(`/dashboard/profiles`);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const changeRoleType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = roleTypeOptions.find(
      (p) => p?.key === Number(e.target.value)
    );

    // console.log(statusVal);
    // console.log(selectedRoleType);

    setSelectedRoleType(statusVal ?? selectedRoleType);
    //console.log(selectedRoleType);
  };

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${profileId === null ? "Create New Profile " : ` ${isEdit ? " Edit" : "View"} Profile`}`}</h1>
      </div>

      <Divider />

      {isLoading ? (
        <div
          className={`w-full flex flex-col gap-5 justify-center items-center text-center pt-[20%]`}
        >
          <Spinner
            className=" flex justify-center "
            color="primary"
            label="Loading..."
            size="lg"
          />
        </div>
      ) : (
        <div className="w-full flex justify-between items-center">
          {/* Form */}
          <form
            className=" w-full flex flex-col overflow-y-auto h-[85%] p-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Fname & Lname */}
            <div className="flex gap-10">
              <div className="w-full space-y-3">
                <label htmlFor="Firstname">Firstname</label>
                <Input
                  type="text"
                  isDisabled={!isEdit}
                  defaultValue={`${profile?.firstname ?? ""}`}
                  {...register("firstname")}
                  placeholder={`${profile?.firstname ?? "Enter firstname"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="Lastname">Lastname</label>
                <Input
                  type="text"
                  isDisabled={!isEdit}
                  defaultValue={`${profile?.lastname ?? ""}`}
                  {...register("lastname")}
                  placeholder={`${profile?.lastname ?? "Enter lastname"}`}
                />
              </div>
            </div>

            {/* Email & position */}
            <div className="flex gap-10">
              <div className="w-full space-y-3 flex flex-col">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  isDisabled={!isEdit}
                  defaultValue={`${profile?.email ?? ""}`}
                  {...register("email", { required: true })}
                  placeholder={`${profile?.email ?? "Enter email"}`}
                />
                {errors.email && (
                  <span className="text-danger">Email field is required</span>
                )}
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="position">Position</label>
                <Input
                  type="text"
                  isDisabled={!isEdit}
                  defaultValue={`${profile?.position ?? ""}`}
                  {...register("position")}
                  placeholder={`${profile?.position ?? "Enter Position"}`}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className={`${profileId === null ? "hidden" : "flex gap-10"}`}>
              <div className="w-full space-y-3">
                <label htmlFor="Password">Password</label>
                <Input
                  type="password"
                  ref={passRef}
                  placeholder="********"
                  isDisabled={!isEdit}
                  // required
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="Confirm password">Confirm password</label>
                <Input
                  type="password"
                  ref={coPassRef}
                  placeholder="********"
                  isDisabled={!isEdit}
                  // required
                />
              </div>
            </div>

            {/* Role & Mobile */}
            <div className="flex gap-10">
              <div className="w-full space-y-3">
                <div className="w-full flex flex-col space-y-5">
                  <label htmlFor="status">
                    Role Select : {selectedRoleType?.value}{" "}
                  </label>

                  <Select
                    className="max-w-xs"
                    defaultSelectedKeys={`${selectedRoleType?.key ?? roleTypeOptions[4].key}`}
                    // isDisabled={!isEdit ? true : false}
                    label="Select Role Type"
                    selectedKeys={`${selectedRoleType?.key}`}
                    // selectedKeys={[selectedRoleType]}
                    // onChange={(e) => {
                    //   changeRoleType(e);
                    // }}
                    onChange={changeRoleType}
                  >
                    {roleTypeOptions.map((status) => (
                      <SelectItem key={`${status.key}`}>
                        {status.value}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="w-full space-y-3">
                <label htmlFor="mobile">Mobile</label>
                <Input
                  defaultValue={`${profile?.mobile ?? ""}`}
                  isDisabled={!isEdit}
                  type="text"
                  {...register("mobile")}
                  placeholder={`${profile?.mobile ?? "Enter Mobile"}`}
                />
              </div>
            </div>

            {/* Bio */}
            <Textarea
              className="py-5"
              defaultValue={`${profile?.biography ?? ""}`}
              label="Description"
              type="text"
              {...register("biography")}
              placeholder={`${profile?.biography ?? "Enter Biography (optional)"}`}
            />

            {/* CTO */}
            <div className={`py-2`}>
              <Button variant="solid" color="primary" type="submit">
                {`${profileId === null ? "Save" : "update"}`}
              </Button>
            </div>
          </form>

          {/* Profile Image Info */}
          <div className="w-[60%] flex flex-col items-center rounded-xl p-5 h-[70%] gap-5">
            <div>
              <h1>Manage Profile Picture</h1>
            </div>
            <Divider />
            {selectedImage ? (
              <>
                <Image
                  className={`h-[25vh] object-cover`}
                  isZoomed
                  src={URL.createObjectURL(selectedImage)}
                />
              </>
            ) : (
              <>
                <Image
                  className={`h-[25vh] object-cover`}
                  isZoomed
                  src={
                    profile?.avatarUrl !== ""
                      ? profile?.avatarUrl
                      : siteConfig.staticAssets.staticLogo
                  }
                />
              </>
            )}

            <div className={`p-3 ${isEdit ? "flex" : "hidden"} items-center`}>
              <input
                accept="image/*"
                ref={thumbRef}
                type="file"
                onChange={(e) => {
                  onChangePic(e);
                }}
              />

              <span className="flex items-center p-1 hover:bg-default-200 hover:rounded-full">
                <GoTrash
                  size={20}
                  className=" text-danger-500"
                  onClick={removeSelectedImage}
                />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
