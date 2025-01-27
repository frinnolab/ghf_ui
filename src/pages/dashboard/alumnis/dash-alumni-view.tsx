import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alumni } from "./dash-alumni-list";
import { Button } from "@nextui-org/button";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
import { Avatar, Divider, Input, Textarea } from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { AuthRole } from "@/types";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Profile } from "../profiles/dash-profiles-list";
import { siteConfig } from "@/config/site";
import { SubmitHandler, useForm } from "react-hook-form";
import useAuthedProfile from "@/hooks/use-auth";

export default function DashAlumniView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const route = useLocation();
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [alumniProfile, setAlumniProfile] = useState<Profile | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Alumni Info Refs
  const ageRef = useRef<HTMLInputElement>(null);
  const occupationRef = useRef<HTMLInputElement>(null);
  const pSchoolRef = useRef<HTMLInputElement>(null);
  const pYearRef = useRef<HTMLInputElement>(null);
  const pStoryRef = useRef<HTMLTextAreaElement>(null);
  // Alumni Info Refs End
  const authed = useAuthedProfile();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<Alumni | Profile>();

  const [alumniId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state["alumniId"];
    } else {
      return null;
    }
  });

  const [alumniProfileId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state["alumniProfileId"];
    } else {
      return null;
    }
  });

  const handleBack = () => nav("/dashboard/alumni");

  const onAlumniSubmit = () => {
    // console.log(d);
    const data = new FormData();

    data.append("_method", `PUT`);
    data.append("age", `${ageRef?.current?.value}`);
    data.append("participationSchool", `${pSchoolRef?.current?.value}`);
    data.append("participationYear", `${pYearRef?.current?.value}`);
    data.append("currenctOccupation", `${occupationRef?.current?.value}`);
    data.append("story", `${pStoryRef?.current?.value}`);

    setIsEdit(false);

    axios
      .post(`${api}/alumnis/${alumniId}`, data, {
        headers: {
          Authorization: `Bearer ${authed?.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          //alert("Successfully Submitted.");
          // nav(`/dashboard/alumnis`);
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err?.response);
      });
  };

  const onAlumniProfileSubmit: SubmitHandler<Profile> = (d) => {
    const data = new FormData();

    data.append("_method", `PUT`);
    data.append("roleType", `${AuthRole.Alumni}`);
    data.append("email", `${d?.email}`);
    data.append("firstname", `${d?.firstname}`);
    data.append("lastname", `${d?.lastname}`);
    data.append("mobile", `${d?.mobile}`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

    axios
      .post(`${api}/profiles/${alumniProfileId}`, data, {
        headers: {
          Authorization: `Bearer ${authed?.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          //alert("Successfully Submitted.");
          // nav(`/dashboard/alumnis`);
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err?.response);
      });
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (alumniId && alumniProfileId) {
      axios
        .get(`${api}/alumnis/${alumniId}/${alumniProfileId}`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const profData: Profile = {
            profileId: res.data?.alumniProfile?.profileId,
            firstname: res.data?.alumniProfile?.firstname,
            lastname: res.data?.alumniProfile?.lastname,
            email: res.data?.alumniProfile?.email,
            role: Number(res.data.alumniProfile?.roleType) ?? AuthRole.Alumni,
            avatarUrl: `${res.data?.alumniProfile?.avatarUrl ?? ""}`,
            position: res.data?.alumniProfile?.position,
          };

          const data: Alumni = {
            age: Number(res?.data?.age ?? 0),
            alumniId: `${res?.data?.alumniId}`,
            profileId: `${res?.data?.profileId}`,
            participationSchool: `${res?.data?.participationSchool}`,
            participationYear: `${res?.data?.participationYear}` ,
            currenctOccupation : res?.data?.currentOccupation,
            story: res?.data?.story,
            alumniProfile: profData,
          };

          setAlumni(data);
          setAlumniProfile(profData);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create New Alumni" : ` ${isEdit ? " Edit" : "View"} Alumni Profile`}`}</h1>
      </div>

      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={`w-full flex justify-between items-center gap-5 `}>
          <div></div>
          <div className={` self-end flex justify-between items-center gap-5`}>
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
        </div>

        {/* Content */}
        <div className="w-full rounded-2xl flex p-5 justify-between gap-5 bg-slate-200">
          {/* Form */}
          <div className="w-full flex flex-col gap-5 overflow-y-scroll h-[70vh] p-5 ">
            <div className=" flex justify-between  gap-5 p-4 space-y-1">
              {/* Profile Info */}

              <form
                className="w-full flex flex-col gap-2"
                onSubmit={handleSubmit(onAlumniProfileSubmit)}
              >
                {" "}
                <Avatar
                  isBordered
                  size="lg"
                  radius="full"
                  className=" w-[20%] h-[35%] "
                  src={`${
                    alumni?.alumniProfile?.avatarUrl === "" || null
                      ? siteConfig?.staticAssets?.staticLogo
                      : alumni?.alumniProfile?.avatarUrl
                  }`}
                />
                {/* Fullnames */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Fname */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="Firstname">
                      Firstname
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="text"
                      defaultValue={alumni?.alumniProfile?.firstname ?? ""}
                      {...register("alumniProfile.firstname")}
                      placeholder={`${alumni?.alumniProfile?.firstname ?? "Enter Firstname"}`}
                    />
                  </div>

                  {/* Lname */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="Lastname">
                      Lastname
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="text"
                      defaultValue={`${alumni?.alumniProfile?.lastname ?? ""}`}
                      {...register("alumniProfile.lastname")}
                      placeholder={`${alumni?.alumniProfile?.lastname ?? "Enter Lastname"}`}
                    />
                  </div>
                </div>
                {/* Fullnames End*/}
                {/* Contacts */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Email */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="email">
                      Email
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="email"
                      defaultValue={`${alumni?.alumniProfile?.email ?? ""}`}
                      {...register("alumniProfile.email")}
                      placeholder={`${alumni?.alumniProfile?.email ?? "Enter Email"}`}
                    />
                  </div>

                  {/* Contact */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="mobile">
                      Mobile
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="number"
                      min={0}
                      defaultValue={`${alumni?.alumniProfile?.mobile ?? ""}`}
                      {...register("alumniProfile.mobile")}
                      placeholder={`${alumni?.alumniProfile?.mobile ?? "Enter Mobile"}`}
                    />
                  </div>
                </div>
                {/* Contacts End*/}
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="profilePic">
                    Attach profile picture (Optional)
                  </label>

                  <div
                    className={`p-3 flex items-center ${isEdit ? "" : "disabled:"} `}
                  >
                    <input
                      disabled={!isEdit ? true : false}
                      accept="image/*"
                      type="file"
                      onChange={(e) => {
                        onChangePic(e);
                      }}
                    />

                    <span
                      className={`flex items-center p-1 hover:bg-default-200 hover:rounded-full ${selectedImage ? "" : "hidden"}`}
                    >
                      <GoTrash
                        size={20}
                        className=" text-danger-500"
                        onClick={removeSelectedImage}
                      />
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="w-full space-y-1 items-center justify-end">
                  <Button
                    className={`${alumni === null ? "bg-default" : "bg-primary"}`}
                    type="submit"
                    disabled={!isEdit ? true : false}
                  >
                    {`${alumniProfile === null ? "Add Alumni Profile" : "Update Alumni Profile"}`}
                  </Button>
                </div>
              </form>

              {/* Profile Info End */}
              {/* Alumni Info */}

              <form className="w-full flex flex-col gap-3">
                {/* Ages */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Age */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="age">
                      Age
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="number"
                      min={0}
                      ref={ageRef}
                      // defaultValue={`${alumni?.age ?? ""}`}
                      // {...register("age")}
                      placeholder={`${alumni?.age ?? "Enter your age"}`}
                    />
                  </div>

                  {/* Occupation */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="ocuupation">
                      Current Occupation
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="text"
                      ref={occupationRef}
                      // defaultValue={`${alumni?.currenctOccupation ?? ""}`}
                      // {...register("currenctOccupation")}
                      placeholder={`${alumni?.currenctOccupation ?? "Enter Occupation"}`}
                    />
                  </div>
                </div>
                {/* Ages End*/}
                {/* Schools */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* School */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="school">
                      Participation School
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="text"
                      ref={pSchoolRef}
                      // defaultValue={`${alumni?.participationSchool ?? ""}`}
                      // {...register("participationSchool")}
                      placeholder={`${alumni?.participationSchool ?? "Enter School Name"}`}
                    />
                  </div>

                  {/* Year */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="year">
                      Participation Year
                    </label>
                    <Input
                      disabled={!isEdit ? true : false}
                      type="number"
                      min={2000}
                      ref={pYearRef}
                      // defaultValue={`${alumni?.participationYear ?? ""}`}
                      // {...register("participationYear")}
                      placeholder={`${alumni?.participationYear ?? "Enter Year"}`}
                    />
                  </div>
                </div>
                {/* Schools End*/}
                {/* Editor */}
                <div className="w-full space-y-1 ">
                  <label className="text-default-500" htmlFor="story">
                    In 100 words how did you benefit with the program
                  </label>
                  <Textarea
                    disabled={!isEdit ? true : false}
                    type="text"
                    maxLength={100}
                    ref={pStoryRef}
                    // defaultValue={`${alumni?.story ?? ""}`}
                    // {...register("story")}
                    placeholder={`${alumni?.story ?? "Enter Brief story"}`}
                  />
                </div>

                {/* Alumni Actions */}
                <div className="w-full space-y-1 items-center justify-end">
                  <Button
                    className={`${alumni === null ? " bg-default " : "bg-primary"}`}
                    disabled={!isEdit ? true : false}
                    onClick={onAlumniSubmit}
                  >
                    {`${alumni === null ? "Add Alumni info" : "Update Alumni Info"}`}
                  </Button>
                </div>
                {/* Alumni Actions End */}
                {/* Alumni Info End*/}
              </form>
            </div>
          </div>
          {/* Form End */}
        </div>
      </div>
      {/* Content End */}
    </div>
  );
}
