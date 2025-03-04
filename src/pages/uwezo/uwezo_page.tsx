import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Image, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

import { Project } from "../dashboard/projects/dash-projects";

import DefaultLayout from "@/layouts/default";
import { siteConfig } from "@/config/site";
// import * as motion from "motion/react-client";

export default function UwezoPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const navigate = useNavigate();

  const toDetail = (p: Project) => {
    navigate(`/whatwedo/${p?.projectId}`, {
      state: `${p?.projectId}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projects === null) {
      setIsloading(true);
      axios
        .get(`${api}/projects`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          // setIsloading(false);

          const dataList: Project[] = Array.from(res.data).flatMap((p: any) => {
            const data: Project = {
              projectId: `${p?.projectId}`,
              title: `${p?.title}`,
              description: `${p?.description}`,
              status: Number(`${p?.status}`),
              regionsReached: Number(`${p?.regionsReached}`),
              districtsReached: Number(`${p?.districtsReached}`),
              schoolsReached: Number(`${p?.schoolsReached}`),
              studentsReached: Number(`${p?.studentsReached}`),
              thumbnailUrl: `${p?.thumbnailUrl ?? ""}`,
              publisherId: `${p?.publisherId ?? ""}`,
            };

            return [data];
          });

          setProjects(dataList);

          setTimeout(() => {
            setIsloading(false);
          }, 1000);
        })
        .catch((err: AxiosError) => {
          console.error(err.response);
        });
    }
  }, [projects]);

  return (
    <DefaultLayout>
      <section className="w-full flex flex-col items-center justify-center py-2 md:py-3">
        <div className="h-[10dvh] md:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="hidden text-primary md:flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">
                  UWEZO PROGRAM
                </h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[8%] md:top-[-3%] filter saturate-[80%]">
            <Image
              alt="Header img"
              radius="none"
              src="/assets/images/static/6J9A9337_2.JPG"
            />
          </div>
        </div>

        <div className="w-full flex flex-col p-5 md:px-20  gap-5 bg-default-200 z-10">
          <h1 className="text-2xl md:text-3xl  font-semibold">
            UWEZO PROGRAM COMPONENTS
          </h1>

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
            <div className="w-full flex flex-col justify-center gap-5">
              {projects?.length === 0 ? (
                <>
                  {/* <h1 className=" text-2xl ">No Projects at the momment</h1> */}
                </>
              ) : (
                <div className="w-full flex flex-col justify-center gap-10 md:gap-14">
                  {projects?.flatMap((p: Project, i) => (
                    <div
                      key={i}
                      className="md:w-full  flex flex-col bg-default-100"
                    >
                      <Image
                        className={`w-[500px] md:w-screen md:h-[60dvh] object-cover`}
                        radius="none"
                        src={
                          p?.thumbnailUrl !== "" || null
                            ? p?.thumbnailUrl
                            : siteConfig?.staticAssets?.staticLogo
                        }
                      />

                      {/* Content */}
                      <div className="p-5 w-full flex flex-col gap-5">
                        <h1 className=" text-2xl font-semibold ">
                          {p?.title?.toLocaleUpperCase()}
                        </h1>
                        {/* <p className="text-xl">{p?.description}</p> */}
                        <div className={` `}>
                          <Button
                            className="flex items-center hover:border-transparent"
                            color="primary"
                            variant="light"
                            onClick={() => {
                              toDetail(p);
                            }}
                          >
                            Read more <GoArrowRight size={20} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>{/* Pagination */}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
