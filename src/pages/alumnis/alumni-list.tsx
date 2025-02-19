/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Avatar,
  Button,
  // Divider,
  Input,
  Spinner,
  Image,
} from "@nextui-org/react";
import { GoArrowUpRight, GoPersonFill, GoTrash } from "react-icons/go";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";

import * as motion from "motion/react-client";
import { Alumni } from "../dashboard/alumnis/dash-alumni-list";
import { Profile } from "../dashboard/profiles/dash-profiles-list";

import DefaultLayout from "@/layouts/default";
// import { title } from "@/components/primitives";
import { AuthRole } from "@/types";
import "react-quill/dist/quill.snow.css";

// import { Qformats, Qmodules } from "../dashboard/blog/dash-blog-create";

export const Alumniformats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  // "link",
  // "image",
  // "video",
];

export const Alumnimodules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // ["image"],
    // ["video"],
    // ["link"],
    ["clean"],
  ],
};

export default function AlumniList() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const [alumni] = useState<Alumni>();
  const [quillValue, setQuillValue] = useState<string>("");
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<Alumni>();

  const toDetail = (b: Alumni) => {
    navigate(`/alumni/${b?.alumniId}`, {
      state: {
        alumniId: `${b?.alumniId}`,
        alumniProfileId: `${b?.alumniProfile?.profileId}`,
      },
    });
  };

  const setRoleName = (role: AuthRole) => {
    switch (role) {
      case AuthRole.Alumni:
        return "Alumni";
      default:
        return "Alumni";
    }
  };

  const onAlumniSubmit: SubmitHandler<Alumni> = (d) => {
    setIsloading(true);
    onSaveAlumni(d);
  };

  const onSaveAlumni = (p: Alumni) => {
    const data = new FormData();

    data.append("age", `${p?.age}`);
    data.append("participationSchool", `${p?.participationSchool ?? ""}`);
    data.append("participationYear", `${p?.participationYear ?? ""}`);
    data.append("currenctOccupation", `${p?.currenctOccupation ?? ""}`);
    data.append("story", `${quillValue ?? ""}`);
    data.append("roleType", `${AuthRole.Alumni}`);
    data.append("email", `${p?.alumniProfile?.email ?? ""}`);
    data.append("firstname", `${p?.alumniProfile?.firstname ?? ""}`);
    data.append("lastname", `${p?.alumniProfile?.lastname ?? ""}`);
    data.append("mobile", `${p?.alumniProfile?.mobile ?? ""}`);
    data.append("isPublished", `0`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

    //console.log(JSON.stringify(data.forEach((d=>console.log(d)))));

    axios
      .post(`${api}/alumnis`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          alert("Successfully Submitted.");
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err?.response);
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

  useEffect(() => {
    if (!isAlumni) {
      setIsloading(true);
      axios
        .get(`${api}/alumnis?isPublished=1`)
        .then((res: AxiosResponse) => {
          setIsAlumni(true);
          const data: Alumni[] = Array.from(res?.data).flatMap((d: any) => {
            const data: Profile = {
              profileId: d?.alumniProfile?.profileId,
              firstname: d?.alumniProfile?.firstname ?? "",
              lastname: d?.alumniProfile?.lastname ?? "",
              email: `${d?.alumniProfile?.email ?? ""}`,
              role: Number(d?.alumniProfile.roleType) ?? AuthRole.Alumni,
              avatarUrl: d?.alumniProfile?.avatarUrl ?? "",
              position: d?.alumniProfile?.position ?? "",
              mobile: d?.alumniProfile?.mobile ?? "",
            };
            const resData: Alumni = {
              alumniId: `${d?.alumniId}`,
              alumniProfile: data,
              participationSchool: d?.participationSchool,
              participationYear: d?.participationYear,
              currenctOccupation: d?.currenctOccupation,
              profileId: d?.profileId,
              age: d?.age,
              story: d?.story,
              isPublished: Boolean(Number(res?.data["isPublished"])),
            };

            return [resData];
          });

          setAlumnis(() => {
            return [...data];
          });
          setIsAlumni(true);

          setTimeout(()=>{
            setIsloading(false);
          },1500)
        })
        .catch((err: AxiosError) => {
          setIsAlumni(true);
          console.error(err);
        });
    }
  }, [alumnis, isAlumni]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-5">
        
        <div className="w-full flex flex-col items-center gap-5 md:p-10 md:min-h-[80dvh] relative">
          <motion.div className={`w-full absolute top-[-65%] saturate-[100%]`}>
            <Image
              alt="About Bg"
              radius="none"
              src="assets/images/static/Alumni_BG.JPG"
              width={5000}
            />
          </motion.div>

          {/* <div className="inline-block max-w-lg text-center justify-center p-3 z-10"> */}
          <div className="w-full flex z-10">
            <motion.h1
              className={`text-3xl md:text-5xl text-black font-semibold`}
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
              Alumni Stories
            </motion.h1>

            <div/>
          </div>

          {/* Bio */}
          <motion.div
            className="rounded-2xl z-10 bg-default-50/65"
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
              Great Hope Foundation asked a few Alumni of UWEZO PROGRAM who are
              now in the labor market to share any Impact they can trace and the
              contribution of UWEZO PROGRAM to what they have been able to
              achieved do so far. Since its initiation in 2016, Great Hope
              Foundation has worked with over 5,000 Secondary School students in
              over 1,200 Secondary Schools. Here are a few stories that we
              captured.
            </motion.p>
          </motion.div>
        </div>

        {/* <Divider /> */}

        <div className="w-full flex flex-col px-20 gap-5 z-10">
          <div className="w-full flex pb-5">
            <h1 hidden className=" text-2xl font-semibold bg-default-50/50 p-5 rounded-md">
              {" "}
              UWEZO Program Alumni stories
            </h1>

            <div />
          </div>

          <div className="w-full flex justify-center flex-wrap text-center gap-5 space-y-5">
            {isLoading ? (
              <>
                <Spinner
                  className=" flex justify-center "
                  color="primary"
                  label="Loading Alumnis..."
                  size="lg"
                />
              </>
            ) : (
              <>
                {alumnis === null || alumnis?.length === 0 ? (
                  <div className={`w-full text-center`}>
                    <h1 className=" text-xl text-center hidden">
                      No Alumnae stories at the momment!. Please check back soon
                    </h1>
                  </div>
                ) : (
                  <div className="w-full flex flex-col md:flex-row flex-wrap gap-10">
                    {alumnis?.flatMap((d) => (
                      <div
                        key={d?.alumniId}
                        className={`w-full flex justify-between bg-default-100 gap-3 p-5 rounded-xl shadow text-end md:w-[25%]`}
                      >
                        <div>
                          <Avatar
                            defaultValue={`${(<GoPersonFill />)}`}
                            size="lg"
                            src={
                              d?.alumniProfile?.avatarUrl !== "" || null
                                ? d?.alumniProfile?.avatarUrl
                                : ""
                            }
                          />
                        </div>

                        {/* Content */}
                        <div>
                          <div className="">
                            <label
                              className="text-small text-slate-500"
                              htmlFor="pname"
                            >
                              Fullname
                            </label>
                            <h1>
                              {d?.alumniProfile?.firstname}{" "}
                              {d?.alumniProfile?.lastname}
                            </h1>
                          </div>

                          <div className="">
                            <label
                              className="text-small text-slate-500"
                              htmlFor="pAlumni"
                            />
                            <h1>
                              GHF {setRoleName(Number(d?.alumniProfile?.role))}
                            </h1>
                          </div>

                          <div className="">
                            <label
                              className="text-small text-slate-500"
                              htmlFor="pYear"
                            >
                              Year
                            </label>
                            <h1>{d?.participationYear}</h1>
                          </div>

                          <div className="p-1">
                            <Button
                              variant="light"
                              color="primary"
                              className="flex items-center border border-primary-400 hover:border-transparent"
                              onClick={() => {
                                toDetail(d);
                              }}
                            >
                              View Alumni <GoArrowUpRight size={20} />
                            </Button>
                          </div>
                        </div>
                        {/* Content End */}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* <Divider /> */}

          {/* Registration */}
          <div
            className={`${isLoading ? "hidden" : "md:rounded-2xl md:bg-default-200 w-full flex flex-col gap-3 justify-center items-center p-4 panel"}`}
          >
            <h1 className=" text-2xl ">Register as Alumni here.</h1>

            <div className=" md:shadow md:rounded-2xl bg-default-50 p-3 ">
              <form
                className={` flex flex-col gap-1 p-4 space-y-1`}
                onSubmit={handleSubmit(onAlumniSubmit)}
              >
                {/* Fullnames */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Fname */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="Firstname">
                      Firstname
                    </label>
                    <Input
                      defaultValue={`${alumni?.alumniProfile?.firstname ?? ""}`}
                      type="text"
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
                      defaultValue={`${alumni?.alumniProfile?.lastname ?? ""}`}
                      type="text"
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
                      defaultValue={`${alumni?.alumniProfile?.email ?? ""}`}
                      type="email"
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
                      defaultValue={`${alumni?.alumniProfile?.mobile ?? ""}`}
                      min={0}
                      type="number"
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
                      defaultValue={`${alumni?.age ?? ""}`}
                      min={0}
                      type="number"
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
                      defaultValue={`${alumni?.currenctOccupation ?? ""}`}
                      type="text"
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
                      defaultValue={`${alumni?.participationSchool ?? ""}`}
                      type="text"
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
                      defaultValue={`${alumni?.participationYear ?? ""}`}
                      min={2000}
                      type="number"
                      {...register("participationYear")}
                      placeholder={`${alumni?.participationYear ?? "Enter Year"}`}
                    />
                  </div>
                </div>

                {/* Schools End*/}

                {/* Editor */}
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="story">
                    In 100 words how did you benefit with the program
                  </label>
                  {/* <Textarea
                    defaultValue={`${alumni?.story ?? ""}`}
                    type="text"
                    {...register("story")}
                    placeholder={`${alumni?.story ?? "Enter Brief story"}`}
                  /> */}

                  <ReactQuill
                    formats={Alumniformats}
                    modules={Alumnimodules}
                    placeholder={`${"Enter story description"}`}
                    style={{
                      border: "none",
                      height: "20dvh",
                      width: "80dvh",
                      overflow: "hidden",
                      overflowX: "hidden",
                    }}
                    theme="snow"
                    value={quillValue.substring(0, 110)}
                    onChange={(e) => {
                      if (e.length === 105) {
                        alert(`Maximum character length reached.`);
                      } else {
                        setQuillValue(e);
                      }
                    }}
                  />

                  {/* <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue}/> */}
                </div>

                <div className="w-full space-y-1">
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
                        className=" text-danger-500"
                        size={20}
                        onClick={removeSelectedImage}
                      />
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-1 flex items-center justify-end">
                  <Button color="primary" type="submit">
                    {"Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
