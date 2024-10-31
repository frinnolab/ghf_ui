import useAuthedProfile from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Project,
  ProjectAsset,
  ProjectStatus,
  projectStatusEnum,
} from "./dash-projects";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button } from "@nextui-org/button";
import {
  DatePicker,
  Divider,
  Image,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
import { SubmitHandler, useForm } from "react-hook-form";
import { siteConfig } from "@/config/site";
export default function DashProjectPage() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [, setIsProject] = useState<boolean>(false);
  const [projectId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [project, setProject] = useState<Project | null>(null);
  const dateStartRef = useRef<HTMLInputElement | null>(null);
  const dateEndRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedThumbImage, setSelectedThumbImage] = useState<File | null>(
    null
  );
  const [projectStatus] = useState<ProjectStatus[]>(() => {
    return [
      {
        key: projectStatusEnum.Completed,
        value: "Completed",
      },
      {
        key: projectStatusEnum.Ongoing,
        value: "Ongoing",
      },
    ];
  });

  //Assets
  const [projectAssets, setProjectAssets] = useState<ProjectAsset[] | null>(
    null
  );
  //Assets End

  //Form State
  const { register, handleSubmit } = useForm<Project>();

  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>();

  useEffect(() => {
    if (!project) {
      axios
        .get(`${api}/projects/${projectId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          const data: Project = {
            projectId: `${res.data["projectId"]}`,
            title: `${res.data["title"]}`,
            description: `${res.data["description"]}`,
            regionsReached: Number(`${res?.data["regionsReached"]}`) ?? 0,
            districtsReached: Number(`${res.data["districtsReached"]}`) ?? 0,
            schoolsReached: Number(`${res.data["schoolsReached"]}`) ?? 0,
            studentsReached: Number(`${res.data["studentsReached"]}`) ?? 0,
            dateStart: `${res.data["dateStart"]}`,
            dateEnd: `${res.data["dateEnd"]}`,
            publisherId: `${res.data["publisherId"]}`,
            status: Number(`${res?.data["status"]}`),
            thumbnailUrl: res?.data["thumbnailUrl"] ?? null,
          };

          const statusVal = projectStatus.find(
            (p) => p?.key === Number(data?.status)
          );

          setProject(data);

          setSelectedStatus(statusVal);

          removeSelectedImage();
          setIsProject(true);
        });
    }
  }, [project]);

  //fetch assets
  useEffect(() => {
    if (project) {
      axios
        .get(`${api}/projects/assets/${projectId}`)
        .then((res: AxiosResponse) => {
          const datas: ProjectAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: ProjectAsset = {
                assetUrl: d?.assetUrl,
                assetId: d?.assetId,
                projectId: d?.projectId,
              };

              return [data];
            }
          );

          setProjectAssets([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [project]);

  const handleBack = () => nav("/dashboard/projects");

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onChangeThumbPic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedThumbImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const removeSelectedThumbImage = () => {
    setSelectedThumbImage(null);
  };

  const onProjectSubmit: SubmitHandler<Project> = (d) => {
    if (projectId) {
      handleUpdate(d);
    } else {
      handleSave(d);
    }
  };

  const handleSave = (d: Project) => {
    const data = new FormData();

    if (project === null) {
      //Save
      data.append("_method", `POST`);
      data.append("publisherProfileId", `${authed?.profileId}`);
      data.append("title", `${d?.title ?? ""}`);
      data.append("description", `${d?.description ?? ""}`);
      data.append(
        "status",
        `${selectedStatus?.key === undefined ? projectStatus[1].key : selectedStatus?.key}`
      );
      data.append("regionsReached", `${d?.regionsReached ?? 0}`);
      data.append("districtsReached", `${d?.districtsReached ?? 0}`);
      data.append("schoolsReached", `${d?.schoolsReached ?? 0}`);
      data.append("studentsReached", `${d?.studentsReached ?? 0}`);

      if (selectedThumbImage) {
        data.append("image", selectedThumbImage);
      }

      axios
        .post(`${api}/projects`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          //setSelectedImage(null);
          if (res?.data) {
            nav("/dashboard/projects");
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const handleUpdate = (d: Project) => {
    const data = new FormData();

    if (project) {
      //Save
      data.append("_method", `PUT`);
      data.append("publisherProfileId", `${authed?.profileId}`);
      data.append("title", `${d?.title ?? project?.title}`);
      data.append("description", `${d?.description ?? project?.description}`);
      data.append(
        "status",
        `${selectedStatus?.key === undefined || selectedStatus?.key === null ? projectStatus[1].key : selectedStatus?.key}`
      );
      data.append(
        "regionsReached",
        `${d?.regionsReached ?? project?.regionsReached}`
      );
      data.append(
        "districtsReached",
        `${d?.districtsReached ?? project?.districtsReached}`
      );
      data.append(
        "schoolsReached",
        `${d?.schoolsReached ?? project?.schoolsReached}`
      );
      data.append(
        "studentsReached",
        `${d?.studentsReached ?? project?.studentsReached}`
      );

      if (selectedThumbImage) {
        data.append("image", selectedThumbImage);
      }

      axios
        .post(`${api}/projects/${project?.projectId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          if (res?.data) {
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          //setSelectedImage(null);
          console.log(err.response);
        });
    }
  };

  const changeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = projectStatus.find(
      (p) => p?.key === Number(e.target.value)
    );

    setSelectedStatus(statusVal);
  };

  const handleAssetUpload = () => {
    const asset = new FormData();

    if (projectId) {
      if (selectedImage === null) {
        alert("No file chosen");
      } else {
        asset.append("_method", "POST");
        asset.append("projectId", `${project?.projectId}`);
        if (selectedImage) {
          asset.append("image", selectedImage);
        }

        axios
          .post(`${api}/projects/assets/${project?.projectId}`, asset, {
            headers: {
              Authorization: `Bearer ${authed?.token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res: AxiosResponse) => {
            console.log(res.data);

            const datas: ProjectAsset[] = Array.from(res?.data).flatMap(
              (d: any) => {
                const data: ProjectAsset = {
                  assetUrl: d?.assetUrl,
                  assetId: d?.assetId,
                  projectId: d?.projectId,
                };

                return [data];
              }
            );

            setProjectAssets([...datas]);
            setSelectedImage(null);
            window.location.reload();
          })
          .catch((err: AxiosError) => {
            console.log(err?.response);

            setSelectedImage(null);

            window.location.reload();
          });
      }
    } else {
      alert("Create Impact before adding asset.");
    }
  };

  const removeAsset = (assetId: string) => {
    if (!isEdit) {
      alert("Enable Edit mode to remove Asset(S)");
    } else {
      axios
        .delete(`${api}/projects/assets/${assetId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          if (res) {
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.response);

          window.location.reload();
        });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create Project" : ` ${isEdit ? " Edit" : "View"} Project`}`}</h1>
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
        <div className="w-full rounded-2xl bg-default-200 shadow flex p-5 justify-between">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onProjectSubmit)}
            className="w-full flex flex-col gap-5 overflow-y-scroll h-[70vh] p-5"
          >
            <div className="w-full space-y-3">
              <label htmlFor="Thumbnail">Thumbnail</label>

              <div className="w-full min-h-[10dvh] relative rounded-2xl p-5 flex flex-col items-center ">
                {selectedThumbImage ? (
                  <div className="w-full flex items-center p-5 justify-center">
                    <Image
                      width={100}
                      src={URL.createObjectURL(selectedThumbImage)}
                    />
                  </div>
                ) : (
                  <div>
                    {project?.thumbnailUrl ? (
                      <div className="w-full flex items-center justify-center">
                        <Image
                          width={100}
                          src={
                            project?.thumbnailUrl ??
                            siteConfig.staticAssets.staticLogo
                          }
                        />
                      </div>
                    ) : (
                      <Image
                        width={100}
                        src={siteConfig.staticAssets.staticLogo}
                      />
                    )}
                  </div>
                )}

                <div className="p-3 flex items-center">
                  <input
                    disabled={isEdit ? false : true}
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      onChangeThumbPic(e);
                    }}
                  />

                  <span className="flex items-center p-1 hover:bg-default-200 hover:rounded-full">
                    <GoTrash
                      size={20}
                      className=" text-danger-500"
                      onClick={removeSelectedThumbImage}
                    />
                  </span>
                </div>
              </div>
              <Divider/>
            </div>
            
            <div className="w-full space-y-3">
              <label htmlFor="Title">Title</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                defaultValue={`${project?.title ?? ""}`}
                {...register("title")}
                placeholder={`${project?.title?.toUpperCase() ?? "Enter Title"}`}
              />
            </div>

            {/* Editor */}
            <div className="w-full space-y-3">
              <label htmlFor="description">Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                defaultValue={`${project?.description ?? ""}`}
                {...register("description")}
                placeholder={`${project?.description ?? "Enter Description"}`}
              />
            </div>

            {/* Regs Stats */}

            <div className="flex gap-5">
              <div className="w-full space-y-3">
                <label htmlFor="regionsReached">Regions Reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  defaultValue={`${project?.regionsReached ?? ""}`}
                  {...register("regionsReached")}
                  placeholder={`${project?.regionsReached ?? "Enter Regions reached"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="districtsReached">Districts Reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  defaultValue={`${project?.districtsReached ?? ""}`}
                  {...register("districtsReached")}
                  placeholder={`${project?.districtsReached ?? "Enter Districts reached"}`}
                />
              </div>
            </div>
            {/* Regs Stats End */}

            {/* School Stats */}

            <div className="flex gap-5">
              <div className="w-full space-y-3">
                <label htmlFor="schoolsReached">Schools Reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  defaultValue={`${project?.schoolsReached ?? ""}`}
                  {...register("schoolsReached")}
                  placeholder={`${project?.schoolsReached ?? "Enter Schools reached"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="studentsReached">Students reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  defaultValue={`${project?.studentsReached ?? ""}`}
                  {...register("studentsReached")}
                  placeholder={`${project?.studentsReached ?? "Enter Students reached"}`}
                />
              </div>
            </div>
            {/* School Stats End */}

            {/* Dates Stats */}

            <div className="gap-5 hidden">
              <div className="w-full space-y-3">
                <label htmlFor="dateStart">Date Start</label>
                <DatePicker ref={dateStartRef} />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="dateEnd">Date End</label>
                <DatePicker ref={dateEndRef} />
              </div>
            </div>
            {/* Dates Stats End */}

            {/* Type Stats */}

            <div className="flex gap-5">
              <div className="w-full space-y-3">
                <label htmlFor="#"></label>
              </div>

              <div className="w-full flex flex-col space-y-3">
                <label htmlFor="status">Status</label>

                <Select
                  isDisabled={!isEdit ? true : false}
                  label="Select Project Status"
                  selectedKeys={`${selectedStatus?.key ?? projectStatus[1].key}`}
                  className="max-w-xs"
                  defaultSelectedKeys={`${selectedStatus?.key ?? projectStatus[1].key}`}
                  onChange={(e) => {
                    changeStatus(e);
                  }}
                >
                  {projectStatus.map((status) => (
                    <SelectItem key={`${status.key}`}>
                      {status.value}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* Type Stats End */}

            {/* Actions */}
            <div className="w-full space-y-3 flex items-center">
              <Button
                color="primary"
                disabled={!isEdit ? true : false}
                type="submit"
              >
                {projectId === null ? "Save" : "Update"}
              </Button>
            </div>
          </form>
          {/* Form End */}

          {/* Assets */}
          <div className="w-full flex flex-col gap-5 overflow-hidden h-[70vh] p-3">
            <div className={`w-full flex justify-between items-center`}>
              {/* <h1>Impact Images ({impactAssets?.length ?? 0})</h1> */}
              <div className="p-2 flex items-center">
                <input
                  disabled={!isEdit ? true : false}
                  accept="image/*"
                  type="file"
                  onChange={(e) => {
                    onChangePic(e);
                  }}
                />

                <span className="flex items-center p-1 hover:bg-default-400 hover:rounded-full">
                  <GoTrash
                    size={20}
                    className=" text-danger-500"
                    onClick={removeSelectedImage}
                  />
                </span>
              </div>

              <Button
                color={`${project === null ? "default" : "primary"}`}
                disabled={project === null}
                onClick={() => {
                  if (!isEdit) {
                    alert("Enable Edit mode to Add Asset(S)");
                  } else {
                    handleAssetUpload();
                  }
                }}
              >
                {"Add Asset"}
              </Button>
            </div>

            <div className={`w-full overflow-y-scroll h-[50vh] p-2`}>
              {projectAssets === null || projectAssets?.length === 0 ? (
                <>
                  <p className=" text-center ">No Asset(s)</p>
                </>
              ) : (
                <div className={`w-full flex gap-3`}>
                  {projectAssets?.flatMap((d: ProjectAsset) => (
                    <div
                      key={d?.projectId}
                      className={`shadow rounded-2xl flex flex-col justify-between items-center gap-1 P-2`}
                    >
                      <Image width={150} src={d?.assetUrl} />
                      <span className=" self-end flex items-center p-2 hover:bg-default-400 hover:rounded-full">
                        <GoTrash
                          size={20}
                          className=" text-danger-500"
                          onClick={() => {
                            removeAsset(`${d?.assetId}`);
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Assets End */}
        </div>
        {/* Content End */}
      </div>
    </div>
  );
}
