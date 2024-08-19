import useAuthedProfile from "@/hooks/use-auth";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Partner, PartnerTypes } from "./dash-partners";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Switch,
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
import { PartnerType } from "@/types";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Textarea } from "@nextui-org/input";

export default function DashboardPartnerPage() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [partnerId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [partnersListTypes] = useState<PartnerTypes[]>(() => {
    return [
      {
        key: `${PartnerType.PARTNER}`,
        label: `PARTNER`,
      },
      {
        key: `${PartnerType.DONOR}`,
        label: `DONOR`,
      },
      {
        key: `${PartnerType.COLLABORATOR}`,
        label: `COLLABORATOR`,
      },
    ];
  });
  const [partner, setPartner] = useState<Partner | null>(null);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PartnerTypes>();

  const changeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = partnersListTypes.find(
      (p) => Number(p?.key) === Number(e.target.value)
    );

    setSelectedStatus(statusVal);
  };
  const navigate = useNavigate();

  const typeName = (key: number) => {
    switch (key) {
      case PartnerType.DONOR:
        return "DONOR";
      case PartnerType.COLLABORATOR:
        return "COLLABORATOR";
      default:
        return "PARTNER";
    }
  };

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  const handleSave = () => {
    const data = new FormData();

    if (partner === null) {
      //Save
      data.append("_method", `POST`);
      data.append("profileId", `${authed?.profileId}`);
      data.append(
        "name",
        `${titleRef?.current?.value === undefined ? "" : titleRef?.current?.value}`
      );
      data.append(
        "description",
        `${descRef?.current?.value === undefined ? "" : descRef?.current?.value}`
      );
      data.append(
        "type",
        `${selectedStatus?.key === undefined ? partnersListTypes[0].key : selectedStatus?.key}`
      );
      if (selectedImage) {
        data.append("image", selectedImage);
      }

      data.forEach((d)=>{
        console.log(d);
        
      })

      // axios
      //   .post(`${api}/partners`, data, {
      //     headers: {
      //       Authorization: `Bearer ${authed?.token}`,
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      //   .then((res: AxiosResponse) => {
      //     //setSelectedImage(null);
      //     console.log(res.data);
      //     nav("/dashboard/partners");
      //   })
      //   .catch((err: AxiosError) => {
      //     console.log(err.response);
      //   });
    }
  };

  const handleUpdate = () => {
    const data = new FormData();

    if (partner) {
      console.log("Update");

      //Save
      data.append("_method", `PUT`);
      data.append("profileId", `${authed?.profileId}`);
      data.append(
        "name",
        `${titleRef?.current?.value === "" || titleRef?.current?.value === undefined ? partner?.name : titleRef?.current?.value}`
      );
      data.append(
        "description",
        `${descRef?.current?.value === "" || descRef?.current?.value === undefined ? partner?.description : descRef?.current?.value}`
      );
      data.append(
        "type",
        `${selectedStatus?.key === undefined ? partnersListTypes[0].key : selectedStatus?.key}`
      );

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      data.forEach((d) => {
        console.log(d);
      });

      axios
        .post(`${api}/partners/${partner?.partnerId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);

          window.location.reload();
          //nav("/dashboard/projects");
          setSelectedImage(null);
        })
        .catch((err: AxiosError) => {
          setSelectedImage(null);
          console.log(err.response);
        });
    }
  };

  useEffect(() => {
    if (partnerId) {
      axios
        .get(`${api}/partners/${partnerId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Partner = {
            partnerId: `${res.data["partnerId"]}`,
            name: `${res.data["name"] ?? ""}`,
            description: `${res.data["description"] ?? ""}`,
            logoUrl: `${res.data["logoUrl"]}`,
          };

          setPartner(data);
        });
    }
  }, [partnerId]);

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button
          variant="light"
          onClick={() => {
            navigate("/dashboard/partners");
          }}
        >
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create" : ` ${isEdit ? " Edit" : "View"} Partner`}`}</h1>
      </div>
      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={` flex justify-end items-center gap-5 `}>
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

        {/* Content */}
        <div className="w-full rounded-2xl bg-slate-200 shadow flex p-5 justify-between">
          {/* Form */}
          <div className="w-[50%] flex flex-col gap-5 p-5 min-h-[70vh]">
            <div className="w-full space-y-3">
              <label htmlFor="pName" className={`text-xl`}>Name</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={titleRef}
                placeholder={`${partner?.name?.toUpperCase() ?? "Enter Partner/Donor/Collaborator name"}`}
              />
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="pDesc" className={`text-xl`}>Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                ref={descRef}
                placeholder={`${partner?.description?.toUpperCase() ?? "Enter Partner/Donor/Collablator description"}`}
              />
            </div>

            {/* Editor */}
            <div className="w-full space-y-3 flex flex-col">
              <label htmlFor="pType" className={`text-xl`}>Select Partner Type</label>

              <Select
                disabled={!isEdit ? true : false}
                label={`Selected: ${typeName(Number(selectedStatus?.key))}`}
                className="max-w-xs"
                defaultSelectedKeys={`${selectedStatus?.key ?? partnersListTypes[0].key}`}
                onChange={(e) => {
                  changeStatus(e);
                }}
              >
                {partnersListTypes.map((p) => (
                  <SelectItem key={`${p.key}`}>
                    {typeName(Number(p.key))}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <Button
                color="primary"
                disabled={!isEdit ? true : false}
                onClick={() => {
                  if (partner == null) {
                    handleSave();
                  } else {
                    handleUpdate();
                  }
                }}
              >
                {partnerId === null ? "Save" : "Update"}
              </Button>
            </div>
          </div>
          {/* Form End */}

          {/* Image Section */}
          <div className="w-[30%] relative rounded-2xl p-5 flex flex-col gap-3 justify-end">
            <h1 className={` text-xl `}>Logo</h1>
            {selectedImage ? (
              <div className="w-full flex items-center justify-end min-h-[50vh]">
                <Image
                  className={`w-[50%] self-end`}
                  src={URL.createObjectURL(selectedImage)}
                />
              </div>
            ) : (
              <div className="min-h-[50vh]">
                {partner?.logoUrl ? (
                  <div>
                    <Image src={`${partner?.logoUrl}`} />
                  </div>
                ) : (
                  <Skeleton className="rounded-lg w-full h-[80%]">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                  </Skeleton>
                )}
              </div>
            )}

            <div className="p-3 flex items-center">
              <input
                disabled={isEdit ? false : true}
                accept="image/*"
                type="file"
                ref={thumbRef}
                onChange={(e) => {
                  onChangePic(e);
                }}
              />

              <span className="flex items-center p-1 hover:bg-default-200 hover:rounded-full">
                <GoTrash
                  size={20}
                  className=" text-danger-500"
                  onClick={removeSelectedImage}
                />
              </span>
            </div>
          </div>
        </div>
        {/* Content End*/}
      </div>
    </div>
  );
}
