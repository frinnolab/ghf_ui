import useAuthedProfile from "@/hooks/use-auth";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Impact, ImpactAsset } from "./dash-impacts-list";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import { Divider, Input, Switch, Textarea } from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash } from "react-icons/go";
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
  const schoolTotalRef = useRef<HTMLInputElement>(null);
  const [studentsTotal, setStudentsTotal] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const handleBack = () => nav("/dashboard/impacts");

  const handleSave = () => {
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
        schoolsTotal: Number(schoolTotalRef?.current?.value) ?? 0,
        studentsTotal:
          Number(studentGirlsRef?.current?.value ?? 0) +
          Number(studentBoysRef?.current?.value ?? 0),
      };

      setStudentsTotal(
        Number(studentGirlsRef?.current?.value) +
          Number(studentBoysRef?.current?.value)
      );

      axios
        .post(`${api}/impacts`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          if(res?.data){
            nav(`/dashboard/impacts`);
          }
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
        title:
          titleRef?.current?.value === null
            ? impact?.title
            : titleRef?.current?.value,
        description:
          descriptionRef?.current?.value === null
            ? impact?.description
            : descriptionRef?.current?.value,
        schoolRegion:
          schoolRegionRef?.current?.value === null
            ? impact?.schoolRegion
            : schoolRegionRef?.current?.value,
        schoolDistrict:
          schoolDistrictRef?.current?.value === null
            ? impact?.schoolDistrict
            : schoolDistrictRef?.current?.value,
        schoolName:
          schoolNameRef?.current?.value === null 
            ? impact?.schoolName
            : schoolNameRef?.current?.value,

        studentBoys: Number(
          studentBoysRef?.current?.value === null || ""
            ? impact?.studentBoys ?? 0
            : studentBoysRef?.current?.value
        ),

        schoolsTotal: Number(
          schoolTotalRef?.current?.value === null || ""
            ? impact?.schoolsTotal ?? 0
            : schoolTotalRef?.current?.value
        ),

        studentGirls: Number(
          studentGirlsRef?.current?.value === null || ""
            ? impact?.studentGirls ?? 0
            : studentGirlsRef?.current?.value
        ),
      };


      axios
        .put(`${api}/impacts/${impact?.impactId}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "put",
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);

          setIsEdit(false);
          nav(`/dashboard/impacts`);

          //window.location.reload();
        })
        .catch((err: AxiosError) => {
          setIsEdit(false);
          //setSelectedImage(null);
          console.log(err);
        });
    }
  };

  const handleAssetUpload = () => {
    const asset = new FormData();

    if (impactId) {
      if (selectedImage === null) {
        alert("No file chosen");
      } else {
        asset.append("_method", "POST");
        asset.append("impactId", `${impact?.impactId}`);
        if (selectedImage) {
          asset.append("image", selectedImage);
        }


        axios
          .post(`${api}/impacts/assets/${impact?.impactId}`, asset, {
            headers: {
              Authorization: `Bearer ${authed?.token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res: AxiosResponse) => {
            console.log(res.data);

            const datas: ImpactAsset[] = Array.from(res?.data).flatMap(
              (d: any) => {
                const data: ImpactAsset = {
                  assetUrl: d?.assetUrl,
                  impactAssetId: d?.assetId,
                  impactId: d?.impactId,
                };

                return [data];
              }
            );

            setImpactAssets([...datas]);
            setSelectedImage(null);
            window.location.reload();
          })
          .catch((err: AxiosError) => {
            console.log(err?.response);

            setSelectedImage(null);

            //alert(`${err?.response?.data}`);

            window.location.reload();
          });
      }
    } else {
      alert("Create Impact before adding asset.");
    }
  };

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    if (!isEdit) {
      alert("Enable Edit mode to remove Asset(S)");
    } else {
      setSelectedImage(null);
      window.location.reload();
    }
  };

  const removeImpactAsset = (impactAssetId: string) => {
    if (!isEdit) {
      alert("Enable Edit mode to remove Asset(S)");
    } else {

      axios
        .delete(`${api}/impacts/assets/${impactAssetId}`, {
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

  useEffect(() => {
    if (impactId) {
      axios
        .get(`${api}/impacts/${impactId}`)
        .then((res: AxiosResponse) => {
          const data: Impact = {
            impactId: `${res?.data["impactId"]}`,
            title: res?.data["title"],
            schoolName: res?.data["schoolName"],
            schoolDistrict: res?.data["schoolDistrict"],
            schoolRegion: res?.data["schoolRegion"],
            studentBoys: Number(`${res?.data["studentBoys"]}`),
            studentGirls: Number(`${res?.data["studentGirls"]}`),
            studentsTotal: Number(`${res?.data["studentsTotal"]}`),
            schoolsTotal: Number(`${res?.data["schoolsTotal"]}`),
            description: res?.data["description"],
          };

          setImpact(data);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impactId]);

  //fetch assets
  useEffect(() => {
    if (impact) {
      axios
        .get(`${api}/impacts/assets/${impactId}`)
        .then((res: AxiosResponse) => {
          const datas: ImpactAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: ImpactAsset = {
                assetUrl: d?.assetUrl,
                impactAssetId: d?.assetId,
                impactId: d?.impactId,
              };

              return [data];
            }
          );

          setImpactAssets([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impact]);

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

          <div>
            <h1
              className={` ${impactId === null ? "hidden" : ""} text-start text-xl`}
            >
              {" "}
              Total Students {impact?.studentsTotal ?? studentsTotal}
            </h1>
          </div>

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
                placeholder={impact?.title ?? "Enter Title"}
              />
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="SchoolReached">School(s) Reached</label>
              <Input
                disabled={!isEdit ? true : false}
                type="number"
                ref={schoolTotalRef}
                placeholder={`${impact?.schoolsTotal ?? "0"}`}
              />
            </div>
            <div className="w-full space-y-3 hidden">
              <label htmlFor="SchoolName">School Name</label>
              <Input
                disabled={!isEdit ? true : false}
                type="text"
                ref={schoolNameRef}
                placeholder={`${impact?.schoolName ?? "Enter School name"}`}
              />
            </div>

            <div className="w-full  justify-between gap-8 hidden">
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
                color={`${impact === null ? "default" : "primary"}`}
                disabled={impact === null}
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
              {impactAssets === null || impactAssets?.length === 0 ? (
                <>
                  <p className=" text-center ">No Asset</p>
                </>
              ) : (
                <div className={`w-full flex gap-3`}>
                  {impactAssets?.flatMap((d: ImpactAsset) => (
                    <div
                      key={d?.impactAssetId}
                      className={`shadow rounded-2xl flex flex-col justify-between items-center gap-1 P-2`}
                    >
                      <Image width={150} src={d?.assetUrl} />
                      <span className=" self-end flex items-center p-2 hover:bg-default-400 hover:rounded-full">
                        <GoTrash
                          size={20}
                          className=" text-danger-500"
                          onClick={() => {
                            removeImpactAsset(`${d?.impactAssetId}`);
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image  */}
          </div>
          {/* Asets End */}
        </div>
        {/* Content End*/}
      </div>
    </div>
  );
}
