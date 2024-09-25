import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Alumni } from "../dashboard/alumnis/dash-alumni-list";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { Avatar, Button, Divider, Input, Textarea } from "@nextui-org/react";
import { GoArrowUpRight, GoPersonFill, GoTrash } from "react-icons/go";
import { AuthRole } from "@/types";
import { Profile } from "../dashboard/profiles/dash-profiles-list";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AlumniList() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const [alumni] = useState<Alumni>();
  const [quillValue, setQuillValue] = useState('');
  const [isAlumni, setIsAlumni] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<Alumni>();

  const toDetail = (b: Alumni) => {
    navigate(`/alumni/${b?.alumniId}`, {
      state: `${b?.alumniId}`,
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
    onSaveAlumni(d);

    //alert(quillValue);
  };

  const onSaveAlumni = (p: Alumni) => {
    const data = new FormData();

    data.append("age", `${p?.age}`);
    data.append("participationSchool", `${p?.participationSchool ?? ""}`);
    data.append("participationYear", `${p?.participationYear ?? ""}`);
    data.append("currenctOccupation", `${p?.currenctOccupation ?? ""}`);
    data.append("story", `${p?.story ?? ""}`);
    data.append("roleType", `${AuthRole.Alumni ?? ""}`);
    data.append("email", `${p?.alumniProfile?.email ?? ""}`);
    data.append("firstname", `${p?.alumniProfile?.firstname ?? ""}`);
    data.append("lastname", `${p?.alumniProfile?.lastname ?? ""}`);
    data.append("mobile", `${p?.alumniProfile?.mobile ?? ""}`);

    if (selectedImage) {
      data.append("avatar", selectedImage);
    }

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
        console.log(err?.response);
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
      axios
        .get(`${api}/alumnis`)
        .then((res: AxiosResponse) => {
          setIsAlumni(true);
          const data: Alumni[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const data: Profile = {
              profileId: d?.alumniProfile?.profileId,
              firstname: d?.alumniProfile?.firstname ?? "",
              lastname: d?.alumniProfile?.lastname ?? "",
              email: d?.alumniProfile?.email ?? "",
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
            };
            return [resData];
          });

          setAlumnis(() => {
            return [...data];
          });
        })
        .catch((err: AxiosError) => {
          setIsAlumni(true);
          console.log(err);
        });
    }
  }, [alumnis, isAlumni]);
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>Alumni</h1>

        <div className="w-full flex flex-col px-20 gap-5 ">
          <h1 className=" text-2xl  font-semibold ">
            {" "}
            UWEZO Program Alumni stories
          </h1>

          <div className="w-full flex flex-wrap text-center gap-5">
            {alumnis === null || alumnis?.length === 0 ? (
              <div className={`w-full text-center`}>
                <h1 className=" text-xl text-center hidden">
                  No Alumnae stories at the momment!. Please check back soon
                </h1>
              </div>
            ) : (
              <div className="w-full flex flex-wrap gap-10">
                {alumnis?.flatMap((d) => (
                  <div
                    key={d?.alumniId}
                    className={`flex justify-between bg-default-100 gap-3 p-5 rounded-xl shadow text-end w-[25%]`}
                  >
                    <div>
                      <Avatar
                        size="lg"
                        src={
                          d?.alumniProfile?.avatarUrl !== "" || null
                            ? d?.alumniProfile?.avatarUrl
                            : ""
                        }
                        defaultValue={`${(<GoPersonFill />)}`}
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
                        ></label>
                        <h1>GHF {setRoleName(Number(d?.alumniProfile?.role))}</h1>
                      </div>
                      
                      <div className="">
                        <label
                          className="text-small text-slate-500"
                          htmlFor="pYear"
                        >Year</label>
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
          </div>

          <Divider />

          {/* Registration */}
          <div
            className={`${" rounded-2xl bg-default-200 w-full flex flex-col gap-3 justify-center items-center p-4 panel"}`}
          >
            <h1 className=" text-2xl ">Register as Alumni here.</h1>

            <div className=" shadow rounded-2xl bg-default-50 p-3 ">
              
              <form
                onSubmit={handleSubmit(onAlumniSubmit)}
                className=" flex flex-col gap-1 p-4 space-y-1"
              >
                {/* Fullnames */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Fname */}
                  <div className="w-full space-y-1">
                    <label className="text-default-500" htmlFor="Firstname">
                      Firstname
                    </label>
                    <Input
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
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="story">
                    In 100 words how did you benefit with the program
                  </label>
                  <Textarea
                    type="text"
                    defaultValue={`${alumni?.story ?? ""}`}
                    {...register("story")}
                    placeholder={`${alumni?.story ?? "Enter Brief story"}`}
                  />

                  <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue}/>
                
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

                    <span className={`flex items-center p-1 hover:bg-default-200 hover:rounded-full ${selectedImage ? "" : "hidden"}`}>
                      <GoTrash
                        size={20}
                        className=" text-danger-500"
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
