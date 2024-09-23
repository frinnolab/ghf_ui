import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button, Divider, Image, Input, Spinner } from "@nextui-org/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Profile } from "../profiles/dash-profiles-list";
import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthRole } from "@/types";
import { GoTrash } from "react-icons/go";
import { useForm, SubmitHandler } from "react-hook-form";

export default function DashProfilePage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const coPassRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  //Form State
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>();

  useEffect(() => {
    if (profile === null) {
      setIsloading(true);

      axios
        .get(`${api}/profiles/${authed?.profileId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);

          const data: Profile = {
            profileId: res.data?.profileId,
            firstname: res.data?.firstname ?? "",
            lastname: res.data?.lastname ?? "",
            email: res.data?.email ?? "",
            role: Number(res.data.roleType) ?? AuthRole.User,
            avatarUrl: res.data?.avatarUrl ?? "",
            position: res.data?.position ?? "",
          };
          setProfile(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [profile]);

  const roleName = (role: number) => {
    switch (role) {
      case AuthRole.Admin:
        return "Admin";
      case AuthRole.SuperAdmin:
        return "Super Admin";
      case AuthRole.Alumni:
        return "Alumni";
      default:
        return "User";
    }
  };

  const onSubmit: SubmitHandler<Profile> = (d) => {
    handleProfileUpdate(d);
  };

  const handleProfileUpdate = (d: Profile) => {
    const data = new FormData();

    data.append("_method", `PUT`);
    data.append("profileId", `${profile?.profileId}`);
    data.append("email", `${d?.email ?? profile?.email}`);
    data.append("firstname", `${d?.firstname ?? profile?.firstname}`);
    data.append("lastname", `${d?.lastname ?? profile?.lastname}`);
    data.append("mobile", `${d?.mobile ?? profile?.mobile}`);
    data.append("position", `${d?.position ?? profile?.position}`);
    data.append("role", `${d?.role ?? profile?.role}`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

    if (passRef?.current?.value) {
      if (passRef?.current?.value !== coPassRef?.current?.value) {
        alert("Passwords dont match.");
      } else {
        data.append("password", `${passRef?.current?.value}`);
      }
    }

    //Update Profile
    axios
      .post(`${api}/profiles/${authed?.profileId}`, data, {
        headers: {
          Authorization: `Bearer ${authed?.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setProfile(null);
        setSelectedImage(null);
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
      });
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
    <DashboardLayout>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between gap-5">
          {/* Profile Info */}
          <div className="w-full rounded-xl p-3  flex flex-col">
            <div className=" space-y-3 ">
              <h1 className=" text-2xl ">Manage Profile</h1>
              <h1 className=" text-small ">Update your personal information</h1>
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
              <div className="w-full flex justify-between">
                {/* Form */}
                <form
                  className=" w-full flex flex-col overflow-y-auto h-[85%] px-5"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* Fname & Lname */}
                  <div className="flex gap-10">
                    <div className="w-full space-y-3">
                      <label htmlFor="Firstname">Firstname</label>
                      <Input
                        type="text"
                        defaultValue={`${profile?.firstname ?? ""}`}
                        {...register("firstname")}
                        placeholder={`${profile?.firstname ?? "Enter firstname"}`}
                      />
                    </div>

                    <div className="w-full space-y-3">
                      <label htmlFor="Lastname">Lastname</label>
                      <Input
                        type="text"
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
                        defaultValue={`${profile?.email ?? ""}`}
                        {...register("email", { required: true })}
                        placeholder={`${profile?.email ?? "Enter email"}`}
                      />
                      {errors.email && (
                        <span className="text-danger">
                          Email field is required
                        </span>
                      )}
                    </div>

                    <div className="w-full space-y-3">
                      <label htmlFor="position">Position</label>
                      <Input
                        type="text"
                        defaultValue={`${profile?.position ?? ""}`}
                        {...register("position")}
                        placeholder={`${profile?.position ?? "Enter Position"}`}
                      />
                    </div>
                  </div>
                  {/* Role & Mobile */}
                  <div className="flex gap-10">
                    <div className="w-full space-y-3">
                      <label htmlFor="role">Role</label>
                      <Input
                        disabled
                        type="text"
                        placeholder={`${roleName(Number(profile?.role ?? 0)) ?? "Enter Role"}`}
                      />
                    </div>
                    <div className="w-full space-y-3">
                      <label htmlFor="mobile">Mobile</label>
                      <Input
                        type="text"
                        defaultValue={`${profile?.mobile ?? ""}`}
                        {...register("mobile")}
                        placeholder={`${profile?.mobile ?? "Enter Mobile"}`}
                      />
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="flex gap-10">
                    <div className="w-full space-y-3">
                      <label htmlFor="Password">Password</label>
                      <Input
                        type="password"
                        ref={passRef}
                        placeholder="********"
                      />
                    </div>

                    <div className="w-full space-y-3">
                      <label htmlFor="Confirm password">Confirm password</label>
                      <Input
                        type="password"
                        ref={coPassRef}
                        placeholder="********"
                      />
                    </div>
                  </div>

                  {/* CTO */}
                  <div className="flex py-2">
                    <Button variant="solid" color="primary" type="submit">
                      Update
                    </Button>
                  </div>
                </form>

                {/* Profile Image Info */}
                <div className="flex flex-col items-center rounded-xl w-[50%] p-5 h-[70%] gap-5">
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

                  <div className="p-3 flex items-center">
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
            {/* Form */}
            {/* Personal Info */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
