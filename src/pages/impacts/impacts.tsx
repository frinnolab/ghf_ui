import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Impact } from "../dashboard/impacts/dash-impacts-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { FaUniversity, FaMapMarkedAlt } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { Button } from "@nextui-org/button";
import { siteConfig } from "@/config/site";
import { Image } from "@nextui-org/react";

const ImpactList = () => {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [impacts, setImpacts] = useState<Impact[] | null>(null);

  const toDetail = (b: Impact) => {
    navigate(`/impacts/${b?.impactId}`, {
      state: `${b?.impactId}`,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (impacts === null) {
      axios
        .get(`${api}/impacts`)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const resData: Impact = {
              impactId: `${d?.impactId}`,
              assetUrl: d?.assetUrl ?? null,
              title: d?.title,
              schoolName: d?.schoolName,
              schoolRegion: d?.schoolRegion,
              studentsTotal: Number(d?.studentsTotal),
            };
            return [resData];
          });

          setImpacts(() => {
            return [...data];
          });
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [impacts]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>Impacts</h1>
        {/* Impacts Content */}
        <div className="w-full flex flex-col px-20 gap-5 ">
          <h1 className=" text-2xl  font-semibold ">Community Impacts</h1>

          <div className="w-full flex flex-col gap-5">
            {impacts === null || impacts?.length === 0 ? (
              <>
                <h1 className=" text-2xl text-center ">
                  No Impacts at the momment!. Please check back soon
                </h1>
              </>
            ) : (
              <div className="w-full flex flex-wrap gap-10">
                {impacts?.flatMap((mp) => (
                  <div
                    key={mp?.impactId}
                    className={`w-[30%] cursor-default flex flex-col rounded-2xl bg-default-100`}
                  >
                    <Image
                      src={`${mp?.assetUrl ?? siteConfig?.staticAssets?.staticLogo}`}
                    />
                    <div className={`p-3 flex flex-col gap-1`}>
                      <h1 className={`text-2xl`}>{mp?.title}</h1>
                      
                      <span className={`flex items-center gap-3`}>
                        <FaUniversity className="text-blue-500" />
                        <p className={`text-md`}>{mp?.schoolName}</p>
                      </span>
                      <span className={`flex items-center gap-3`}>
                        <FaMapMarkedAlt className="text-green-500" />
                        <p className={`text-md`}>{mp?.schoolRegion}</p>
                      </span>

                      <span className={`flex items-center gap-3`}>
                        <FaPeopleGroup className="text-orange-500" />
                        <p className={`text-md`}>{mp?.studentsTotal}</p>
                      </span>

                      <div className="p-1">
                        <Button
                          variant="light"
                          color="primary"
                          className="flex items-center border border-primary-400 hover:border-transparent"
                          onClick={() => {
                            toDetail(mp);
                          }}
                        >
                          View Impact <GoArrowUpRight size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Impacts Content End */}
      </section>
    </DefaultLayout>
  );
};

export default ImpactList;
