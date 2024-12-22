import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Project } from "../dashboard/projects/dash-projects";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { siteConfig } from "@/config/site";

export default function UwezoPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [projects, setProjects] = useState<Project[] | null>(null);
  const navigate = useNavigate();

  const toDetail = (p: Project) => {
    navigate(`/whatwedo/${p?.projectId}`, {
      state: `${p?.projectId}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (projects === null) {
      axios
        .get(`${api}/projects`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
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

            console.log(data);

            return [data];
          });

          setProjects(dataList);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [projects]);

  return (
    <DefaultLayout>
      <section className="w-full flex flex-col items-center justify-center py-2 md:py-3">
        <div className="sm:h-screen w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-10">
            <div className="w-full flex justify-between">
              <div></div>

              <div className="text-primary flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">
                  UWEZO PROJECTS
                </h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[8.5%] filter saturate-[50%]">
            <Image
              radius="none"
              alt="Header img"
              src="/assets/images/static/6J9A9337_2.JPG"
            />
          </div>
        </div>

        <div className="w-full flex flex-col px-20  gap-5 relative pt-[50%] md:pt-[0%]">
          <h1 className="text-2xl md:text-3xl  font-semibold">OUR PROJECTS</h1>

          <div className="w-full flex flex-col justify-center gap-5">
            {projects?.length === 0 ? (
              <>
                <h1 className=" text-2xl ">No Projects at the momment</h1>
              </>
            ) : (
              <div className="w-full flex flex-col justify-center gap-10 md:gap-14">
                {projects?.flatMap((p: Project, i) => (
                  <div
                    key={i}
                    className="md:w-full  rounded-3xl flex flex-col shadow-md bg-default-200"
                  >
                    <Image
                      className={` md:w-screen md:h-[60dvh] object-cover`}
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
                          variant="light"
                          color="primary"
                          className="flex items-center border border-primary-400 hover:border-transparent"
                          onClick={() => {
                            toDetail(p);
                          }}
                        >
                          View <GoArrowUpRight size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div>{/* Pagination */}</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
