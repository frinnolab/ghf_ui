import { Button } from "@nextui-org/button";
import {
  Divider,
  Image,
  Input,
  Skeleton,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { Blog } from "./dash-blogs";
import axios, { AxiosError, AxiosResponse } from "axios";
import useAuthedProfile from "@/hooks/use-auth";

export default function DashBlogCreate() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  //From Inputs
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
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
          
          console.log(res.data);
          const data: Blog = {
            blogId: `${res.data["blogId"]}`,
            title: `${res.data["title"]}`,
            description: `${res.data["description"]}`,
            thumbnailUrl: `${res.data["thumbnailUrl"]}`,
            authorId: `${res.data["authorId"]}`,
          };

          setBlog(data);
        });
    }
  }, []);

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {

    setSelectedImage(null);
  };

  const handleSave = () => {
    console.log("Save");

    const data = new FormData();

    if (blog === null) {
      //Save
      data.append("_method", `POST`);
      data.append("authorId", `${authed?.profileId}`);
      data.append("title", `${titleRef?.current?.value}`);
      data.append("description", `${descRef?.current?.value}`);

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

  const handleUpdate = () => {
    const data = new FormData();

    if (blog) {
      //Save
      data.append("_method", `PUT`);
      data.append("authorId", `${blog?.authorId ?? authed?.profileId}`);
      data.append("title", `${titleRef?.current?.value ?? blog?.title}`);
      data.append(
        "description",
        `${descRef?.current?.value ?? blog?.description}`
      );

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      data.forEach((d) => {
        console.log(d);
      });

      axios
        .post(`${api}/blogs/${authed?.profileId}/${blog?.blogId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          nav("/dashboard/blogs");
          //setSelectedImage(null);
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

      <div className="w-full flex flex-col p-5 gap-5">
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
        <div className="w-full rounded-2xl bg-default-50 shadow flex p-5 justify-between">
          {/* Form */}
          <div className="w-[60%] flex flex-col gap-5">
            <div className="w-full space-y-3">
              <label htmlFor="Title">Title</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={titleRef}
                placeholder={`${blog?.title ?? "Enter Title"}`}
              />
            </div>

            {/* Editor */}
            <div className="w-full space-y-3">
              <label htmlFor="description">Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                ref={descRef}
                placeholder={`${blog?.description ?? "Enter Description"}`}
              />
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <Button
                color="primary"
                disabled={!isEdit ? true : false}
                onClick={() => {
                  if (blog == null) {
                    handleSave();
                  } else {
                    handleUpdate();
                  }
                }}
              >
                {blogId === null ? "Save" : "Update"}
              </Button>
            </div>
          </div>
          {/* Form End */}
          {/* Thumbnail */}
          <div className="w-[30%] relative rounded-2xl p-5 flex flex-col justify-end">
            {selectedImage ? (
              <div className="w-full flex items-center justify-end">
                <Image
                  className={`w-[50%] self-end`}
                  src={URL.createObjectURL(selectedImage)}
                />
              </div>
            ) : (
              <div>
                {blog?.thumbnailUrl ? (
                  <div>
                    <Image className={`w-[50%]`} src={blog?.thumbnailUrl ?? ""} />
                  </div>
                ) : (
                  <Skeleton className="rounded-lg w-full h-[80%]">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                  </Skeleton>
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
