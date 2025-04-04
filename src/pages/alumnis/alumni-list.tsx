/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  // Divider,
  Input,
  Spinner,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
  Divider,
} from "@nextui-org/react";
import { GoArrowRight, GoTrash } from "react-icons/go";
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
  "link",
  "image",
  "video",
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
    ["image"],
    ["video"],
    ["link"],
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    setIsloading(true);
    const data = new FormData();

    data.append("age", `${p?.age}`);
    data.append("participationSchool", `${p?.participationSchool ?? ""}`);
    data.append("participationYear", `${p?.participationYear ?? ""}`);
    data.append("currenctOccupation", `${p?.currenctOccupation ?? ""}`);
    data.append("story", `${quillValue}`);
    data.append("roleType", `${AuthRole.Alumni}`);
    data.append("email", `${p?.alumniProfile?.email ?? ""}`);
    data.append("firstname", `${p?.alumniProfile?.firstname ?? ""}`);
    data.append("lastname", `${p?.alumniProfile?.lastname ?? ""}`);
    data.append("mobile", `${p?.alumniProfile?.mobile ?? ""}`);
    data.append("isPublished", `0`);

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
              avatarUrl: d?.alumniProfile?.avatarUrl,
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

          setTimeout(() => {
            setIsloading(false);
          }, 1500);
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
        <div className="w-full flex flex-col items-center gap-5  md:p-10 h-[30dvh] md:min-h-[80dvh] relative">
          <motion.div
            className={`w-full absolute top-[-35%] md:top-[-50%] saturate-[100%]`}
          >
            <Image
              alt="About Bg"
              radius="none"
              src="assets/images/static/Alumni_BG.JPG"
              width={5000}
            />
          </motion.div>

          {/* <div className="inline-block max-w-lg text-center justify-center p-3 z-10"> */}
          <div className="hidden z-10">
            <motion.h1
              className={`text-3xl md:text-5xl text-orange-500 font-semibold`}
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
            <motion.span
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  ease: "linear",
                  delay: 0.8,
                  duration: 1,
                },
              }}
            >
              <Divider className="p-1 bg-orange-500 -rotate-3" />
            </motion.span>
            <div />
          </div>
        </div>

        {/* <Divider /> */}
        <div className="z-20">
          {/* Bio */}
          <motion.div
            className="bg-default-100"
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
              transition: {
                ease: "linear",
                delay: 0.5,
                duration: 1,
              },
            }}
          >
            <motion.p className=" text-2xl md:text-3xl text-black text-pretty p-5 md:py-10">
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

        <div className="w-full flex justify-center py-5 relative">
          <Button
            className=" bg-orange-400 "
            size="lg"
            variant="solid"
            onPress={onOpen}
          >
            {" "}
            Add Your Story
          </Button>

          {/* Donate Form */}
          <Modal
            backdrop="blur"
            isOpen={isOpen}
            size="2xl"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <h1>Add Alumni Story</h1>
                  </ModalHeader>
                  <ModalBody>
                    {isLoading ? (
                      <>
                        <Spinner
                          className=" flex justify-center "
                          color="primary"
                          label="Submitting Alumni..."
                          size="lg"
                        />
                      </>
                    ) : (
                      <form
                        className={` flex flex-col gap-1 p-4 space-y-1`}
                        onSubmit={handleSubmit(onAlumniSubmit)}
                      >
                        {/* Fullnames */}
                        <div className="w-full gap-5 flex justify-between items-center">
                          {/* Fname */}
                          <div className="w-full space-y-1">
                            <label
                              className="text-default-500"
                              htmlFor="Firstname"
                            >
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
                            <label
                              className="text-default-500"
                              htmlFor="Lastname"
                            >
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
                            <label
                              className="text-default-500"
                              htmlFor="mobile"
                            >
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
                            <label
                              className="text-default-500"
                              htmlFor="ocuupation"
                            >
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
                            <label
                              className="text-default-500"
                              htmlFor="school"
                            >
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
                            Add your story
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
                              height: "15dvh",
                              width: "80dvh",
                              overflowY: "scroll",
                              overflowX: "hidden",
                            }}
                            theme="snow"
                            value={quillValue}
                            onChange={(e) => {
                              setQuillValue(e);
                            }}
                          />

                          {/* <ReactQuill theme="snow" value={quillValue} onChange={setQuillValue}/> */}
                        </div>

                        <div className="w-full space-y-1">
                          <label
                            className="text-default-500"
                            htmlFor="profilePic"
                          >
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
                        {/* <div className="w-full space-y-2 flex items-center justify-end">
                          <Button color="primary" type="submit">
                            {"Submit"}
                          </Button>
                        </div> */}

                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>

                          <Button
                            color="primary"
                            type="submit"
                            // onPress={onClose}
                          >
                            Submit
                          </Button>
                        </ModalFooter>
                      </form>
                    )}
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          {/* Donate Form End */}
        </div>

        <div
          className={` ${alumnis === null || alumnis.length === 0 ? "hidden" : "w-full flex flex-col bg-default-200 px-5 md:px-20 gap-5 z-10"}`}
        >
          <div className="w-full flex">
            <h1 className=" text-3xl md:text-4xl text-black hover:text-orange-500 uppercase font-semibold">
              {" "}
              UWEZO Program Alumni stories
            </h1>

            <div />
          </div>

          <div className="w-full flex justify-center flex-wrap text-center gap-5 space-y-3">
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
                      {/* No Alumnae stories at the momment!. Please check back soon */}
                    </h1>
                  </div>
                ) : (
                  <div className="w-full flex flex-col md:flex-row  flex-wrap gap-10 pb-5">
                    {alumnis?.flatMap((d) => (
                      <div
                        key={d?.alumniId}
                        className={`w-full flex flex-col bg-default-100 gap-3 rounded-xl text-end md:w-[25%]`}
                      >
                        {/* <div>
                          <Avatar
                            defaultValue={`${(<GoPersonFill />)}`}
                            size="lg"
                            src={
                              d?.alumniProfile?.avatarUrl !== "" || null
                                ? d?.alumniProfile?.avatarUrl
                                : ""
                            }
                          />
                        </div> */}

                        <Image
                          // isZoomed
                          className={`w-screen h-[30dvh] object-cover rounded-b-none`}
                          src={
                            d?.alumniProfile?.avatarUrl !== null
                              ? d?.alumniProfile?.avatarUrl
                              : "assets/images/static/ghf_default.png"
                          }
                        />

                        {/* Content */}
                        <div className="p-0">
                          <div className=" px-5">
                            <label
                              className="text-small text-default-500"
                              htmlFor="pname"
                            >
                              Fullname
                            </label>
                            <h1>
                              {d?.alumniProfile?.firstname}{" "}
                              {d?.alumniProfile?.lastname}
                            </h1>
                          </div>

                          <div className="hidden px-5">
                            <label
                              className="text-small text-default-500"
                              htmlFor="pAlumni"
                            />
                            <h1 className="text-default-500">
                              GHF {setRoleName(Number(d?.alumniProfile?.role))}
                            </h1>
                          </div>

                          <div className=" px-5">
                            <label
                              className="text-small text-default-500"
                              htmlFor="pYear"
                            >
                              Participation Year
                            </label>
                            <h1>{d?.participationYear}</h1>
                          </div>

                          <div className="w-full flex">
                            <Button
                              className="w-full text-sm rounded-t-none border-t-1 border-t-orange-500 p-5 font-normal  text-orange-500 bg-transparent hover:bg-orange-500  hover:text-black"
                              // color="primary"
                              // variant="light"
                              onClick={() => {
                                toDetail(d);
                              }}
                            >
                              View Alumni <GoArrowRight size={20} />
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
        </div>
      </section>
    </DefaultLayout>
  );
}
