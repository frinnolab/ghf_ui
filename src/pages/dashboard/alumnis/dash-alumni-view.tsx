import { ChangeEvent, useEffect, useState } from "react";
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

export default function DashAlumniView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const route = useLocation();
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<Alumni>();

  const onAlumniSubmit: SubmitHandler<Alumni> = (d) => {
    console.log(d);
  };

  const [alumniId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });

  const handleBack = () => nav("/dashboard/alumni");

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
    if (alumniId) {
      axios
        .get(`${api}/alumnis/${alumniId}`)
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
            age: Number(res?.data?.age),
            alumniId: `${res?.data?.alumniId}`,
            profileId: `${res?.data?.profileId}`,
            participationSchool: `${res?.data?.participationSchool}`,
            participationYear: res?.data?.participationYear,
            story: res?.data?.story,
            alumniProfile: profData,
          };

          setAlumni(data);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [alumniId]);

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
          <div className={` self-end flex justify-between items-center gap-5 invisible`}>
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
            <form
              onSubmit={handleSubmit(onAlumniSubmit)}
              className=" flex flex-col gap-1 p-4 space-y-1"
            >
              {" "}
              <Avatar
                isBordered
                size="lg"
                radius="full"
                className="w-[20%] h-[30%]"
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
                    disabled
                    type="text"
                    defaultValue={`${alumni?.alumniProfile?.firstname ?? ""}`}
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
                    disabled
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
                    disabled
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
                    disabled
                    type="number"
                    min={0}
                    defaultValue={`${alumni?.alumniProfile?.mobile ?? ""}`}
                    {...register("alumniProfile.mobile")}
                    placeholder={`${alumni?.alumniProfile?.mobile ?? "Enter Mobile"}`}
                  />
                </div>
              </div>
              {/* Contacts End*/}
              {/* Ages */}
              <div className="w-full gap-5 flex justify-between items-center">
                {/* Age */}
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="age">
                    Age
                  </label>
                  <Input
                    disabled
                    type="number"
                    min={0}
                    defaultValue={`${alumni?.age ?? ""}`}
                    {...register("age")}
                    placeholder={`${alumni?.age ?? "Enter your age"}`}
                  />
                </div>

                {/* Occupation */}
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="ocuupation">
                    Current Occupation
                  </label>
                  <Input
                    disabled
                    type="text"
                    defaultValue={`${alumni?.currenctOccupation ?? ""}`}
                    {...register("currenctOccupation")}
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
                    disabled
                    type="text"
                    defaultValue={`${alumni?.participationSchool ?? ""}`}
                    {...register("participationSchool")}
                    placeholder={`${alumni?.participationSchool ?? "Enter School Name"}`}
                  />
                </div>

                {/* Year */}
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="year">
                    Participation Year
                  </label>
                  <Input
                    disabled
                    type="number"
                    min={2000}
                    defaultValue={`${alumni?.participationYear ?? ""}`}
                    {...register("participationYear")}
                    placeholder={`${alumni?.participationYear ?? "Enter Year"}`}
                  />
                </div>
              </div>
              {/* Schools End*/}
              {/* Editor */}
              <div className="w-full space-y-1 hidden">
                <label className="text-default-500" htmlFor="story">
                  In 100 words how did you benefit with the program
                </label>
                <Textarea
                  type="text"
                  defaultValue={`${alumni?.story ?? ""}`}
                  {...register("story")}
                  placeholder={`${alumni?.story ?? "Enter Brief story"}`}
                />
              </div>
              <div className="w-full space-y-1 hidden">
                <label className="text-default-500" htmlFor="profilePic">
                  Attach profile picture (Optional)
                </label>

                <div className="p-3 flex items-center">
                  <input
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
              <div className="w-full space-y-1 items-center justify-end hidden">
                <Button color="primary" type="submit">
                  {"Submit"}
                </Button>
              </div>
            </form>
          </div>
          {/* Form End */}

          {/* Bio Data */}
          <div className="w-full flex flex-col gap-5 overflow-hidden h-[70vh] p-3">
            <h1 className=" text-2xl ">Impact Story</h1>
            <Divider />
            <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {alumni?.story}
            </p>
          </div>
          {/* Bio Data End */}
        </div>
      </div>
      {/* Content End */}
    </div>
  );
}
