import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { FaUniversity, FaMapMarkedAlt } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import { Button } from "@nextui-org/button";
import { Image, Spinner } from "@nextui-org/react";

import { Impact } from "../dashboard/impacts/dash-impacts-list";

import DefaultLayout from "@/layouts/default";
// import { title } from "@/components/primitives";
import { siteConfig } from "@/config/site";

const ImpactList = () => {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [impacts, setImpacts] = useState<Impact[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toDetail = (b: Impact) => {
    navigate(`/impacts/${b?.impactId}`, {
      state: `${b?.impactId}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (impacts === null) {
      setIsLoading(true);
      axios
        .get(`${api}/impacts`)
        .then((res: AxiosResponse) => {
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
            const resData: Impact = {
              impactId: `${d?.impactId}`,
              assetUrl: d?.assetUrl ?? null,
              title: d?.title,
              schoolName: d?.schoolName,
              schoolRegion: d?.schoolRegion,
              studentsTotal: Number(d?.studentsTotal),
              schoolsTotal: Number(d?.schoolsTotal),
            };

            return [resData];
          });

          setImpacts(() => {
            return [...data];
          });

          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        })
        .catch((err: AxiosError) => {
          console.error(err.response);

          setIsLoading(false);
        });
    }
  }, [impacts]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-5">
        <div className="h-[20dvh] md:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="text-black hover:text-orange-400 hidden md:flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">IMPACT</h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute filter saturate-[80%] top-[0%]">
            <Image
              alt="Header img"
              className="z-0"
              radius="none"
              src="/assets/images/static/Impact_BG.JPG"
              width={3000}
            />
          </div>
        </div>

        <div className="w-full absolute top-[8%] md:top-[-3%] filter saturate-[80%] hidden">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="hidden text-primary md:flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">IMPACT</h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[8%] md:top-[-3%] filter saturate-[80%]">
            <Image
              alt="Header img"
              className="z-0"
              radius="none"
              src="/assets/images/static/Impact_BG.JPG"
              width={3000}
            />
          </div>
        </div>

        <div className="w-full flex flex-col z-10  bg-default-200 p-y-5">
          {/* <h1 className={title()}>Impact</h1> */}
          {/* Impacts Content */}
          <div className="w-full flex flex-col p-10 md:px-20 md:py-10 gap-5 ">
            <h1 className=" text-3xl md:text-4xl text-black hover:text-orange-500 uppercase  font-semibold ">
              Community Impact
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
                {impacts === null || impacts?.length === 0 ? (
                  <>
                    <h1 className=" text-2xl text-center ">
                      {/* No Impacts at the momment!. Please check back soon */}
                    </h1>
                  </>
                ) : (
                  <div className="w-full flex flex-col md:flex-row md:flex-wrap justify-center md:justify-start gap-10">
                    {impacts?.flatMap((mp) => (
                      <div
                        key={mp?.impactId}
                        className={`w-full md:w-[30%] cursor-default flex flex-col rounded-2xl bg-default-100`}
                      >
                        <Image
                          // isZoomed
                          className=" rounded-t-2xl rounded-b-none "
                          radius="none"
                          src={`${mp?.assetUrl ?? siteConfig?.staticAssets?.staticLogo}`}
                        />
                        <div className={` flex flex-col gap-1`}>
                          <h1
                            className={` p-5 text-2xl md:text-3xl font-medium truncate`}
                          >
                            {mp?.title}
                          </h1>

                          <div className="px-5">
                            <span className={`flex items-center gap-3`}>
                              <FaUniversity className="text-blue-500" />
                              <p className={`text-md`}>
                                {mp?.schoolsTotal ?? 0}
                              </p>
                            </span>
                            <span className={`items-center gap-3 hidden`}>
                              <FaMapMarkedAlt className="text-green-500" />
                              <p className={`text-md`}>{mp?.schoolRegion}</p>
                            </span>

                            <span className={`flex items-center gap-3`}>
                              <FaPeopleGroup className="text-orange-500" />
                              <p className={`text-md`}>{mp?.studentsTotal}</p>
                            </span>
                          </div>

                          <div className="p-1">
                            <Button
                              className="text-sm font-normal  text-orange-500 bg-transparent hover:bg-orange-500  hover:text-black"
                              // color="primary"
                              // variant="light"
                              onClick={() => {
                                toDetail(mp);
                              }}
                            >
                              View Impact <GoArrowRight size={20} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Impacts Content End */}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ImpactList;
