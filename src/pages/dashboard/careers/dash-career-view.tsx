/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  Button,
  Divider,
  Input,
  ModalFooter,
  ModalContent,
  Modal,
  Select,
  SelectItem,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import {
  GoArrowLeft,
  GoDownload,
  GoEye,
  GoPencil,
  GoTrash,
} from "react-icons/go";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import fileDownload from "js-file-download";

import {
  Career,
  CareerApplication,
  CareerStatus,
  CareerType,
  CareerValidity,
} from "./dash-careers";

import useAuthedProfile from "@/hooks/use-auth";
import { AuthRole } from "@/types";
// import { Qformats, Qmodules } from "../blog/dash-blog-create";

export const Cformats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  // "link",
  // "image",
  // "video",
];

export const Cmodules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // ["image"],
    // ["video"],
    // ["link"],
    ["clean"],
  ],
};

function DashCareerView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isAppsLoading, setIsAppsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const actionTypes = ["detail", "edit", "delete"];
  const [quillValue, setQuillValue] = useState<string>("");

  const [careerId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [career, setCareer] = useState<Career | null>(null);
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<CareerApplication | null>(null);

  const [careerStatuses] = useState<{ key: CareerStatus; value: string }[]>(
    () => {
      return [
        {
          key: CareerStatus.Pending,
          value: "Pending",
        },
        {
          key: CareerStatus.Denied,
          value: "Denied",
        },
        {
          key: CareerStatus.Accepted,
          value: "Accepted",
        },
      ];
    }
  );

  const [selectedStatus, setSelectedStatus] = useState<{
    key: CareerStatus;
    value: string;
  }>();

  const changeCareerStatus = (
    e: ChangeEvent<HTMLSelectElement>,
    ca: CareerApplication
  ) => {
    setSelectedApplication(ca);
    const statusVal = careerStatuses.find(
      (p) => p?.key === Number(e.target.value)
    );

    setSelectedStatus(statusVal);

    setIsAppsLoading(true);

    onUpdateStatus(ca, statusVal);
  };

  // const [careerRoles] = useState<{ key: AuthRole; value: string }[]>(() => {
  //   return [
  //     {
  //       key: AuthRole.Employee,
  //       value: "Employee",
  //     },
  //     {
  //       key: AuthRole.Volunteer,
  //       value: "Volunteer",
  //     },
  //   ];
  // });

  // const [, setSelectedRole] = useState<{
  //   key: AuthRole;
  //   value: string;
  // }>();

  // const changeCareerRoles = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const statusVal = careerRoles.find(
  //     (p) => p?.key === Number(e.target.value)
  //   );

  //   setSelectedRole(statusVal);
  // };

  const [careerTypes] = useState<{ key: CareerType; value: string }[]>(() => {
    return [
      {
        key: CareerType.Employment,
        value: "Employment",
      },
      {
        key: CareerType.Volunteering,
        value: "Volunteering",
      },
      {
        key: CareerType.Internship,
        value: "Internship",
      },
    ];
  });

  const [selectedCareerType, setSelectedCareerType] = useState<{
    key: CareerType;
    value: string;
  }>();

  const changeCareerTypes = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = careerTypes.find(
      (p) => p?.key === Number(e.target.value)
    );

    setSelectedCareerType(statusVal);
  };

  const [careerValiditys] = useState<{ key: CareerValidity; value: string }[]>(
    () => {
      return [
        {
          key: CareerValidity.Closed,
          value: "Closed",
        },
        {
          key: CareerValidity.Open,
          value: "Open",
        },
      ];
    }
  );

  const [selectedValidity, setSelectedValidity] = useState<{
    key: CareerValidity;
    value: string;
  }>();

  const { register, handleSubmit } = useForm<Career>();

  const handleCreate: SubmitHandler<Career> = (data: Career) => {
    setIsloading(true);

    const newData: Career = {
      careerId: career?.careerId,
      position: data?.position ?? career?.position,
      description: data?.description ?? career?.description,
      requirements: quillValue ?? career?.requirements,
      careerType: Number(selectedCareerType?.key ?? career?.careerType),
      careerValidity: Number(selectedValidity?.key ?? career?.careerValidity),
    };

    axios
      .put(`${api}/careers/${career?.careerId}`, newData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          console.log(res?.data);
          setIsloading(false);
          window.location.reload();
        }
      })
      .catch((e: AxiosError) => {
        console.log(e);
        setIsloading(false);
        //window.location.reload();
      });
  };

  const handleSelectedRow = (p: CareerApplication) => {
    setIsAppsLoading(true);
    fetchCareerApplication(`${p?.careerAppId}`);
  };

  const fetchCareerApplication = (caId: string) => {
    axios
      .get(`${api}/careers/applications/${caId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        console.log(res?.data);

        if (res?.data) {
          const data: CareerApplication = {
            careerAppId: res?.data["careerAppId"],
            careerId: res?.data["careerId"],
            avatarUrl: res?.data["avatarUrl"],
            email: res?.data["email"],
            firstname: res?.data["firstname"],
            lastname: res?.data["lastname"],
            mobile: res?.data["mobile"],
            biography: res?.data["biography"],
            city: res?.data["city"],
            country: res?.data["country"],
            careerStatus: Number(res?.data["careerStatus"]),
            careerRoleType: Number(res?.data["careerRoleType"]),
          };

          setSelectedApplication(data);
          onOpen();
          setIsAppsLoading(false);
        }
      })
      .catch((e: AxiosError) => {
        console.log(e);
      });
  };

  const onUpdateStatus = (
    cap: CareerApplication,
    cv?: {
      key: CareerStatus;
      value: string;
    }
  ) => {
    const data: CareerApplication = {
      careerAppId: cap?.careerAppId,
      careerId: cap?.careerId,
      avatarUrl: cap?.avatarUrl,
      email: cap?.email,
      firstname: cap?.firstname,
      lastname: cap?.lastname,
      mobile: cap?.mobile,
      biography: cap?.biography,
      city: cap?.city,
      country: cap?.country,
      careerStatus: Number(cv?.key),
      careerRoleType: Number(cap.careerRoleType),
    };

    //console.log(data);

    axios
      .put(`${api}/careers/applications/${cap?.careerAppId}`, data, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          setIsAppsLoading(false);
          window.location.reload();
        }
      })
      .catch((e: AxiosError) => {
        console.log(e.response?.statusText);
        setIsAppsLoading(false);
      });
  };

  const handleAction = (p: CareerApplication, action: string) => {
    switch (action) {
      case actionTypes[0]:
        //Detail
        //handleSelectedRow(p);
        break;
      case actionTypes[1]:
        //handleSelectedRow(p);
        //Detail
        break;
      case actionTypes[2]:
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (b: CareerApplication) => {
    if (Number(authed?.role) !== AuthRole.SuperAdmin) {
      alert(`You do not have permission to perform this action.`);
    } else {
      axios
        .delete(`${api}/careers/applications/${b?.careerAppId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.log(err.response?.data ?? err.response?.statusText);
        });
    }
  };

  const changeCareerValidity = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = careerValiditys.find(
      (p) => p?.key === Number(e.target.value)
    );

    setSelectedValidity(statusVal);
  };

  const columns = ["Name", "Email", "Role", "CV", "Status", "Actions"];

  const handleBack = () => nav("/dashboard/careers");

  const fetchCareer = (cid: string) => {
    axios
      .get(`${api}/careers/${cid}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          console.log(res?.data);
          const data: Career = {
            careerId: res.data?.careerId,
            description: res.data?.description,
            position: res.data?.position,
            requirements: res.data?.requirements,
            careerType: Number(res.data?.careerType),
            careerValidity: Number(res.data?.careerValidity),
          };

          setQuillValue(res?.data["requirements"]);

          setCareer(data);

          const careerTypeVal = careerTypes.find(
            (p) => p?.key === Number(res?.data?.careerType ?? 0)
          );

          setSelectedCareerType(careerTypeVal);

          const careerValid = careerValiditys.find(
            (p) => p?.key === Number(res?.data?.careerValidity ?? 1)
          );

          setSelectedValidity(careerValid);

          setIsloading(false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data ?? err.response?.statusText);
      });
  };

  const fetchCareerApps = (cid: string) => {
    // Fetch applications for this career
    axios
      .get(`${api}/careers/${cid}/applications`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((appRes: AxiosResponse) => {
        if (appRes?.data) {
          console.log(appRes?.data);

          const appData: CareerApplication[] = Array.from(appRes.data).map(
            (app: any) => ({
              careerAppId: app.careerAppId,
              careerId: app.careerId,
              firstname: app.firstname,
              lastname: app.lastname,
              email: app.email,
              city: app.city,
              country: app.country,
              mobile: app.mobile,
              careerRoleType: app.careerRoleType,
              careerStatus: app.careerStatus,
              cvUrl: app.cvUrl ?? null,
            })
          );

          setCareerApps(appData);

          mapStatusType(appData);
          setIsAppsLoading(false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data ?? err.response?.statusText);
      });
  };

  const mapStatusType = (capps: CareerApplication[]) => {
    capps.forEach((d) => {
      const statusVal = careerStatuses.find(
        (p) => p?.key === Number(d?.careerStatus)
      );

      setSelectedStatus(statusVal);
    });
  };

  const careerRoleText = (cvType: AuthRole) => {
    switch (cvType) {
      case AuthRole.Employee:
        return "Employee";
      case AuthRole.Volunteer:
        return "Volunteer";
      case AuthRole.Intern:
        return "Intern";
    }
  };

  const handleDownloadCV = (ca: CareerApplication) => {
    console.log(ca);
    axios
      .get(`${api}/careers/applications/${ca?.careerAppId}/download`, {
        headers: {
          // Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
          "Content-Disposition": "attachment;",
          "Content-Type": "application/octet-stream",
        },
        responseType: "blob",
      })
      .then((res: AxiosResponse) => {
        if (res) {
          fileDownload(res?.data, "", res.headers["content-type"]);
        }
      })
      .catch((err: AxiosError) => {
        console.warn(err.response);

        window.location.reload();
      });
  };

  useEffect(() => {
    if (career === null && careerId) {
      setIsloading(true);
      fetchCareer(careerId);
      setIsAppsLoading(true);
      fetchCareerApps(careerId);
    }
  }, [career, careerId]);

  return (
    <div className="w-full flex flex-col">
      {/* Main Actions */}

      <div className="w-full flex justify-between">
        <div className="w-full p-3 flex items-center gap-5">
          <Button variant="light" onClick={handleBack}>
            <GoArrowLeft size={20} />
          </Button>
          <h1 className=" text-2xl ">{`${route?.state === null ? "Create Career" : ` ${isEdit ? " Edit" : "View"} Career`}`}</h1>
        </div>
        <div className={`w-full flex justify-end items-center gap-5 `}>
          <p>{`Mode: ${isEdit ? "Edit" : "View"}`}</p>

          <Switch
            defaultSelected={isEdit}
            endContent={<GoEye />}
            size="lg"
            startContent={<GoPencil />}
            title={`${isEdit ? "Edit mode" : "View mode"}`}
            onClick={() => {
              if (!isEdit) {
                setIsEdit(true);
              } else {
                setIsEdit(false);
              }
            }}
          />
        </div>
      </div>
      <Divider />

      <div className="w-full flex justify-between">
        {/* Career */}
        <div className="w-full flex flex-col items-center">
          {isLoading ? (
            <>
              <Spinner
                size="lg"
                className=" flex justify-center "
                label="Loading Career!."
                color="primary"
              />
            </>
          ) : (
            <>
              <div className={`w-full p-10`}>
                <form
                  className="w-full flex flex-col gap-5"
                  onSubmit={handleSubmit(handleCreate)}
                >
                  <div className="w-full space-y-3">
                    <label htmlFor="position">Position</label>
                    <Input
                      defaultValue={`${career?.position ?? ""}`}
                      disabled={!isEdit}
                      type="text"
                      {...register("position")}
                      placeholder={career?.position ?? "Enter Position"}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="description">Description</label>
                    <Textarea
                      defaultValue={`${career?.description ?? ""}`}
                      disabled={!isEdit}
                      {...register("description")}
                      placeholder={career?.description ?? "Enter Description"}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="requirements">Requirements</label>
                    <ReactQuill
                      formats={Cformats.filter((p) => p)}
                      modules={Cmodules}
                      placeholder={`${quillValue ?? "Enter Requirements"}`}
                      theme="snow"
                      value={quillValue}
                      onChange={setQuillValue}
                    />
                  </div>

                  <div className="w-full flex justify-between">
                    {/* Career Type */}

                    <div className="w-full flex flex-col space-y-3">
                      <label htmlFor="cType">Type</label>

                      <Select
                        className="max-w-xs"
                        defaultSelectedKeys={`${career?.careerType ?? careerTypes[1].key}`}
                        isDisabled={!isEdit ? true : false}
                        label="Select Type"
                        selectedKeys={`${selectedCareerType?.key ?? careerTypes[1].key}`}
                        onChange={(e) => {
                          changeCareerTypes(e);
                        }}
                      >
                        {careerTypes.map((status) => (
                          <SelectItem key={`${status.key}`}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Career Type End */}

                    {/* Career Validity */}
                    <div className="w-full flex flex-col space-y-3">
                      <label htmlFor="cValid">Validity</label>

                      <Select
                        className="max-w-xs"
                        defaultSelectedKeys={`${career?.careerValidity ?? careerValiditys[1].key}`}
                        isDisabled={!isEdit ? true : false}
                        label="Select Validity"
                        selectedKeys={`${selectedValidity?.key ?? careerValiditys[1].key}`}
                        onChange={(e) => {
                          changeCareerValidity(e);
                        }}
                      >
                        {careerValiditys.map((status) => (
                          <SelectItem key={`${status.key}`}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    {/* Career Validity End */}
                  </div>

                  <div className="w-full flex justify-end">
                    {isEdit && (
                      <Button color="primary" type="submit">
                        Save Changes
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        {/* Career Apps */}
        <div className="w-full flex flex-col items-center">
          {isAppsLoading ? (
            <>
              <Spinner
                className=" flex justify-center "
                color="primary"
                label="Loading Career Applications!."
                size="lg"
              />
            </>
          ) : (
            <>
              <div className={`w-full p-10`}>
                <Table fullWidth isStriped removeWrapper>
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn key={column}>{column}</TableColumn>
                    ))}
                  </TableHeader>

                  <TableBody
                    emptyContent="No Applications at the moment"
                    items={careerApps}
                  >
                    {careerApps?.map((ca) => (
                      <TableRow key={ca?.careerAppId} className="w-full">
                        <TableCell
                          onClick={() => {
                            handleSelectedRow(ca);
                          }}
                        >
                          {ca?.firstname}
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            handleSelectedRow(ca);
                          }}
                        >
                          {ca?.email}
                        </TableCell>
                        <TableCell
                        // onClick={() => {
                        //   handleSelectedRow(ca);
                        // }}
                        >
                          {careerRoleText(Number(ca?.careerRoleType))}
                        </TableCell>
                        <TableCell
                          onClick={() => {
                            if (isEdit) {
                              handleDownloadCV(ca);
                            } else {
                              alert(`Enable edit mode to download CV`);
                            }
                          }}
                        >
                          {ca?.cvUrl === null ? (
                            <>
                              <p>No CV attached</p>
                            </>
                          ) : (
                            <span className=" text-lg hover:text-primary-400">
                              <GoDownload />
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {/* {careerStatusText(Number(ca?.careerStatus))} */}
                          <Select
                            aria-hidden={true}
                            className="max-w-xs"
                            defaultSelectedKeys={`${selectedApplication?.careerStatus ?? careerStatuses[0].key}`}
                            isDisabled={isEdit ? false : true}
                            label="Select Status"
                            selectedKeys={`${selectedStatus?.key ?? careerStatuses[0].key}`}
                            onChange={(e) => {
                              changeCareerStatus(e, ca);
                            }}
                          >
                            {careerStatuses.map((status) => (
                              <SelectItem key={`${status.key}`}>
                                {status.value}
                              </SelectItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="relative flex items-center gap-2">
                            <Tooltip content="View">
                              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <GoEye
                                  onClick={() =>
                                    handleAction(ca, actionTypes[0])
                                  }
                                />
                              </span>
                            </Tooltip>

                            <Tooltip
                              color="danger"
                              content="Delete"
                              isDisabled={!isEdit}
                            >
                              <span
                                className={` ${isEdit ? "text-lg text-danger-500 cursor-pointer active:opacity-50" : "hidden"} `}
                              >
                                <GoTrash
                                  onClick={() =>
                                    handleAction(ca, actionTypes[2])
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h2>Career Application Details</h2>
          </ModalHeader>
          <ModalBody>
            <div className="w-full flex flex-col gap-3">
              <p>
                <strong>First Name:</strong> {selectedApplication?.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {selectedApplication?.lastname}
              </p>
              <p>
                <strong>Email:</strong> {selectedApplication?.email}
              </p>
              <p>
                <strong>City:</strong> {selectedApplication?.city}
              </p>
              <p>
                <strong>Country:</strong> {selectedApplication?.country}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedApplication?.mobile}
              </p>
              <p>
                <strong>Role Type:</strong>{" "}
                {careerRoleText(Number(selectedApplication?.careerRoleType))}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="solid" onClick={onClose}>
              Close
            </Button>

            {/* {isEdit && (
              <Button color="primary" onClick={() => {}}>
                Save Changes
              </Button>
            )} */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Dialog End */}
    </div>
  );
}

export default DashCareerView;
