import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button, Divider, Image, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Profile } from "../profiles/dash-profiles-list";
import axios, { AxiosResponse } from "axios";
import { AuthRole } from "@/types";

export default function DashProfilePage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const posnRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const coPassRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) {
      axios
        .get(`${api}/profiles/${authed?.profileId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          const data: Profile = {
            profileId: `${res.data?.profileId}`,
            firstname: `${res.data?.firstname ?? ""}`,
            lastname: `${res.data?.lastname ?? ""}`,
            email: `${res.data?.email ?? ""}`,
            role: Number(res.data.roleType) ?? AuthRole.User,
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

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between gap-5">
          {/* Profile Info */}
          <div className="w-full rounded-xl p-3 border flex flex-col">
            <div className=" space-y-3 ">
              <h1 className=" text-2xl ">Manage Profile</h1>
              <h1 className=" text-small ">Update your personal information</h1>
            </div>
            <Divider />
            {/* Form */}
            {/* Personal Info */}
            <div className="w-full">
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
                      ref={emailRef}
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
                <div className="flex justify-end py-2">
                  <Button variant="solid" color="primary">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Image Info */}
          <div className="flex flex-col rounded-xl w-[30%] p-5 h-[70%] gap-5">
            <Image isZoomed src={siteConfig.footerTexts.footerImage} />

            <Button variant="solid" color="primary">Change</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
