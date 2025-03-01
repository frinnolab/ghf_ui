import { Button } from "@nextui-org/button";
import { Divider, Image, Input, Spinner, Switch } from "@nextui-org/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  GoArrowLeft,
  GoEye,
  GoLock,
  GoPencil,
  GoTrash,
  GoUnlock,
} from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { Blog } from "./dash-blogs";
import axios, { AxiosError, AxiosResponse } from "axios";
import useAuthedProfile from "@/hooks/use-auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { siteConfig } from "@/config/site";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Qformats = [
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

export const Qmodules = {
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

export default function DashBlogCreate() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  //From Inputs
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [quillValue, setQuillValue] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isArchived, setIsArchived] = useState<boolean>(false);

  //From Inputs End
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [blogId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [blog, setBlog] = useState<Blog | null>(null);

  //Form States
  const { register, handleSubmit } = useForm<Blog>();

  const onSubmitBlog: SubmitHandler<Blog> = (data: Blog) => {
    if (blogId) {
      handleUpdate(data);
    } else {
      handleSave(data);
    }
  };

  const handleBack = () => nav("/dashboard/blogs");

  useEffect(() => {
    if (blogId) {
      setIsloading(true);
      axios
        .get(`${api}/blogs/${blogId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {

          const data: Blog = {
            blogId: res?.data["blogId"] ?? null,
            title: res?.data["title"] ?? null,
            description: res?.data["description"] ?? null,
            thumbnailUrl: res?.data["thumbnailUrl"] ?? null,
            authorId: res.data["authorId"] ?? null,
            isArchived: Boolean(res?.data["isArchived"]),
          };

          setIsArchived(Boolean(res?.data["isArchived"]));

          setBlog(data);
          setQuillValue(res?.data["description"]);

          setIsloading(false);
        });
    }
  }, [blogId]);

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  const handleSave = (d: Blog) => {
    setIsloading(true);
    const data = new FormData();

    if (blog === null) {
      //Save
      data.append("_method", `POST`);
      data.append("authorId", `${authed?.profileId}`);
      data.append("title", `${d?.title}`);
      data.append("description", `${quillValue}`);
      data.append("isArchived", `${isArchived ? 1 : 0}`);

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      axios
        .post(`${api}/blogs`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          nav("/dashboard/blogs");
        })
        .catch((err: AxiosError) => {
          console.error(err.response?.statusText);
        });
    }
  };

  const handleUpdate = (d: Blog) => {
    setIsloading(true);
    const data = new FormData();

    if (blog) {
      //Save
      data.append("_method", `PUT`);
      data.append("authorId", `${blog?.authorId ?? authed?.profileId}`);
      data.append("title", `${d?.title ?? blog?.title}`);
      data.append("description", `${quillValue ?? blog?.description}`);
      data.append("isArchived", `${isArchived ? 1 : 0}`);

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      axios
        .post(`${api}/blogs/${blog?.blogId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          if (res?.data) {
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          //setSelectedImage(null);
          console.log(err.response);
        });
    }
  };

  return (
    <div className="w-full">
      {/* Main Actions */}
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create Blog" : ` ${isEdit ? " Edit" : "View"} blog`}`}</h1>
      </div>
      <Divider />

      <div className="w-full flex flex-col p-10 gap-5 h-[50dvh]">
        <div className={` flex justify-end items-center gap-5 `}>
          <p>{`Mode: ${isEdit ? "Edit" : "View"}`}</p>

          <Switch
            // isDisabled={isEdit}
            // disabled={!isEdit}
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
          />
        </div>

        {/* Content */}
        <div className="w-full min-h-[70dvh] rounded-2xl bg-default-200 shadow gap-5 flex p-5 justify-between ">
          {isLoading ? (
            <div className="w-full flex justify-center">
              <Spinner
                className=" flex justify-center "
                color="primary"
                label="Loading..."
                size="lg"
              />
            </div>
          ) : (
            <>
              {/* Form */}
              <form
                className="w-full flex flex-col gap-5"
                onSubmit={handleSubmit(onSubmitBlog)}
              >
                <div className="w-full space-y-3">
                  <label htmlFor="Title">Title</label>
                  <Input
                    disabled={!isEdit ? true : false}
                    type="text"
                    {...register("title")}
                    placeholder={`${blog?.title ?? "Enter Title"}`}
                  />
                </div>

                <div>
                  <div
                    className={` self-end flex justify-between items-center gap-5`}
                  >
                    <p>{`${isArchived ? "Archived" : "Not Archived"}`}</p>

                    <Switch
                      defaultSelected={isArchived}
                      endContent={<GoUnlock />}
                      isDisabled={isEdit ? false : true}
                      size="lg"
                      startContent={<GoLock />}
                      title={`${isArchived ? "Archived" : "Not Archived"}`}
                      onClick={() => {
                        if (isArchived) {
                          setIsArchived(false);
                        } else {
                          setIsArchived(true);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Editor */}
                <div className="w-full space-y-3 overflow-hidden scrollbar-hide">
                  <label htmlFor="description">Description</label>

                  <div className={`w-full h-[30dvh]`}>
                    <ReactQuill
                      formats={Qformats}
                      modules={Qmodules}
                      placeholder={`${blogId ? blog?.description : "Enter description"}`}
                      style={{
                        height: "20dvh",
                        overflow: "scroll",
                        overflowX: "hidden",
                      }}
                      theme="snow"
                      value={quillValue}
                      onChange={setQuillValue}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-3">
                  <Button
                    color="primary"
                    disabled={!isEdit ? true : false}
                    type="submit"
                  >
                    {blogId === null ? "Save" : "Update"}
                  </Button>
                </div>
              </form>
              {/* Form End */}
              {/* Thumbnail */}

              <div className="w-full  relative rounded-2xl p-5 flex flex-col items-center gap-3 ">
                <h1>Thumbnail Image</h1>
                {selectedImage ? (
                  <div className="w-full h-[50dvh] flex items-center p-5 justify-center">
                    <Image
                      width={300}
                      src={URL.createObjectURL(selectedImage)}
                    />
                  </div>
                ) : (
                  <div>
                    {blog?.thumbnailUrl ? (
                      <div className="w-full flex items-center justify-center">
                        <Image
                          width={300}
                          src={
                            blog?.thumbnailUrl ??
                            siteConfig.staticAssets.staticLogo
                          }
                        />
                      </div>
                    ) : (
                      <Image src={siteConfig.staticAssets.staticLogo} />
                    )}
                  </div>
                )}

                <div className="p-3 flex items-center">
                  <input
                    ref={thumbRef}
                    accept="image/*"
                    disabled={isEdit ? false : true}
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
            </>
          )}
        </div>
        {/* Content End */}
      </div>
    </div>
  );
}
