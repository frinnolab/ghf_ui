import DefaultLayout from "@/layouts/default";
import {
  Publication,
  PublishTypeEnum,
} from "../dashboard/publications/dash-publications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { GoArrowUpRight, GoChecklist, GoNote } from "react-icons/go";

export default function Publications() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [pubs, setPubs] = useState<Publication[] | null>(null);

  const toDetail = (b: Publication) => {
    navigate(`/publications/${b?.publishId}`, {
      state: `${b?.publishId}`,
    });
  };

  const setTypeName = (pubType: PublishTypeEnum) => {
    switch (pubType) {
      case PublishTypeEnum.Report:
        return "Report";
      default:
        return "Newsletter";
    }
  };

  const setTypeIcon = (pubType: PublishTypeEnum) => {
    switch (pubType) {
      case PublishTypeEnum.Report:
        return <GoChecklist />;
      default:
        return <GoNote />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (pubs === null) {
      axios
        .get(`${api}/publications`)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Publication[] = Array.from(res?.data).flatMap(
            (d: any) => {
              console.log(d);

              const resData: Publication = {
                publishId: `${d?.publishId}`,
                title: d?.title,
                publishType: d?.publishType,
              };
              return [resData];
            }
          );

          setPubs(() => {
            return [...data];
          });
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [pubs]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>Publications</h1>

        {/* Content */}
        <div className="w-full flex flex-col px-10 gap-5 ">
          <h1 className=" text-2xl  font-semibold ">Newsletters & Reports</h1>
        </div>
        <div className="w-full flex justify-between px-10">
          {/* List */}
          <div className="w-[80%] flex flex-col gap-5">
            {pubs === null || pubs?.length === 0 ? (
              <>
                <h1 className=" text-2xl text-center ">
                  No Publications at the momment!. Please check back soon
                </h1>
              </>
            ) : (
              <div className="w-full flex flex-wrap gap-10 ">
                {pubs?.flatMap((mp) => (
                  <div
                    key={mp?.publishId}
                    className={`w-[30%] cursor-default flex flex-col rounded-2xl bg-default-200`}
                  >
                    <div className={`p-3 flex flex-col gap-3`}>
                      <h1 className={`text-2xl`}>{mp?.title}</h1>

                      <div className="flex justify-between">
                        <div className="flex items-center gap-3 bg-default-300 p-2 rounded-xl">
                          <span className="text-xl">
                            {setTypeIcon(Number(mp?.publishType))}
                          </span>

                          <p className=" text-small ">
                            {setTypeName(Number(mp?.publishType))}
                          </p>
                        </div>

                        <div></div>
                      </div>

                      <div className="p-1">
                        <Button
                          variant="light"
                          color="primary"
                          className="flex items-center"
                          onClick={() => {
                            toDetail(mp);
                          }}
                        >
                          View {setTypeName(Number(mp?.publishType))}{" "}
                          <GoArrowUpRight size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* List End */}

          {/* Side Bar */}
          <div className="w-[20%] text-center p-3 rounded-xl bg-default-300">
            <h1 className=" text-2xl text-center ">Summary</h1>

            <div className="flex flex-col gap-3 text-start">
              <h1 className=" text-xl ">
                Newsletter(s)-
                {
                  pubs?.filter(
                    (p) => p?.publishType === PublishTypeEnum.Newsletter
                  ).length
                }
              </h1>
              <h1 className=" text-xl ">
                Report(s)-
                {
                  pubs?.filter((p) => p?.publishType === PublishTypeEnum.Report)
                    .length
                }
              </h1>
            </div>
          </div>
          {/* Side Bar End */}
        </div>

        {/* Content End */}
      </section>
    </DefaultLayout>
  );
}
