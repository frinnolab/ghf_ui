import useAuthedProfile from "@/hooks/use-auth";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Career,
  CareerApplication,
  CareerStatus,
  CareerType,
  CareerValidity,
} from "./dash-careers";
import axios, { AxiosError, AxiosResponse} from "axios";
import {
  Button,
  Divider,
  Input,
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
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil } from "react-icons/go";
import { AuthRole } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import ReactQuill from "react-quill";
import { Qformats, Qmodules } from "../blog/dash-blog-create";

function DashCareerView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isAppsLoading, setIsAppsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // const actionTypes = ["detail", "edit", "delete"];
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

  // const [careerStatuses] = useState<{ key: CareerStatus; value: string }[]>(
  //   () => {
  //     return [
  //       {
  //         key: CareerStatus.Pending,
  //         value: "Pending",
  //       },
  //       {
  //         key: CareerStatus.Denied,
  //         value: "Denied",
  //       },
  //       {
  //         key: CareerStatus.Accepted,
  //         value: "Accepted",
  //       },
  //     ];
  //   }
  // );

  // const [, setSelectedStatus] = useState<{
  //   key: CareerStatus;
  //   value: string;
  // }>();

  // const changeCareerStatus = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const statusVal = careerStatuses.find(
  //     (p) => p?.key === Number(e.target.value)
  //   );

  //   setSelectedStatus(statusVal);
  // };

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

  const changeCareerValidity = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = careerValiditys.find(
      (p) => p?.key === Number(e.target.value)
    );

    setSelectedValidity(statusVal);
  };

  const columns = ["Name", "Email", "Role", "Status", "Actions"];

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

                const appData: CareerApplication[] = Array.from(
                  appRes.data
                ).map((app: any) => ({
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
                  //   applicantId: app.applicantId,
                  //   applicant: app.applicant,
                  //   attachments: app.attachments
                }));
                setCareerApps(appData);
                setIsAppsLoading(false);
              }
            })
            .catch((err: AxiosError) => {
              console.log(err.response?.data ?? err.response?.statusText);
            });
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data ?? err.response?.statusText);
      });
  };

  // const careerTypeText = (cType: CareerType) => {
  //   switch (cType) {
  //     case CareerType.Employment:
  //       return "Employment";
  //     case CareerType.Volunteering:
  //       return "Volunteering";
  //   }
  // };

  // const careerValidityText = (cvType: CareerValidity) => {
  //   switch (cvType) {
  //     case CareerValidity.Open:
  //       return "Open";
  //     case CareerValidity.Closed:
  //       return "Closed";
  //   }
  // };

  const careerStatusText = (cvType: CareerStatus) => {
    switch (cvType) {
      case CareerStatus.Accepted:
        return "Accepted";
      case CareerStatus.Denied:
        return "Denied";
      case CareerStatus.Pending:
        return "Pending";
    }
  };

  const careerRoleText = (cvType: AuthRole) => {
    switch (cvType) {
      case AuthRole.Employee:
        return "Employee";
      case AuthRole.Volunteer:
        return "Volunteer";
    }
  };

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

  // const handleSelectedRow = (p: Career) => {
  //   console.log(p);
  //   // nav(`/dashboard/careers/${p.careerId}`, {
  //   //   state: p.careerId,
  //   // });
  // };

  // const handleAction = (p: Career, action: string) => {
  //   switch (action) {
  //     case actionTypes[0]:
  //       //Detail
  //       handleSelectedRow(p);
  //       break;
  //     case actionTypes[1]:
  //       handleSelectedRow(p);
  //       //Detail
  //       break;
  //     case actionTypes[2]:
  //       handleDelete(p);
  //       break;
  //   }
  // };

  // const handleDelete = (b: Career) => {
  //   if (authed?.role !== AuthRole.SuperAdmin || AuthRole.Admin) {
  //     alert(HttpStatusCode.Unauthorized);
  //   } else {
  //     axios
  //       .delete(`${api}/careers/${b?.careerId}`, {
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${authed?.token}`,
  //         },
  //       })
  //       .then(() => {
  //         window.location.reload();
  //       })
  //       .catch((err: AxiosError) => {
  //         console.log(err.response?.data ?? err.response?.statusText);
  //       });
  //   }
  // };

  useEffect(() => {
    if (career === null && careerId !== null) {
      setIsloading(true);
      setIsAppsLoading(true);
      fetchCareer(careerId);
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
            onClick={() => {
              if (!isEdit) {
                setIsEdit(true);
              } else {
                setIsEdit(false);
              }
            }}
            defaultSelected={isEdit}
            size="lg"
            startContent={<GoPencil />}
            endContent={<GoEye />}
            title={`${isEdit ? "Edit mode" : "View mode"}`}
          ></Switch>
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
                      disabled={!isEdit}
                      type="text"
                      defaultValue={`${career?.position ?? ""}`}
                      {...register("position")}
                      placeholder={career?.position ?? "Enter Position"}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="description">Description</label>
                    <Textarea
                      disabled={!isEdit}
                      defaultValue={`${career?.description ?? ""}`}
                      {...register("description")}
                      placeholder={career?.description ?? "Enter Description"}
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <label htmlFor="requirements">Requirements</label>
                    <ReactQuill
                      placeholder={`${career?.requirements ?? "Enter Requirements"}`}
                      theme="snow"
                      value={quillValue}
                      onChange={setQuillValue}
                      formats={Qformats.filter((p) => p)}
                      modules={Qmodules}
                    />
                  </div>

                  <div className="w-full flex justify-between">
                    {/* Career Type */}

                    <div className="w-full flex flex-col space-y-3">
                      <label htmlFor="cType">Type</label>

                      <Select
                        isDisabled={!isEdit ? true : false}
                        label="Select Type"
                        selectedKeys={`${selectedCareerType?.key ?? careerTypes[1].key}`}
                        className="max-w-xs"
                        defaultSelectedKeys={`${career?.careerType ?? careerTypes[1].key}`}
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
                        isDisabled={!isEdit ? true : false}
                        label="Select Validity"
                        selectedKeys={`${selectedValidity?.key ?? careerValiditys[1].key}`}
                        className="max-w-xs"
                        defaultSelectedKeys={`${career?.careerValidity ?? careerValiditys[1].key}`}
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
                size="lg"
                className=" flex justify-center "
                label="Loading Career Applications!."
                color="primary"
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
                      <TableRow className="w-full" key={ca?.careerAppId}>
                        <TableCell onClick={() => {}}>
                          {ca?.firstname}
                        </TableCell>
                        <TableCell onClick={() => {}}>{ca?.email}</TableCell>
                        <TableCell onClick={() => {}}>
                          {careerRoleText(Number(ca?.careerRoleType))}
                        </TableCell>
                        <TableCell onClick={() => {}}>
                          { careerStatusText (Number(ca?.careerStatus))}
                        </TableCell>
                        <TableCell onClick={() => {}}>
                          {``}
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
    </div>
  );
}

export default DashCareerView;
