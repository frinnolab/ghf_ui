import { Button } from "@nextui-org/button";
import {
  Divider,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tooltip,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Switch,
} from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { GoEye, GoPencil, GoPlus, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
export default function DashPublications() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const actionTypes = ["detail", "edit", "delete"];
  const columns = ["Title", "Type", "Actions"];
  const subcolumns = ["Email", "Is Subscribed", "Actions"];
  const [publications, setPublication] = useState<Publication[]>([]);
  const [publicationSubs, setPublicationSubs] = useState<
    PublicationSubscriber[]
  >([]);

  const [subsriber, setSubsriber] = useState<PublicationSubscriber | null>(
    null
  );

  const [isSubsriberSubbed, setIsSubsriberSubbed] = useState<boolean>(false);
  const [hasPubs, setHasPub] = useState<boolean>(false);
  const [hasSubs, setHasSubs] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const authed = useAuthedProfile();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const subRef = useRef<HTMLInputElement>(null);

  const handleSelectedRow = (p: Publication) => {
    nav(`/dashboard/publications/${p?.publishId}`, {
      state: p?.publishId,
    });
  };

  const handleAction = (p: Publication, action: string) => {
    switch (action) {
      case actionTypes[0]:
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        handleSelectedRow(p);
        break;
      case actionTypes[2]:
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (i: Publication) => {
    axios
      .delete(`${api}/publications/${i?.publishId}`, {
        headers: {
          Authorization: `Bearer ${authed?.token}`,
        },
        method: "DELETE",
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.warn(err?.response);
      });
  };

  const setTypeName = (pubType: PublishTypeEnum) => {
    switch (pubType) {
      case PublishTypeEnum.Report:
        return "Report";
      case PublishTypeEnum.Newsletter:
        return "Newsletter";
      case PublishTypeEnum["Student Manual"]:
        return "Student Manual";
    }
  };

  // Subs Action
  const setSubName = (subType: number) => {
    if (subType === 1) {
      return "Subscribed";
    } else {
      return "Unsubscribed";
    }
  };

  const handleSubscriberSave = () => {
    setIsloading(true);
    if (subsriber === null) {
      //Save
      const data: PublicationSubscriber = {
        email: `${subRef?.current?.value ?? ""}`,
        isSubscribed: isSubsriberSubbed,
      };

      axios
        .post(`${api}/publications/subscriptions`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then(() => {
          setIsloading(false);
          onClose();
          window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    } else {
      //Update
      const data: PublicationSubscriber = {
        email: `${subRef?.current?.value ?? subsriber?.email}`,
        isSubscribed: isSubsriberSubbed,
      };

      axios
        .put(
          `${api}/publications/subscriptions/${subsriber?.subscriberId}`,
          data,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${authed?.token}`,
            },
          }
        )
        .then(() => {
          setIsloading(false);
          onClose();
          window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };

  const handlesubscriberDelete = (pub: PublicationSubscriber) => {
    setIsloading(true);
    axios
      .delete(`${api}/publications/subscriptions/${pub?.subscriberId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then(() => {
        setIsloading(false);
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!hasSubs) {
      setIsloading(true);

      axios
        .get(`${api}/publications/subscriptions/index`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const data: PublicationSubscriber[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const resData: PublicationSubscriber = {
                subscriberId: `${d?.subscriberId}`,
                email: d?.email,
                isSubscribed: d?.isSubscribed,
              };

              return [resData];
            }
          );

          setPublicationSubs(data);
          setHasSubs(true);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.error(err);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, []);
  //Fetch Subscriptions End

  useEffect(() => {
    if (!hasPubs) {
      setIsloading(true);

      axios
        .get(`${api}/publications`)
        .then((res: AxiosResponse) => {
          const data: Publication[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const resData: Publication = {
                publishId: `${d?.publishId}`,
                title: d?.title,
                publishType: d?.publishType,
              };
              return [resData];
            }
          );

          setHasPub(true);
          setPublication(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [hasPubs]);

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
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
          <Tabs
            fullWidth
            aria-label="Options"
            color="primary"
            radius="sm"
            size="lg"
          >
            <Tab key="publications" title="Publications">
              <div className="w-full flex justify-between py-5">
                <h1 className=" text-2xl ">Manage Publications</h1>

                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => {
                    nav("/dashboard/publications/create", {
                      state: null,
                    });
                  }}
                >
                  Add{" "}
                  <span>
                    <GoPlus size={20} />
                  </span>
                </Button>
              </div>

              <Table fullWidth isStriped removeWrapper>
                <TableHeader>
                  {columns.map((column) => (
                    <TableColumn key={column}>{column}</TableColumn>
                  ))}
                </TableHeader>

                <TableBody
                  emptyContent="No publications at the moment"
                  items={publications ?? []}
                >
                  {publications.map((pub, i) => (
                    <TableRow className="w-full" key={i}>
                      <TableCell onClick={() => handleSelectedRow(pub)}>
                        {pub?.title}
                      </TableCell>

                      <TableCell onClick={() => handleSelectedRow(pub)}>
                        {setTypeName(Number(pub.publishType))}
                      </TableCell>

                      <TableCell>
                        <div className="relative flex items-center gap-2">
                          <Tooltip content="Detail">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <GoEye
                                onClick={() =>
                                  handleAction(pub, actionTypes[0])
                                }
                              />
                            </span>
                          </Tooltip>

                          <Tooltip color="danger" content="Delete">
                            <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                              <GoTrash
                                onClick={() =>
                                  handleAction(pub, actionTypes[2])
                                }
                              />
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tab>

            <Tab key="subscribers" title="Subscribers">
              <div className="w-full flex justify-between py-5">
                <h1 className=" text-2xl ">Manage Subscribers</h1>

                <Button color="primary" variant="solid" onPress={onOpen}>
                  Add{" "}
                  <span>
                    <GoPlus size={20} />
                  </span>
                </Button>
              </div>

              <Table fullWidth isStriped removeWrapper>
                <TableHeader>
                  {subcolumns.map((column) => (
                    <TableColumn key={column}>{column}</TableColumn>
                  ))}
                </TableHeader>

                <TableBody
                  emptyContent="No subscribers at the moment"
                  items={publicationSubs ?? []}
                >
                  {publicationSubs.map((pub, i) => (
                    <TableRow key={i} className="w-full">
                      <TableCell
                        key={pub?.email}
                        onClick={() => {
                          setSubsriber(pub);
                          setIsSubsriberSubbed(pub?.isSubscribed ?? false);

                          onOpen();
                        }}
                      >
                        {pub?.email}
                        {/* {pub?.isSubscribed} */}
                      </TableCell>

                      <TableCell
                        key={i}
                        onClick={() => {
                          setSubsriber(pub);
                          setIsSubsriberSubbed(pub?.isSubscribed ?? false);

                          onOpen();
                        }}
                      >
                        {setSubName(Number(pub.isSubscribed ? 1 : 0))}
                        {/* {pub?.isSubscribed} */}
                      </TableCell>

                      <TableCell>
                        <div className="relative flex items-center gap-2">
                          {/* <Tooltip content="Detail">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                              <GoEye
                                onClick={() =>
                                  handleAction(pub, actionTypes[0])
                                }
                              />
                            </span>
                          </Tooltip> */}

                          <Tooltip color="danger" content="Delete">
                            <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                              <GoTrash
                                onClick={() => handlesubscriberDelete(pub)}
                              />
                            </span>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Subscriber Pop-up */}
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  <ModalHeader>
                    Subscriber : {subsriber?.isSubscribed}
                    {/* {subsriber} */}
                  </ModalHeader>
                  <ModalBody>
                    <div className="w-full space-y-1">
                      <label className="text-default-500" htmlFor="subscriber">
                        Subscribers Email
                      </label>

                      <Input
                        ref={subRef}
                        defaultValue={`${subsriber?.email ?? ""}`}
                        placeholder={`${subsriber?.email ?? "Enter subscriber's email"}`}
                        type="email"
                      />
                    </div>

                    <div className="w-full space-y-1">
                      <p>{`${isSubsriberSubbed ? "Subscribbed" : "Unsubscribed"}`}</p>
                      <Switch
                        defaultSelected={isSubsriberSubbed}
                        endContent={<GoEye />}
                        size="lg"
                        startContent={<GoPencil />}
                        title={`${isSubsriberSubbed ? "Subscribed" : "Unsubscribed"}`}
                        onClick={() => {
                          if (!isSubsriberSubbed) {
                            setIsSubsriberSubbed(true);
                          } else {
                            setIsSubsriberSubbed(false);
                          }
                        }}
                      />
                    </div>

                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        onClick={handleSubscriberSave}
                      >
                        {subsriber === null ? "Save" : "Update"}
                      </Button>
                    </ModalFooter>
                  </ModalBody>
                </ModalContent>
              </Modal>
              {/* Subscriber Pop-up End */}
            </Tab>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}

export type Publication = {
  publishId?: string;
  title?: string;
  description?: string;
  assetUrl?: string;
  publishType?: PublishTypeEnum;
  publishDate?: string;
  authorId?: string;
  isSubscription?: boolean;
};
export type PublicationSubscriber = {
  subscriberId?: string;
  email?: string;
  isSubscribed?: boolean;
};

export type PublicationStatus = {
  key?: number;
  value?: string;
};

export type PublicationAsset = {
  publishId?: string;
  assetId?: string;
  assetUrl?: string;
  title?: string;
  assetType?: string;
};

export enum PublishTypeEnum {
  Report = 0,
  Newsletter = 1,
  "Student Manual" = 2,
}
