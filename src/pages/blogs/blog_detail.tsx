import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Blog } from "../dashboard/blog/dash-blogs";
import { Button } from "@nextui-org/button";
import { GoArrowLeft } from "react-icons/go";
import { Divider, Image } from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { siteConfig } from "@/config/site";

export default function BlogDetailPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [blogId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }
    return null;
  });
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (blog === null) {
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
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [blog]);

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/blog");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>
      <Divider />
      <div className="w-full flex flex-col">
        <div className={`p-5`}>
          <Image
            radius="none"
            className={`w-screen h-screen object-cover`}
            src={`${blog?.thumbnailUrl != "" || null ? blog?.thumbnailUrl : siteConfig?.staticAssets?.staticLogo}`}
          />
        </div>

        {/* Contents */}
        <Divider />
        <div className="w-full flex flex-col gap-5 p-10">
          <div className=" space-y-5 ">
            <h1 className="text-3xl">{blog?.title}</h1>
          </div>

          <div className=" space-y-5 ">
            <label htmlFor="description">Description</label>
            <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {blog?.description}
            </p>
          </div>
        </div>
        {/* <Divider /> */}

        {/* Contents End */}
      </div>
    </div>
  );
}
