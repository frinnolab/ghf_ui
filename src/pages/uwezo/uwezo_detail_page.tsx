import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowLeft } from "react-icons/go";
import { Divider, Image, Spinner } from "@nextui-org/react";
import ReactPlayer from "react-player/youtube";

import { Project, ProjectAsset } from "../dashboard/projects/dash-projects";

import { siteConfig } from "@/config/site";
// import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function UwezoDetailPage() {
  const route = useLocation();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const api = `${import.meta.env.VITE_API_URL}`;
  // const [selected, setSelected] = useState("photos");
  const [projectId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }

    return null;
  });

  //Assets
  const [projectAssets, setProjectAssets] = useState<ProjectAsset[] | null>(
    null
  );
  //Assets End

  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsloading(true);
    window.scrollTo(0, 0);
    if (project === null) {
      axios
        .get(`${api}/projects/${projectId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          // console.log(res.data);

          const data: Project = {
            projectId: `${res.data["projectId"]}`,
            title: `${res.data["title"] ?? ""}`,
            description: `${res.data["description"] ?? ""}`,
            regionsReached: Number(res.data["regionsReached"] ?? 0),
            districtsReached: Number(res.data["districtsReached"] ?? 0),
            schoolsReached: Number(res.data["schoolsReached"] ?? 0),
            studentsReached: Number(res.data["studentsReached"] ?? 0),
            dateStart: `${res.data["dateStart"] ?? ""}`,
            dateEnd: `${res.data["dateEnd"] ?? ""}`,
            publisherId: `${res.data["publisherId"] ?? ""}`,
            status: Number(`${res?.data["status"] ?? ""}`),
            thumbnailUrl: `${res.data["thumbnailUrl"] ?? ""}`,
          };

          setProject(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          // eslint-disable-next-line no-console
          console.log(err.response);
        });
    }
  }, [project]);

  //fetch assets
  useEffect(() => {
    if (project) {
      axios
        .get(`${api}/projects/assets/${projectId}`)
        .then((res: AxiosResponse) => {
          const datas: ProjectAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: ProjectAsset = {
                assetUrl: d?.assetUrl,
                videoUrl: d?.videoUrl,
                assetId: d?.assetId,
                projectId: d?.projectId,
              };

              return [data];
            }
          );

          setProjectAssets([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
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
            navigate("/whatwedo");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>

      <Divider />

      {isLoading ? (
        <>
          <Spinner
            className=" flex justify-center "
            color="primary"
            label="Loading..."
            size="lg"
          />
        </>
      ) : (
        <div className="w-full flex flex-col justify-center">
          {/* New Container */}
          <div className="w-full p-2">
            <Image
              className={`w-screen h-screen object-cover`}
              radius="none"
              src={
                project?.thumbnailUrl !== "" || null
                  ? project?.thumbnailUrl
                  : siteConfig?.staticAssets?.staticLogo
              }
              // width={400}
            />
          </div>
          {/* New Container End */}

          {/* Contents */}

          <div className="w-full flex flex-col gap-5 p-10">
            <h1 className=" text-3xl font-semibold ">
              {project?.title?.toUpperCase() ?? ""}
            </h1>

            {/* Description */}
            <div className=" space-y-3">
              {/* <h1 className=" text-2xl ">Description</h1> */}
              <Divider />
              {/* <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {project?.description}
            </p> */}

              <div
                dangerouslySetInnerHTML={{
                  __html: `${project?.description ?? ""}`,
                }}
              />
            </div>
          </div>

          <Divider />
          {/* Assets */}
          <div
            className={`w-full flex flex-col gap-5 overflow-y-scroll h-[80dvh] p-5 scrollbar-hide`}
          >
            {/* <h1 className="text-xl md:text-3xl">{project?.title} assets</h1> */}

            {projectAssets === null || projectAssets?.length === 0 ? (
              <></>
            ) : (
              <div
                className={`w-full flex flex-col md:flex-row justify-center gap-5`}
              >
                <div className="w-full flex flex-wrap">
                  {projectAssets?.flatMap((d: ProjectAsset) => (
                    <div
                      key={d?.assetId}
                      className={` p-2 flex items-center gap-1 P-2`}
                    >
                      <ReactPlayer
                        controls
                        height={1000}
                        url={d?.videoUrl}
                        width={1000}
                      />
                    </div>
                  ))}

                  {/* <Tabs
                  fullWidth
                  size="lg"
                  radius="md"
                  variant="light"
                  color="primary"
                  className="w-full"
                  aria-label="Options"
                  selectedKey={selected}
                  onSelectionChange={() => {
                    if (selected === "photos") {
                      setSelected("videos");
                    } else {
                      setSelected("photos");
                    }
                  }}
                >
                  <Tab
                    className="w-full"
                    key="photos"
                    title={
                      <div className="flex items-center space-x-2">
                        <FaCameraRetro />
                        <span>Photos</span>
                      </div>
                    }
                  >
                    <Card className="w-full shadow-none">
                      <CardBody className="w-full flex flex-wrap">
                        {projectAssets?.flatMap((d: ProjectAsset) => (
                          <div
                            key={d?.assetId}
                            className={`w-[20%] p-2 rounded-xl flex flex-col justify-between items-center gap-1 P-2`}
                          >
                            <Image src={d?.assetUrl} radius="none" />
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Tab>

                  <Tab
                    className="w-full"
                    key="videos"
                    title={
                      <div className="flex items-center space-x-2">
                        <FaVideo />
                        <span>Videos</span>
                      </div>
                    }
                  >
                    <Card className="w-full shadow-none">
                      <CardBody className="w-full flex flex-wrap">
                        {projectAssets?.flatMap((d: ProjectAsset) => (
                          <div
                            key={d?.assetId}
                            className={` p-2 shadow rounded-xl flex items-center gap-1 P-2`}
                          >
                            <ReactPlayer
                              width={300}
                              height={300}
                              url={d?.videoUrl}
                              controls
                            />
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs> */}
                </div>
              </div>
            )}
          </div>
          {/* Assets End */}
        </div>
      )}
    </div>
  );
}
