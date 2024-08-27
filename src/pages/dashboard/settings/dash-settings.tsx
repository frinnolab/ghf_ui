import { siteConfig } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
import { Divider, Image, Input, Textarea } from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  //const fnameRef = useRef<HTMLInputElement>(null);
  const compnameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobiRef = useRef<HTMLInputElement>(null);
  const mobi2Ref = useRef<HTMLInputElement>(null);
  const mobi3Ref = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const visionRef = useRef<HTMLTextAreaElement>(null);
  const missionRef = useRef<HTMLTextAreaElement>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const saveCompanyInfo = () => {
    if (companyInfo === null) {
      alert("Add/Update company info");
    } else {
      const data = {
        "id":`${companyInfo?.id}`,
        "companyName":
          companyInfo?.companyName === null
            ? compnameRef?.current?.value
            : companyInfo?.companyName,
        "companyAddress":
          companyInfo?.companyAddress === null
            ? addressRef?.current?.value
            : companyInfo?.companyAddress,
        "companyEmail":
          companyInfo?.companyEmail === null
            ? emailRef?.current?.value
            : companyInfo?.companyEmail,
        "companyMobile":
          companyInfo?.companyMobile === null
            ? mobiRef?.current?.value
            : companyInfo?.companyMobile,
        "companyMobileAltenate":
          companyInfo?.companyMobileAltenate === null
            ? mobi2Ref?.current?.value
            : companyInfo?.companyMobileAltenate,
        "companyMobileTelephone":
          companyInfo?.companyMobileTelephone === null
            ? mobi3Ref?.current?.value
            : companyInfo?.companyMobileTelephone,
        "companyBiography":
          companyInfo?.companyBiography === null
            ? bioRef?.current?.value
            : companyInfo?.companyBiography,
        "companyMission":
          companyInfo?.companyMission === null
            ? missionRef?.current?.value
            : companyInfo?.companyMission,
        "companyVision":
          companyInfo?.companyVision === null
            ? visionRef?.current?.value
            : companyInfo?.companyVision,
      };

      //#region 
      // {
      //   companyName: 'GREAT HOPE FOUNDATION',
      //   companyAddress: 'P.O.BOX 2466 DSM',
      //   companyEmail: 'greathopefoundation@gmail.com',
      //   companyMobile: '',
      //   companyMobileAltenate: '',
      //   companyMobileTelephone: '02214245141',
      //   companyBiography: 'Test Biography info',
      //   companyMission: 'Test Mission info',
      //   companyVision: ''
      // }
      //#endregion
      
      console.log(data);

      axios
        .put(`${api}/settings/${authed?.profileId}/companyinfo`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "application/jspn",
          },
        })
        .then((res: AxiosResponse) => {
          if (res) {
            console.log(res?.data);
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
          window.location.reload();
        });
    }
  };

  useEffect(() => {
    if (companyInfo === null) {
      axios
        .get(`${api}/settings/companyinfo`)
        .then((res: AxiosResponse) => {
          console.log(res.data);

          setCompanyInfo(res?.data);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
          setCompanyInfo(null);
        });
    }
  }, [companyInfo]);

  return (
    <DashboardLayout>
      <div className="w-full p-5 flex flex-col">
        <h1 className={`text-2xl`}>Manage Settings</h1>
        <Divider />

        <div className="w-full flex justify-between ">
          <div className="w-full flex flex-col gap-5 h-[50vh] p-3 overflow-y-scroll">
            <h1 className="text-xl">Company Info</h1>

            {/* Name */}
            <div className="flex gap-10">
              <div className="w-full space-y-3">
                <label htmlFor="compname">Company name</label>
                <Input
                  type="text"
                  ref={compnameRef}
                  placeholder={companyInfo?.companyName ?? "Enter Company name"}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="address">Address</label>
                <Input
                  type="text"
                  ref={addressRef}
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
                  ref={emailRef}
                  placeholder={
                    companyInfo?.companyEmail ?? "Enter Company Email"
                  }
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="vision">Mobile</label>
                <Input
                  type="text"
                  ref={mobiRef}
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
                  ref={mobi2Ref}
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
                  ref={mobi3Ref}
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
                ref={bioRef}
                placeholder={`${"Enter Biography info"}`}
              ></Textarea>
            </div>

            <Divider />

            <h1>Mission/Vision Info</h1>
            {/* Fname & Lname */}
            <div className="w-full space-y-3">
              <label htmlFor="mission">Mission</label>
              <Textarea
                ref={missionRef}
                placeholder={`${companyInfo?.companyMission ?? "Enter Mission info"}`}
              ></Textarea>
            </div>

            <div className="w-full space-y-3">
              <label htmlFor="vision">Vision Info</label>
              <Textarea
                ref={visionRef}
                placeholder={`${companyInfo?.companyVision ?? "Enter Vision Info"}`}
              ></Textarea>
            </div>
            <div>
              {/* <h1>Actions</h1> */}
              <Button variant="solid" color="primary" onClick={saveCompanyInfo}>
                Save
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col p-5">
            <CompanyAssetsUi company={companyInfo} />
          </div>
        </div>
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

      if (selectedImage) {
        data.append("imageAsset", selectedImage);
      }

      if (selectedVideo) {
        data.append("videoAsset", selectedVideo);
      }

      data.append("_METHOD", "PUT");

      axios
        .post(`${api}/settings/${authed?.profileId}/companyassets`, data, {
          headers: {
            Authorization: `Bearer ${authed?.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse) => {
          if (res) {
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          if (err) {
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
