import useAuthedProfile from "@/hooks/use-auth";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Publication,
  PublicationAsset,
  PublicationStatus,
  PublishTypeEnum,
} from "./dash-publications";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Input,
  Select,
  SelectItem,
  Switch,
  Spinner,
} from "@nextui-org/react";
import {
  GoArrowLeft,
  GoDownload,
  GoEye,
  GoFile,
  GoPencil,
  GoTrash,
} from "react-icons/go";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Qformats, Qmodules } from "../blog/dash-blog-create";
import fileDownload from "js-file-download";

//var fileDownload = require('js-file-download');
export default function DashPublicationsView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(true);

  const [pubId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });

  const [pubStatus] = useState<PublicationStatus[]>(() => {
    return [
      {
        key: PublishTypeEnum.Report,
        value: "Report",
      },
      {
        key: PublishTypeEnum.Newsletter,
        value: "Newsletter",
      },
      {
        key: PublishTypeEnum["Student Manual"],
        value: "Student Manual",
      },
    ];
  });

  const [publication, setPublication] = useState<Publication | null>(null);
  const [pubAssets, setPubAssets] = useState<PublicationAsset[] | null>(null);
  const pubDateRef = useRef<HTMLInputElement | null>(null);
  const assetTitleRef = useRef<HTMLInputElement | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PublicationStatus>();
  const [quillValue, setQuillValue] = useState("");

  //Form State
  const { register, handleSubmit } = useForm<Publication>();

  const handleBack = () => nav("/dashboard/publications");

  const handleSave = (p: Publication) => {
    if (publication === null) {
      //Save
      const data = {
        title: `${p?.title ?? ""}`,
        description: `${quillValue}`,
        publishDate: `${pubDateRef?.current?.value}`,
        publishType: `${selectedStatus?.key === undefined ? pubStatus[0].key : selectedStatus?.key}`,
        authorId: `${authed?.profileId ?? ""}`,
      };

      axios
        .post(`${api}/publications`, data, {
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
          nav(`/dashboard/publications`);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const handleUpdate = (p: Publication) => {
    if (publication) {
      const data = {
        title: `${p?.title ?? publication?.title}`,
        description: `${quillValue ?? publication?.description}`,
        publishDate: `${pubDateRef?.current?.value ?? publication?.publishDate}`,
        publishType: `${selectedStatus?.key === undefined ? pubStatus[0].key : selectedStatus?.key}`,
        authorId: `${authed?.profileId ?? publication?.authorId}`,
      };

      console.log(data);

      axios
        .put(`${api}/publications/${publication?.publishId}`, data, {
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
          //nav(`/dashboard/publications`);

          window.location.reload();
        })
        .catch((err: AxiosError) => {
          setIsEdit(false);
          //setSelectedImage(null);
          console.log(err);
        });
    }
  };

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    if (!isEdit) {
      //alert("Enable Edit mode to remove Asset(S)");
    } else {
      setSelectedImage(null);
      window.location.reload();
    }
  };

  const onPubSubmit: SubmitHandler<Publication> = (d) => {
    if (pubId) {
      handleUpdate(d);
    } else {
      handleSave(d);
    }
  };

  const changeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = pubStatus.find((p) => p?.key === Number(e.target.value));

    setSelectedStatus(statusVal);
  };

  const handleAssetUpload = () => {
    setIsloading(true);
    setIsEdit(false);

    const asset = new FormData();

    if (publication) {
      if (selectedImage === null) {
        alert("No file chosen");
      } else {
        asset.append("_method", "POST");
        asset.append("title", `${assetTitleRef?.current?.value ?? ""}`);
        asset.append("publishId", `${publication?.publishId}`);
        asset.append("type", selectedImage?.type);
        if (selectedImage) {
          asset.append("doc", selectedImage);
        }

        axios
          .post(`${api}/publications/assets`, asset, {
            headers: {
              Authorization: `Bearer ${authed?.token}`,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res: AxiosResponse) => {
            const datas: PublicationAsset[] = Array.from(res?.data).flatMap(
              (d: any) => {
                const data: PublicationAsset = {
                  assetUrl: d?.assetUrl,
                  publishId: d?.publishId,
                  assetId: d?.assetId,
                };

                return [data];
              }
            );

            setPubAssets([...datas]);
            setSelectedImage(null);
            // setIsloading(false);
            window.location.reload();
          })
          .catch((err: AxiosError) => {
            console.warn(err?.message);

            setSelectedImage(null);

            setIsloading(false);

            window.location.reload();
          });
      }
    } else {
      alert("Create Publication before adding asset.");
    }
  };

  const removePubAsset = (assetId: string) => {
    if (!isEdit) {
      alert("Enable Edit mode to remove Asset(S)");
    } else {
      axios
        .delete(`${api}/publications/assets/${assetId}`, {
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

  const downloadPubAsset = (assetId: string) => {
    if (!isEdit) {
      alert("Enable Edit mode to download Asset(S)");
    } else {
      axios
        .get(`${api}/publications/assets/${pubId}/${assetId}`, {
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
    }
  };

  useEffect(() => {
    // setIsloading(true);
    if (!publication) {
      axios
        .get(`${api}/publications/${pubId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          //console.log(res?.data);

          const data: Publication = {
            publishId: `${res.data["publishId"]}`,
            title: `${res.data["title"]}`,
            description: `${res.data["description"]}`,
            publishType: Number(`${res.data["publishType"]}`),
            publishDate: res?.data["publishDate"],
          };

          const statusVal = pubStatus.find(
            (p) => p?.key === Number(data?.publishType)
          );

          setPublication(data);

          setSelectedStatus(statusVal);
          setQuillValue(res?.data["description"] ?? "");

          removeSelectedImage();

          setIsloading(false);
        });
    }
  }, [publication]);

  //fetch assets
  useEffect(() => {
    if (publication) {
      axios
        .get(`${api}/publications/assets/${publication?.publishId}`)
        .then((res: AxiosResponse) => {
          const datas: PublicationAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: PublicationAsset = {
                assetUrl: d?.assetUrl,
                assetId: d?.assetId,
                publishId: d?.publishId,
                title: d?.title,
                assetType: d?.assetType,
              };

              return [data];
            }
          );

          setPubAssets([...datas]);
          setIsloading(false);
        })
        .catch((err: AxiosError) => {
          console.warn(err?.response);
        });
    }
  }, [publication]);

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create New Publication" : ` ${isEdit ? " Edit" : "View"} Publication`}`}</h1>
      </div>

      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={`w-full flex justify-between items-center gap-5 `}>
          <div />

          <div className={` self-end flex justify-between items-center gap-5`}>
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
          <>
            <div className="w-full rounded-2xl flex p-5 justify-between gap-5 bg-slate-200">
              {/* Form */}
              <form
                className="w-full flex flex-col gap-5 overflow-y-scroll scrollbar-hide h-[70vh] p-5"
                onSubmit={handleSubmit(onPubSubmit)}
              >
                {/* Title */}
                <div className="w-full space-y-3">
                  <label htmlFor="Title">Title</label>
                  <Input
                    defaultValue={`${publication?.title ?? ""}`}
                    disabled={!isEdit ? true : false}
                    type="text"
                    {...register("title")}
                    placeholder={`${publication?.title ?? "Enter Title"}`}
                  />
                </div>

                {/* Editor */}
                <div className="w-full space-y-3">
                  <label htmlFor="description">Description</label>
                  {/* <Textarea
                disabled={!isEdit ? true : false}
                type="text"
                defaultValue={`${publication?.description ?? ""}`}
                {...register("description")}
                placeholder={`${publication?.description ?? "Enter Description"}`}
              /> */}
                  <ReactQuill
                    formats={Qformats}
                    modules={Qmodules}
                    placeholder={`${pubId ? publication?.description : "Enter description"}`}
                    theme="snow"
                    value={quillValue}
                    onChange={setQuillValue}
                  />
                </div>

                {/* Types */}

                <div className="w-full flex gap-5">
                  {/* Type Select */}
                  <div className="w-full flex flex-col space-y-3">
                    <label htmlFor="status">Publication Type Option</label>

                    <Select
                      className="max-w-xs"
                      defaultSelectedKeys={`${selectedStatus?.key ?? pubStatus[0].key}`}
                      isDisabled={!isEdit ? true : false}
                      label="Select Publication Type"
                      selectedKeys={`${selectedStatus?.key ?? pubStatus[0].key}`}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        changeStatus(e);
                      }}
                    >
                      {pubStatus.map((status) => (
                        <SelectItem key={`${status.key}`}>
                          {status.value}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  {/* Type Select End */}

                  {/* Publish Date */}
                  <div hidden className="w-full space-y-3">
                    <label htmlFor="dateStart">Publish Date</label>
                    <Input
                      ref={pubDateRef}
                      defaultValue={publication?.publishDate ?? ""}
                      isReadOnly={!isEdit ? true : false}
                      type="date"
                    />
                  </div>
                  {/* Publish Date End */}
                </div>

                {/* Actions */}
                <div className="w-full space-y-3 flex items-center justify-end">
                  <Button
                    color={!isEdit ? "default" : "primary"}
                    disabled={!isEdit ? true : false}
                    type="submit"
                  >
                    {pubId === null ? "Save" : "Update"}
                  </Button>
                </div>
              </form>

              {/* Form End */}

              {/* Assets */}
              <div className="w-full flex flex-col gap-5 overflow-hidden h-[70vh] p-3">
                <div className={`w-full flex justify-between items-center`}>
                  <div className="flex flex-col gap-3">
                    <Input
                      ref={assetTitleRef}
                      disabled={publication === null}
                      placeholder={`Asset Title`}
                      type="text"
                    />

                    <div className="p-2 flex items-center">
                      <input
                        accept="document/*"
                        disabled={!isEdit ? true : false}
                        type="file"
                        onChange={(e) => {
                          onChangePic(e);
                        }}
                      />

                      <span className="flex items-center p-1 hover:bg-default-400 hover:rounded-full">
                        <GoTrash
                          className=" text-danger-500"
                          size={20}
                          onClick={removeSelectedImage}
                        />
                      </span>
                    </div>
                  </div>

                  <Button
                    color={`${publication === null ? "default" : "primary"}`}
                    disabled={publication === null}
                    onPress={() => {
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

                <div
                  className={`w-full overflow-y-scroll scrollbar-hide h-[50vh] p-2`}
                >
                  {pubAssets === null || pubAssets?.length === 0 ? (
                    <>
                      <p className=" text-center ">No Asset(s)</p>
                    </>
                  ) : (
                    <div className={`w-full flex gap-3`}>
                      {pubAssets?.flatMap((d: PublicationAsset) => (
                        <div
                          key={d?.assetId}
                          className={`shadow rounded-xl p-2 flex flex-col justify-between items-center gap-1 P-2`}
                        >
                          {/* <Image width={150} src={d?.assetUrl} /> */}

                          <GoFile size={20} />

                          <h1>{d?.title}</h1>

                          <div className="flex justify-between items-center">
                            <span className="flex items-center p-2 hover:bg-default-400 hover:rounded-full">
                              <GoDownload
                                className=" text-primary-500"
                                size={20}
                                onClick={() => {
                                  downloadPubAsset(`${d?.assetId}`);
                                }}
                              />
                            </span>

                            <span className="flex items-center p-2 hover:bg-default-400 hover:rounded-full">
                              <GoTrash
                                className=" text-danger-500"
                                size={20}
                                onClick={() => {
                                  removePubAsset(`${d?.assetId}`);
                                }}
                              />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Assets End */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
