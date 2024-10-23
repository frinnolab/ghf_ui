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
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

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
      case PublishTypeEnum["Student Manual"]:
        return "Manual";
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
      <section className="flex flex-col items-center justify-center gap-4 md:py-5">
        <h1 className={title()}>Publications</h1>

        {/* Content */}
        <div className="w-full flex flex-col px-10 gap-5 ">
          <h1 className=" text-2xl  font-semibold ">Newsletters & Reports</h1>
        </div>

        {/* Tabs  */}

        <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-5 md:gap-0 px-10">
          {/* List */}
          <div className="w-full flex flex-col gap-5">
            {pubs === null || pubs?.length === 0 ? (
              <>
                <h1 className=" text-2xl text-center ">
                  No Publications at the momment!. Please check back soon
                </h1>
              </>
            ) : (
              <div className="flex w-full flex-col">
                <Tabs aria-label="Options">
                  <Tab key="newsletters" title="Newsletters">
                    <Card className={`w-full border-transparent`}>
                      {pubs?.filter(
                        (p) => p?.publishType === PublishTypeEnum.Newsletter
                      ).length === 0 ? (
                        <>
                          <h1>No Newsletters at the momment.</h1>
                        </>
                      ) : (
                        <CardBody className="w-full flex flex-row flex-wrap gap-5 p-5">
                          {pubs
                            ?.filter(
                              (p) =>
                                p?.publishType === PublishTypeEnum.Newsletter
                            )
                            .flatMap((mp) => (
                              <div
                                key={mp?.publishId}
                                className={`p-3 w-[30%] flex flex-col gap-3 border rounded-xl`}
                              >
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

                                <div className="w-full p-1  justify-between">
                                  <div></div>
                                  <Button
                                    variant="light"
                                    color="primary"
                                    className=" flex items-center border border-primary-400 hover:border-transparent"
                                    onClick={() => {
                                      toDetail(mp);
                                    }}
                                  >
                                    {" "}
                                    View <GoArrowUpRight size={20} />{" "}
                                  </Button>{" "}
                                </div>
                              </div>
                            ))}
                        </CardBody>
                      )}
                    </Card>
                  </Tab>

                  <Tab key="reports" title="Reports">
                    <Card className={`w-full border-transparent`}>
                      {pubs?.filter(
                        (p) => p?.publishType === PublishTypeEnum.Report
                      ).length === 0 ? (
                        <>
                          <h1>No Reports at the momment.</h1>
                        </>
                      ) : (
                        <CardBody className="w-full flex flex-row flex-wrap gap-5 p-5">
                          {pubs
                            ?.filter(
                              (p) =>
                                p?.publishType === PublishTypeEnum.Report
                            )
                            .flatMap((mp) => (
                              <div
                                key={mp?.publishId}
                                className={`p-3 w-[30%] flex flex-col gap-3 border rounded-xl`}
                              >
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

                                <div className="w-full p-1  justify-between">
                                  <div></div>
                                  <Button
                                    variant="light"
                                    color="primary"
                                    className=" flex items-center border border-primary-400 hover:border-transparent"
                                    onClick={() => {
                                      toDetail(mp);
                                    }}
                                  >
                                    {" "}
                                    View <GoArrowUpRight size={20} />{" "}
                                  </Button>{" "}
                                </div>
                              </div>
                            ))}
                        </CardBody>
                      )}
                    </Card>{" "}
                  </Tab>

                  <Tab key="manual" title="Student manuals">
                    <Card className={`w-full border-transparent`}>
                      {pubs?.filter(
                        (p) =>
                          p?.publishType === PublishTypeEnum["Student Manual"]
                      ).length === 0 ? (
                        <>
                          <h1>No Manuals at the momment.</h1>
                        </>
                      ) : (
                        <CardBody className="w-full flex flex-row flex-wrap gap-5 p-5">
                          {pubs
                            ?.filter(
                              (p) =>
                                p?.publishType === PublishTypeEnum["Student Manual"]
                            )
                            .flatMap((mp) => (
                              <div
                                key={mp?.publishId}
                                className={`p-3 w-[30%] flex flex-col gap-3 border rounded-xl`}
                              >
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

                                <div className="w-full p-1  justify-between">
                                  <div></div>
                                  <Button
                                    variant="light"
                                    color="primary"
                                    className=" flex items-center border border-primary-400 hover:border-transparent"
                                    onClick={() => {
                                      toDetail(mp);
                                    }}
                                  >
                                    {" "}
                                    View <GoArrowUpRight size={20} />{" "}
                                  </Button>{" "}
                                </div>
                              </div>
                            ))}
                        </CardBody>                      )}
                    </Card>
                  </Tab>
                </Tabs>

                {/* Tabs End */}
              </div>
            )}
          </div>
          {/* List End */}
        </div>

        {/* Content End */}
      </section>
    </DefaultLayout>
  );
}
