import { Button } from "@nextui-org/button";
import { Divider, Image, Input, Switch, Textarea } from "@nextui-org/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { Blog } from "./dash-blogs";
import axios, { AxiosError, AxiosResponse } from "axios";
import useAuthedProfile from "@/hooks/use-auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { siteConfig } from "@/config/site";

export default function DashBlogCreate() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  //From Inputs
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
      axios
        .get(`${api}/blogs/${blogId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res?.data);
          const data: Blog = {
            blogId: res?.data["blogId"] ?? null,
            title: res?.data["title"] ?? null,
            description: res?.data["description"] ?? null,
            thumbnailUrl: res?.data["thumbnailUrl"] ?? null,
            authorId: res.data["authorId"] ?? null,
          };

          setBlog(data);
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
    const data = new FormData();

    if (blog === null) {
      //Save
      data.append("_method", `POST`);
      data.append("authorId", `${authed?.profileId}`);
      data.append("title", `${d?.title}`);
      data.append("description", `${d?.description}`);

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
          console.log(err.response?.statusText);
        });
    }
  };

  const handleUpdate = (d: Blog) => {
    const data = new FormData();

    if (blog) {
      //Save
      data.append("_method", `PUT`);
      data.append("authorId", `${blog?.authorId ?? authed?.profileId}`);
      data.append("title", `${d?.title ?? blog?.title}`);
      data.append("description", `${d?.description ?? blog?.description}`);

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      data.forEach((d) => {
        console.log(d);
      });

      axios
        .post(`${api}/blogs/${blog?.blogId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          window.location.reload();
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

      <div className="w-full flex flex-col p-10 gap-5">
        <div className={` flex justify-end items-center gap-5 `}>
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

        {/* Content */}
        <div className="w-full min-h-[70dvh] rounded-2xl bg-default-200 shadow gap-5 flex p-5 justify-between">
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

            {/* Editor */}
            <div className="w-full space-y-3">
              <label htmlFor="description">Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                {...register("description")}
                placeholder={`${blog?.description ?? "Enter Description"}`}
              />
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

          <div className="w-full min-h-[30dvh] relative rounded-2xl p-5 flex flex-col items-center ">
            {selectedImage ? (
              <div className="w-full flex items-center p-5 justify-center">
                <Image src={URL.createObjectURL(selectedImage)} />
              </div>
            ) : (
              <div>
                {blog?.thumbnailUrl ? (
                  <div className="w-full flex items-center justify-center">
                    <Image
                      src={
                        blog?.thumbnailUrl ?? siteConfig.staticAssets.staticLogo
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
                disabled={isEdit ? false : true}
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
        {/* Content End */}
      </div>
    </div>
  );
}
