import useAuthedProfile from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Project, ProjectStatus, projectStatusEnum } from "./dash-projects";
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
  Skeleton,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
export default function DashProjectPage() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [projectId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [project, setProject] = useState<Project | null>(null);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const regionsRef = useRef<HTMLInputElement | null>(null);
  const districtsRef = useRef<HTMLInputElement | null>(null);
  const schoolsRef = useRef<HTMLInputElement | null>(null);
  const studentsRef = useRef<HTMLInputElement | null>(null);
  const dateStartRef = useRef<HTMLInputElement | null>(null);
  const dateEndRef = useRef<HTMLInputElement | null>(null);
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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

  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>();

  useEffect(() => {
    if (projectId) {
      axios
        .get(`${api}/projects/${projectId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Project = {
            projectId: `${res.data["projectId"]}`,
            title: `${res.data["title"]}`,
            description: `${res.data["description"]}`,
            regionsReached: Number(`${res.data["regionsReached"]}` ?? 0),
            districtsReached: Number(`${res.data["districtsReached"]}` ?? 0),
            schoolsReached: Number(`${res.data["schoolsReached"]}` ?? 0),
            studentsReached: Number(`${res.data["studentsReached"]}` ?? 0),
            dateStart: `${res.data["dateStart"]}`,
            dateEnd: `${res.data["dateEnd"]}`,
            publisherId: `${res.data["publisherId"]}`,
            status: Number(`${res?.data["status"]}`),
            thumbnailUrl: `${res.data["thumbnailUrl"]}`,
          };

          const statusVal = projectStatus.find(
            (p) => p?.key === Number(data?.status)
          );

          setProject(data);

          setSelectedStatus(statusVal);

          removeSelectedImage();
        });
    }
  }, []);

  const handleBack = () => nav("/dashboard/projects");

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const handleSave = () => {
    console.log("Save");

    const data = new FormData();

    if (project === null) {
      //Save
      data.append("_method", `POST`);
      data.append("publisherProfileId", `${authed?.profileId}`);
      data.append("title", `${titleRef?.current?.value}`);
      data.append("description", `${descRef?.current?.value}`);
      data.append(
        "status",
        `${selectedStatus?.key === undefined ? projectStatus[1].key : selectedStatus?.key}`
      );
      data.append("regionsReached", `${regionsRef?.current?.value}`);
      data.append("districtsReached", `${districtsRef?.current?.value}`);
      data.append("schoolsReached", `${schoolsRef?.current?.value}`);
      data.append("studentsReached", `${studentsRef?.current?.value}`);
      //   data.append("dateStart", `${dateStartRef?.current?.value}`);
      //   data.append("dateEnd", `${dateEndRef?.current?.value}`);

      if (selectedImage) {
        data.append("image", selectedImage);
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
          console.log(res.data);
          nav("/dashboard/projects");
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const handleUpdate = () => {
    const data = new FormData();

    if (project) {
      console.log("Update");

      //Save
      data.append("_method", `PUT`);
      data.append("publisherProfileId", `${authed?.profileId}`);
      data.append("title", `${titleRef?.current?.value ?? project?.title}`);
      data.append(
        "description",
        `${descRef?.current?.value ?? project?.description}`
      );
      data.append(
        "status",
        `${selectedStatus?.key === undefined ? projectStatus[1].key : selectedStatus?.key}`
      );
      data.append(
        "regionsReached",
        `${regionsRef?.current?.value ?? project?.regionsReached}`
      );
      data.append(
        "districtsReached",
        `${districtsRef?.current?.value ?? project?.districtsReached}`
      );
      data.append(
        "schoolsReached",
        `${schoolsRef?.current?.value ?? project?.schoolsReached}`
      );
      data.append(
        "studentsReached",
        `${studentsRef?.current?.value ?? project?.studentsReached}`
      );

      if (selectedImage) {
        data.append("image", selectedImage);
      }

      data.forEach((d) => {
        console.log(d);
      });

      axios
        .post(`${api}/projects/${project?.projectId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);

          window.location.reload();
          //nav("/dashboard/projects");
          //setSelectedImage(null);
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
        <div className="w-full rounded-2xl bg-default-50 shadow flex p-5 justify-between">
          {/* Form */}
          <div className="w-[60%] flex flex-col gap-5 overflow-y-scroll h-[70vh] p-5">
            <div className="w-full space-y-3">
              <label htmlFor="Title">Title</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={titleRef}
                placeholder={`${project?.title?.toUpperCase() ?? "Enter Title"}`}
              />
            </div>

            {/* Editor */}
            <div className="w-full space-y-3">
              <label htmlFor="description">Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                ref={descRef}
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
                  ref={regionsRef}
                  placeholder={`${project?.regionsReached ?? "Enter Regions reached"}`}
                />
              </div>
              <div className="w-full space-y-3">
                <label htmlFor="districtsReached">Districts Reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  ref={districtsRef}
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
                  ref={schoolsRef}
                  placeholder={`${project?.schoolsReached ?? "Enter Schools reached"}`}
                />
              </div>
              <div className="w-full space-y-3">
                <label htmlFor="studentsReached">Students reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  ref={studentsRef}
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
                <label htmlFor="dateStart"></label>
                {/* <DatePicker ref={dateStartRef} /> */}
              </div>
              <div className="w-full flex flex-col space-y-3">
                <label htmlFor="dateEnd">Status</label>
                {/* <DatePicker ref={dateEndRef} /> */}

                <Select
                  label="Select Project Status"
                  className="max-w-xs"
                  defaultSelectedKeys={`${selectedStatus?.key ?? projectStatus[1].key}`}
                  onChange={(e) => {
                    changeStatus(e);
                  }}
                >
                  {projectStatus.map((animal) => (
                    <SelectItem key={`${animal.key}`}>
                      {animal.value}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            {/* Type Stats End */}

            {/* Actions */}
            <div className="w-full space-y-3">
              <Button
                color="primary"
                disabled={!isEdit ? true : false}
                onClick={() => {
                  if (project == null) {
                    handleSave();
                  } else {
                    handleUpdate();
                  }
                }}
              >
                {projectId === null ? "Save" : "Update"}
              </Button>
            </div>
          </div>
          {/* Form End */}
          {/* Thumbnail */}
          <div className="w-[30%] relative rounded-2xl p-5 flex flex-col justify-end">
            {selectedImage ? (
              <div className="w-full flex items-center justify-end">
                <Image
                  className={`w-[50%] self-end`}
                  src={URL.createObjectURL(selectedImage)}
                />
              </div>
            ) : (
              <div>
                {project?.thumbnailUrl ? (
                  <div>
                    <Image src={`${project?.thumbnailUrl}`} />
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
        {/* Content End */}
      </div>
    </div>
  );
}
