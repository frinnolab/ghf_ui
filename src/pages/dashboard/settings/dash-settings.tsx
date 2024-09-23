import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
import { Divider, Image, Input, Spinner, Textarea } from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { GoTrash } from "react-icons/go";

export type CompanyInfo = {
  id?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyMobile?: string;
  companyMobileTelephone?: string;
  companyMobileAltenate?: string;
  companyBiography?: string;
  companyMission?: string;
  companyVision?: string;
  introVideoUrl?: string;
  logoUrl?: string;
};

export default function DashSettingsPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<CompanyInfo>();

  const onSubmit: SubmitHandler<CompanyInfo> = (data: CompanyInfo) => {
    storeCompanyInfo(data);
  };

  const storeCompanyInfo = (d: CompanyInfo) => {
    const data = {
      id: `${companyInfo?.id}`,
      companyName: d?.companyName,
      companyAddress: d?.companyAddress,
      companyEmail: d?.companyEmail,
      companyMobile: d?.companyMobile,
      companyMobileAltenate: d?.companyMobileAltenate,
      companyMobileTelephone: d?.companyMobileTelephone,
      companyBiography: d?.companyBiography,
      companyMission: d?.companyMission,
      companyVision: d?.companyVision,
    };

    onUpdateInfo(data);
  };

  const onUpdateInfo = (data: any) => {
    axios
      .put(`${api}/settings/companyinfo/${data?.id}`, data, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          console.log(res?.data);
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        window.location.reload();
      });
  };

  useEffect(() => {
    if (companyInfo === null) {
      setIsloading(true);

      axios
        .get(`${api}/settings/companyinfo`)
        .then((res: AxiosResponse) => {
          console.log(res.data);

          setCompanyInfo(res?.data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
          setCompanyInfo(null);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [companyInfo]);

  return (
    <DashboardLayout>
      <div className="w-full p-5 flex flex-col">
        <h1 className={`text-2xl`}>Manage Settings</h1>
        <Divider />
        {isLoading ? (
          <>
            <Spinner
              size="lg"
              className=" flex justify-center "
              label="Loading..."
              color="primary"
            />
          </>
        ) : (
          <div className="w-full flex justify-between ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-5 h-[50vh] p-3 overflow-y-scroll"
            >
              <h1 className="text-xl">Company Info</h1>

              {/* Name */}
              <div className="flex gap-10">
                <div className="w-full space-y-3">
                  <label htmlFor="compname">Company name</label>
                  <Input
                    type="text"
                    defaultValue={`${companyInfo?.companyName ?? ""}`}
                    {...register("companyName")}
                    placeholder={
                      companyInfo?.companyName ?? "Enter Company name"
                    }
                  />
                </div>

                <div className="w-full space-y-3">
                  <label htmlFor="address">Post Office Address</label>
                  <Input
                    type="text"
                    defaultValue={`${companyInfo?.companyAddress ?? ""}`}
                    {...register("companyAddress")}
                    placeholder={companyInfo?.companyAddress ?? "Enter Address"}
                  />
                </div>
              </div>
              <Divider />

              <h1>Contact Info</h1>
              {/*  */}
              <div className="flex gap-10">
                <div className="w-full space-y-3">
                  <label htmlFor="cemail">Email</label>
                  <Input
                    type="email"
                    defaultValue={`${companyInfo?.companyEmail ?? ""}`}
                    {...register("companyEmail")}
                    placeholder={
                      companyInfo?.companyEmail ?? "Enter Company Email"
                    }
                  />
                </div>

                <div className="w-full space-y-3">
                  <label htmlFor="vision">Mobile</label>
                  <Input
                    type="text"
                    defaultValue={`${companyInfo?.companyMobile ?? ""}`}
                    {...register("companyMobile")}
                    placeholder={
                      companyInfo?.companyMobile ?? "Enter Company mobile"
                    }
                  />
                </div>
              </div>
              {/* Altenate Mobiles */}
              <div className="flex gap-10">
                <div className="w-full space-y-3">
                  <label htmlFor="mobi2">Telephone</label>
                  <Input
                    type="text"
                    defaultValue={`${companyInfo?.companyMobileTelephone ?? ""}`}
                    {...register("companyMobileTelephone")}
                    placeholder={
                      companyInfo?.companyMobileTelephone ??
                      "Enter Telephone mobile"
                    }
                  />
                </div>
                <div className="w-full space-y-3">
                  <label htmlFor="mobi3">Altenate Mobile</label>
                  <Input
                    type="text"
                    defaultValue={`${companyInfo?.companyMobileAltenate ?? ""}`}
                    {...register("companyMobileAltenate")}
                    placeholder={
                      companyInfo?.companyMobileAltenate ??
                      "Enter Altenate mobile"
                    }
                  />
                </div>
              </div>

              <Divider />
              <div className="w-full space-y-3">
                <label htmlFor="bio">Biography</label>
                <Textarea
                  defaultValue={`${companyInfo?.companyBiography ?? ""}`}
                  {...register("companyBiography")}
                  placeholder={`${companyInfo?.companyBiography ?? "Enter Biography info"}`}
                ></Textarea>
              </div>

              <Divider />

              <h1>Mission/Vision Info</h1>
              {/* Fname & Lname */}
              <div className="w-full space-y-3">
                <label htmlFor="mission">Mission</label>
                <Textarea
                  defaultValue={`${companyInfo?.companyMission ?? ""}`}
                  {...register("companyMission")}
                  placeholder={`${companyInfo?.companyMission ?? "Enter Mission info"}`}
                ></Textarea>
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="vision">Vision Info</label>
                <Textarea
                  defaultValue={`${companyInfo?.companyVision ?? ""}`}
                  {...register("companyVision")}
                  placeholder={`${companyInfo?.companyVision ?? "Enter Vision Info"}`}
                ></Textarea>
              </div>
              <div>
                {/* <h1>Actions</h1> */}
                <Button variant="solid" color="primary" type="submit">
                  Save
                </Button>
              </div>
            </form>

            <div className="w-full flex flex-col p-5">
              <CompanyAssetsUi company={companyInfo} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function CompanyAssetsUi({ company }: { company: CompanyInfo | null }) {
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onChangeVideo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedVideo(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  const removeSelectedVideo = () => {
    setSelectedVideo(null);
    window.location.reload();
  };

  const handleAsetUploads = () => {
    if (company === null) {
      alert("Add Company info to upload asset(s)");
    } else {
      const data = new FormData();
      data.append("_method", "PUT");

      if (selectedImage) {
        data.append("imageAsset", selectedImage);
      }

      if (selectedVideo) {
        data.append("videoAsset", selectedVideo);
      }

      console.log(company?.id);

      axios
        .post(`${api}/settings/companyassets/${company?.id}`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          if (res) {
            console.log(res?.data);

            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          if (err) {
            console.log(err.response);

            window.location.reload();
          }
        });
    }
  };
  return (
    <div className="flex flex-col items-center rounded-xl  h-[40dvh] gap-5">
      <div className={`w-full flex items-center justify-between`}>
        <h1>Manage Assets</h1>

        <Button
          disabled={selectedImage || selectedVideo ? false : true}
          variant="solid"
          color={selectedImage || selectedVideo ? "primary" : "default"}
          onClick={handleAsetUploads}
        >
          Upload Asset(s)
        </Button>
      </div>
      <Divider />

      {/* Assets */}
      <div className={`w-full flex justify-between gap-5`}>
        {/* Image Asset */}
        <div className={`w-full border rounded-xl p-2`}>
          <h1>Main Logo</h1>

          {selectedImage ? (
            <div className={`w-full flex items-center justify-center`}>
              <Image
                className={`h-[25vh] object-cover self-center`}
                isZoomed
                src={URL.createObjectURL(selectedImage)}
              />
            </div>
          ) : (
            <div className={`w-full flex items-center justify-center`}>
              <Image
                className={`h-[25vh] object-cover self-center`}
                src={
                  company?.logoUrl === null
                    ? siteConfig.staticAssets.staticLogo
                    : company?.logoUrl
                }
              />
            </div>
          )}

          <div className="p-3 flex items-center">
            <input
              accept="image/*"
              ref={thumbRef}
              type="file"
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

        {/* Image Asset End*/}

        {/* Video Asset */}
        <div className={`w-full border rounded-xl p-2`}>
          <h1>Main Video</h1>

          {selectedVideo ? (
            <>
              <video
                className={`h-[25vh] object-cover`}
                autoPlay={false}
                muted
                controls
                src={URL.createObjectURL(selectedVideo)}
              />
            </>
          ) : (
            <>
              <video
                autoPlay={false}
                muted
                controls
                className={`h-[25vh] object-cover`}
                src={
                  company?.introVideoUrl === null
                    ? siteConfig.staticAssets.staticIntroVideo
                    : company?.introVideoUrl
                }
              />
            </>
          )}

          <div className="p-3 flex items-center">
            <input
              accept="video/*"
              ref={thumbRef}
              type="file"
              onChange={(e) => {
                onChangeVideo(e);
              }}
            />

            <span className="flex items-center p-1 hover:bg-default-200 hover:rounded-full">
              <GoTrash
                size={20}
                className=" text-danger-500"
                onClick={removeSelectedVideo}
              />
            </span>
          </div>
        </div>

        {/* Video Asset End*/}
      </div>
    </div>
  );
}
