import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowUpRight, GoChecklist, GoNote } from "react-icons/go";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Spinner,
  Input,
} from "@nextui-org/react";

import {
  Publication,
  PublicationSubscriber,
  PublishTypeEnum,
} from "../dashboard/publications/dash-publications";

import DefaultLayout from "@/layouts/default";
// import { title } from "@/components/primitives";

export default function Publications() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [pubs, setPubs] = useState<Publication[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const subRef = useRef<HTMLInputElement>(null);

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

  const handleSubscription = () => {
    const data: PublicationSubscriber = {
      email: `${subRef?.current?.value ?? ""}`,
      isSubscribed: true,
    };

    axios
      .post(`${api}/publications/subscriptions`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        //window.location.reload();

        alert(`Subscription success!.`);
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (pubs === null) {
      setIsLoading(true);
      axios
        .get(`${api}/publications`)
        .then((res: AxiosResponse) => {
          const data: Publication[] = Array.from(res?.data).flatMap(
            (d: any) => {
              // console.log(d);

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

          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.error(err.response);
        });
    }
  }, [pubs]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-5">
        <div className="sm:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="text-primary flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">
                  Publications
                </h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute filter saturate-[80%]">
            <Image
              alt="Header img"
              className="z-0"
              radius="none"
              src="/assets/images/static/PUBLICATION_BG.jpg"
              width={3000}
            />
          </div>
        </div>
        {/* <h1 className={title()}>Publications</h1> */}

        <div className="w-full bg-default-200 z-10 p-5">
          {/* Content */}
          <div className="w-full flex flex-col px-10 gap-5 ">
            <h1 className=" text-2xl  font-semibold ">Newsletters & Reports</h1>
          </div>

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
            <div className="w-full flex flex-col-reverse md:flex-row justify-between gap-5 md:gap-0 p-10">
              {/* List */}
              <div className="w-full flex flex-col gap-5">
                {pubs === null || pubs?.length === 0 ? (
                  <>
                    <h1 className=" text-2xl text-center ">
                      {/* No Publications at the momment!. Please check back soon */}
                    </h1>
                  </>
                ) : (
                  <div className="flex w-full flex-col">
                    <Tabs
                      fullWidth
                      aria-label="Options"
                      color="primary"
                      radius="sm"
                      size="lg"
                    >
                      <Tab key="newsletters" title="Newsletters">
                        <Card
                          className={`w-full border-transparent shadow-none bg-transparent`}
                        >
                          {pubs?.filter(
                            (p) =>
                              p?.publishType === PublishTypeEnum.Newsletter,
                          ).length === 0 ? (
                            <>{/* <h1>No Newsletters at the momment.</h1> */}</>
                          ) : (
                            <CardBody className="w-full flex flex-col md:flex-row md:flex-wrap  items-center gap-5 p-5 bg-transparent">
                              {pubs
                                ?.filter(
                                  (p) =>
                                    p?.publishType ===
                                    PublishTypeEnum.Newsletter
                                )
                                .flatMap((mp) => (
                                  <div
                                    key={mp?.publishId}
                                    className={`p-3 md:w-[32%] w-full flex flex-col gap-3 border rounded-xl bg-default-50`}
                                  >
                                    <h1 className={`text-2xl truncate`}>
                                      {mp?.title}
                                    </h1>

                                    <div className="flex justify-between">
                                      <div className="flex items-center gap-3 bg-default-300 p-2 rounded-xl">
                                        <span className="text-xl">
                                          {setTypeIcon(Number(mp?.publishType))}
                                        </span>

                                        <p className=" text-small ">
                                          {setTypeName(Number(mp?.publishType))}
                                        </p>
                                      </div>

                                      <div />
                                    </div>

                                    <div className="w-full p-1  justify-between">
                                      <div />
                                      <Button
                                        className=" flex items-center border border-primary-400 hover:border-transparent"
                                        color="primary"
                                        variant="light"
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
                        <Card
                          className={`w-full border-transparent shadow-none bg-transparent`}
                        >
                          {pubs?.filter(
                            (p) => p?.publishType === PublishTypeEnum.Report
                          ).length === 0 ? (
                            <>
                              <h1>No Reports at the momment.</h1>
                            </>
                          ) : (
                            <CardBody className="w-full flex md:flex-row md:flex-wrap gap-5 p-5 bg-transparent">
                              {pubs
                                ?.filter(
                                  (p) =>
                                    p?.publishType === PublishTypeEnum.Report
                                )
                                .flatMap((mp) => (
                                  <div
                                    key={mp?.publishId}
                                    className={`p-3 md:w-[32%] w-full flex flex-col gap-3 border rounded-xl bg-default-50`}
                                  >
                                    <h1 className={`text-2xl truncate`}>
                                      {mp?.title}
                                    </h1>

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
                        <Card
                          className={`w-full border-transparent shadow-none bg-transparent`}
                        >
                          {pubs?.filter(
                            (p) =>
                              p?.publishType ===
                              PublishTypeEnum["Student Manual"]
                          ).length === 0 ? (
                            <>
                              <h1>No Manuals at the momment.</h1>
                            </>
                          ) : (
                            <CardBody className="w-full flex flex-col md:flex-row md:flex-wrap gap-5 p-5 bg-transparent">
                              {pubs
                                ?.filter(
                                  (p) =>
                                    p?.publishType ===
                                    PublishTypeEnum["Student Manual"]
                                )
                                .flatMap((mp) => (
                                  <div
                                    key={mp?.publishId}
                                    className={`p-3 md:w-[32%] w-full flex flex-col gap-3 border rounded-xl bg-default-50`}
                                  >
                                    <h1 className={`text-2xl truncate`}>
                                      {mp?.title}
                                    </h1>

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
                    </Tabs>

                    {/* Tabs End */}
                  </div>
                )}
              </div>
              {/* List End */}
            </div>
          )}
          {/* Subscription */}
          <div className="w-full flex items-center justify-between py-5">
            <div className="w-full" />
            <div className="w-full flex items-center gap-5">
              <Input
                ref={subRef}
                placeholder="Enter email to subscribe to our newsletters"
                type="email"
              />
              <Button
                className="hover:bg-primary"
                variant="solid"
                onClick={handleSubscription}
              >
                subscribe
              </Button>
            </div>
          </div>
          {/* Subscription End */}
          {/* Content End */}
        </div>
      </section>
    </DefaultLayout>
  );
}
