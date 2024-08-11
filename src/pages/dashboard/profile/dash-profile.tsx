import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button, Divider, Image, Input } from "@nextui-org/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Profile } from "../profiles/dash-profiles-list";
import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthRole } from "@/types";
import { GoTrash } from "react-icons/go";

export default function DashProfilePage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const posnRef = useRef<HTMLInputElement>(null);
  const mobiRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const coPassRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (profile === null) {
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
            profileId: `${res.data?.profileId}`,
            firstname: `${res.data?.firstname ?? ""}`,
            lastname: `${res.data?.lastname ?? ""}`,
            email: `${res.data?.email ?? ""}`,
            role: Number(res.data.roleType) ?? AuthRole.User,
            avatarUrl: `${res.data?.avatarUrl ?? ""}`,
            position: `${res.data?.position ?? ""}`,
          };
          setProfile(data);
        });
    }
  }, []);

  const roleName = (role: number) => {
    switch (role) {
      case AuthRole.Admin:
        return "Admin";
      case AuthRole.SuperAdmin:
        return "Super Admin";
      default:
        return "User";
    }
  };

  const handleProfileUpdate = () => {
    const data = new FormData();

    data.append("_method", `PUT`);
    data.append("profileId", `${profile?.profileId}`);
    data.append("email", `${emailRef?.current?.value}`);
    data.append("firstname", `${fnameRef?.current?.value}`);
    data.append("lastname", `${lnameRef?.current?.value}`);
    data.append("mobile", `${mobiRef?.current?.value}`);
    data.append("position", `${posnRef?.current?.value}`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

    if (passRef?.current?.value) {
      if (passRef?.current?.value !== coPassRef?.current?.value) {
        alert("Passwords dont match.");
      } else {
        data.append("password", `${posnRef?.current?.value}`);
      }
    }

    //  console.log(data.get('avatar'));

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
            {/* Form */}
            {/* Personal Info */}
            <div className="w-full flex justify-between">
              {/* Form */}
              <div className=" w-full overflow-y-auto h-[80%] px-5">
                {/* Fname & Lname */}
                <div className="flex gap-10">
                  <div className="w-full space-y-3">
                    <label htmlFor="Firstname">Firstname</label>
                    <Input
                      type="text"
                      ref={fnameRef}
                      placeholder={`${profile?.firstname ?? "Enter firstname"}`}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="Lastname">Lastname</label>
                    <Input
                      type="text"
                      ref={lnameRef}
                      placeholder={`${profile?.lastname ?? "Enter lastname"}`}
                    />
                  </div>
                </div>

                {/* Email & position */}
                <div className="flex gap-10">
                  <div className="w-full space-y-3">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="email"
                      ref={emailRef}
                      placeholder={`${profile?.email ?? "Enter email"}`}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="position">Position</label>
                    <Input
                      type="text"
                      ref={posnRef}
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
                      ref={posnRef}
                      placeholder={`${roleName(Number(profile?.role ?? 0)) ?? "Enter Role"}`}
                    />
                  </div>
                  <div className="w-full space-y-3">
                    <label htmlFor="mobile">Mobile</label>
                    <Input
                      type="text"
                      ref={mobiRef}
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
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={handleProfileUpdate}
                  >
                    Update
                  </Button>
                </div>
              </div>

              {/* Profile Image Info */}
              <div className="flex flex-col items-center rounded-xl w-[40%] p-5 h-[70%] gap-5">
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
                      src={`${profile?.avatarUrl !== "" ? profile?.avatarUrl : siteConfig.footerTexts.footerImage}`}
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
