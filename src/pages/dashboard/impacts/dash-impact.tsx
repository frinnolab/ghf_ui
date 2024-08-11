import useAuthedProfile from "@/hooks/use-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Impact, ImpactAsset } from "./dash-impacts-list";
import { Button } from "@nextui-org/button";
import { Divider, Input, Switch, Textarea } from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil } from "react-icons/go";
import axios, { AxiosResponse, AxiosError } from "axios";

export default function DashImpactView() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const schoolNameRef = useRef<HTMLInputElement>(null);
  const schoolRegionRef = useRef<HTMLInputElement>(null);
  const schoolDistrictRef = useRef<HTMLInputElement>(null);
  const studentGirlsRef = useRef<HTMLInputElement>(null);
  const studentBoysRef = useRef<HTMLInputElement>(null);
  const [studentsTotal, setStudentsTotal] = useState<number>(0);

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [impactId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [impact, setImpact] = useState<Impact | null>(null);
  const [impactAssets, setImpactAssets] = useState<ImpactAsset[] | null>(null);
  const [totalImpactAssets, setTotalImpactAssets] = useState<number>(0);

  const handleBack = () => nav("/dashboard/impacts");

  const handleSave = () => {
    alert("Save");

    if (impact === null) {
      //Save

      const data: Impact = {
        title: `${titleRef?.current?.value ?? ""}`,
        description: `${descriptionRef?.current?.value ?? ""}`,
        schoolRegion: `${schoolRegionRef?.current?.value ?? ""}`,
        schoolDistrict: `${schoolDistrictRef?.current?.value ?? ""}`,
        schoolName: `${schoolNameRef?.current?.value ?? ""}`,
        studentBoys: Number(studentBoysRef?.current?.value) ?? 0,
        studentGirls: Number(studentGirlsRef?.current?.value) ?? 0,
        studentsTotal:
          Number(studentGirlsRef?.current?.value ?? 0) +
          Number(studentBoysRef?.current?.value ?? 0),
      };

      setStudentsTotal(
        Number(studentGirlsRef?.current?.value) +
          Number(studentBoysRef?.current?.value)
      );

      console.log(data);

      axios
        .post(`${api}/impacts`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          //setSelectedImage(null);
          console.log(res);

          setIsEdit(false);

          nav(`/dashboard/impacts/${res?.data["impactId"]}`, {
            state: res?.data["impactId"],
          });
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const handleUpdate = () => {
    if (impact) {
      const data: Impact = {
        impactId: impact?.impactId,
        title: `${titleRef?.current?.value ?? impact?.title}`,
        description: `${descriptionRef?.current?.value ?? impact?.description}`,
        schoolRegion: `${schoolRegionRef?.current?.value ?? impact?.schoolRegion}`,
        schoolDistrict: `${schoolDistrictRef?.current?.value ?? impact?.schoolDistrict}`,
        schoolName: `${schoolNameRef?.current?.value ?? impact?.schoolName}`,
        studentBoys:
          Number(studentBoysRef?.current?.value) ?? impact?.studentBoys ?? 0,
        studentGirls: Number(studentGirlsRef?.current?.value) ?? 0,
        studentsTotal: Number(studentGirlsRef?.current?.value ?? 0),
      };

      console.log(data);

      //   setStudentsTotal(
      //     Number(studentGirlsRef?.current?.value) +
      //       Number(studentBoysRef?.current?.value)
      //   );

      //   axios
      //     .post(`${api}/impacts/${impact?.impactId}`, data, {
      //       headers: {
      //         Authorization: `Bearer ${authed?.token}`,
      //         "Content-Type": "multipart/form-data",
      //       },
      //     })
      //     .then((res: AxiosResponse) => {
      //       console.log(res.data);

      //       window.location.reload();

      //       setIsEdit(false);
      //       //nav("/dashboard/projects");
      //       //setSelectedImage(null);
      //     })
      //     .catch((err: AxiosError) => {
      //       //setSelectedImage(null);
      //       console.log(err.response);
      //     });
    }
  };

  useEffect(() => {
    if (impactId) {
      axios
        .get(`${api}/impacts/${impactId}`)
        .then((res: AxiosResponse) => {
          const data: Impact = {
            impactId: `${res?.data["impactId"]}`,
            title: `${res?.data["title"]}`,
            schoolName: `${res?.data["schoolName"]}`,
            schoolDistrict: `${res?.data["schoolDistrict"]}`,
            schoolRegion: `${res?.data["schoolRegion"]}`,
            studentBoys: Number(`${res?.data["studentBoys"]}`),
            studentGirls: Number(`${res?.data["studentGirls"]}`),
            studentsTotal: Number(`${res?.data["studentsTotal"]}`),
            description: `${res?.data["description"]}`,
          };

          setImpact(data);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impactId]);

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create New Impact" : ` ${isEdit ? " Edit" : "View"} Impact`}`}</h1>
      </div>
      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={`w-full flex justify-between items-center gap-5 `}>
          <h1
            className={` ${impactId === null ? "hidden" : ""} text-start text-xl`}
          >
            {" "}
            Total Students {impact?.studentsTotal ?? studentsTotal}
          </h1>

          <div className={` self-end flex justify-between items-center gap-5`}>
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

        {/* Content */}
        <div className="w-full rounded-2xl flex p-5 justify-between gap-5 bg-slate-200">
          {/* From */}
          <div className="w-full flex flex-col gap-5 overflow-y-scroll h-[70vh] p-5 ">
            <div className="w-full space-y-3">
              <label htmlFor="Title">Title</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={titleRef}
                placeholder={`${impact?.title ?? "Enter Title"}`}
              />
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="SchoolName">School Name</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={schoolNameRef}
                placeholder={`${impact?.schoolName ?? "Enter School name"}`}
              />
            </div>

            <div className="w-full flex justify-between gap-8">
              <div className="w-full space-y-3">
                <label htmlFor="SchoolRegion">School Region</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="text"
                  ref={schoolRegionRef}
                  placeholder={`${impact?.schoolRegion ?? "Enter School region"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="SchoolDistrict">School District</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="text"
                  ref={schoolDistrictRef}
                  placeholder={`${impact?.schoolDistrict ?? "Enter School district"}`}
                />
              </div>
            </div>

            <div className="w-full flex justify-between gap-8">
              <div className="w-full space-y-3">
                <label htmlFor="SchoolGirls">Girl(s) Students reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  ref={studentGirlsRef}
                  placeholder={`${impact?.studentGirls ?? 0}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="SchoolBoys">Boy(s) Students reached</label>
                <Input
                  disabled={!isEdit ? true : false}
                  type="number"
                  min={0}
                  ref={studentBoysRef}
                  placeholder={`${impact?.studentBoys ?? 0}`}
                />
              </div>
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="Description">Description</label>
              <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                ref={descriptionRef}
                placeholder={`${impact?.description ?? "Enter Description"}`}
              />
            </div>

            {/* Actions */}
            <div className="w-full space-y-3 flex justify-end">
              <Button
                color="primary"
                disabled={!isEdit ? true : false}
                onClick={() => {
                  if (impact == null) {
                    handleSave();
                  } else {
                    handleUpdate();
                  }
                }}
              >
                {impactId === null ? "Save" : "Update"}
              </Button>
            </div>
          </div>

          {/* From End */}

          {/* Asets */}
          <div className="w-full flex flex-col gap-5 overflow-y-scroll h-[70vh] p-10">
            <div className={`w-full flex justify-between items-center`}>
              <h1>Impact Images ({totalImpactAssets})</h1>

              <Button
                color={`${impact === null ? "default" : "primary"}`}
                disabled={impact === null}
                // disabled={impact === null}
                onClick={() => {
                  if (!isEdit) {
                    alert("Enable Edit mode to Add Asset(S)");
                  } else {
                    alert("Add Asset");
                  }
                }}
              >
                {impactAssets === null ? "Add Asset(S)" : "Update Asset(S)"}
              </Button>
            </div>

            <div className={`w-full bg-red-500 overflow-y-scroll h-[50vh] p-5`}>
              <p>Asset Images</p>
            </div>

            {/* Image  */}
          </div>
          {/* Asets End */}
        </div>
        {/* Content End 17897806*/}
      </div>
    </div>
  );
}
