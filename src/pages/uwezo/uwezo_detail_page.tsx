import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Project } from "../dashboard/projects/dash-projects";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowLeft } from "react-icons/go";
import { Divider, Image } from "@nextui-org/react";
import { FaMapMarkedAlt, FaUniversity } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup } from "react-icons/fa6";
import { siteConfig } from "@/config/site";

export default function UwezoDetailPage() {
  const route = useLocation();
  const api = `${import.meta.env.VITE_API_URL}`;
  const [projectId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }
    return null;
  });

  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
    if (project === null) {
      axios
        .get(`${api}/projects/${projectId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);

          const data: Project = {
            projectId: `${res.data["projectId"]}`,
            title: `${res.data["title"]}`,
            description: `${res.data["description"]}`,
            regionsReached: Number(res.data["regionsReached"] ?? 0),
            districtsReached: Number(res.data["districtsReached"] ?? 0),
            schoolsReached: Number(res.data["schoolsReached"] ?? 0),
            studentsReached: Number(res.data["studentsReached"] ?? 0),
            dateStart: `${res.data["dateStart"]}`,
            dateEnd: `${res.data["dateEnd"]}`,
            publisherId: `${res.data["publisherId"]}`,
            status: Number(`${res?.data["status"]}`),
            thumbnailUrl: `${res.data["thumbnailUrl"] ?? ""}`,
          };

          setProject(data);

          console.log(data);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [project]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/uwezo");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>

      <Divider />
      <div className="w-full flex flex-col">
        <div className=" w-full flex gap-10 justify-between p-10">
          
          <div className=" w-full space-y-3 ">
            <h1 className=" text-3xl font-semibold ">
              {project?.title?.toUpperCase() ?? ""}
            </h1>

            {/* Impact */}
            <div className=" space-y-3 w-full">
              <h1 className=" text-2xl ">REACH</h1>

              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1>Regions Reached:</h1>

                <span className="flex items-center gap-5 text-4xl text-green-500">
                  <FaMapMarkedAlt />
                  {project?.regionsReached ?? 0}
                </span>
              </div>

              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1>Districts Reached:</h1>

                <span className="flex items-center gap-5 text-4xl text-red-500">
                  <FaMapPin />
                  {project?.districtsReached ?? 0}
                </span>
              </div>

              <div className=" text-xl p-5 bg-default-200 rounded-2xl">
                <h1>Schools Reached:</h1>

                <span className="flex items-center gap-5 text-4xl text-blue-500">
                  <FaUniversity />
                  {project?.schoolsReached ?? 0}
                </span>
              </div>

              <div className=" text-xl p-5 bg-default-200 rounded-2xl ">
                <h1>Students Reached:</h1>

                <span className="flex items-center gap-5 text-4xl text-orange-500">
                  <FaPeopleGroup />
                  {project?.studentsReached ?? 0}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Image
              className={` w-[50vw] object-cover`}
              src={
                project?.thumbnailUrl !== "" || null
                  ? project?.thumbnailUrl
                  : siteConfig?.staticAssets?.staticLogo
              }
            />
          </div>
        </div>

        {/* Contents */}

        <div className="w-full flex flex-col gap-5 p-10">
          {/* Description */}
          <div className=" space-y-3">
            <h1 className=" text-2xl ">Description</h1>
            <Divider />
            <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {project?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
