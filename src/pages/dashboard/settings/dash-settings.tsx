import { siteConfig } from "@/config/site";
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
  companyBiography?: string;
  companyMission?: string;
  companyVision?: string;
  introVideoUrl?: string;
  logoUrl?: string;
};

export default function DashSettingsPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  //const fnameRef = useRef<HTMLInputElement>(null);
  const lnameRef = useRef<HTMLInputElement>(null);
  const compnameRef = useRef<HTMLInputElement>(null);
  const whoisRef = useRef<HTMLInputElement>(null);
  const visionRef = useRef<HTMLTextAreaElement>(null);
  const missionRef = useRef<HTMLTextAreaElement>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

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
            <h1>Company Info</h1>

            {/* Fname & Lname */}
            <div className="flex gap-10">
              <div className="w-full space-y-3">
                <label htmlFor="compname">Company name</label>
                <Input
                  type="text"
                  ref={compnameRef}
                  placeholder={`${companyInfo?.companyName ?? "Enter Company name"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="address">Address</label>
                <Input
                  type="text"
                  ref={whoisRef}
                  placeholder={`${companyInfo?.companyAddress ?? "Enter Address"}`}
                />
              </div>
            </div>
            <Divider />

            <h1>Contact Info</h1>
            {/* Fname & Lname */}
            <div className="flex gap-10">
              <div className="w-full space-y-3">
                <label htmlFor="cemail">Email</label>
                <Input
                  type="email"
                  ref={lnameRef}
                  placeholder={`${companyInfo?.companyEmail ?? "Enter Company Email"}`}
                />
              </div>

              <div className="w-full space-y-3">
                <label htmlFor="vision">Mobile</label>
                <Input
                  type="text"
                  ref={lnameRef}
                  placeholder={`${companyInfo?.companyMobile ?? "Enter Company mobile"}`}
                />
              </div>
            </div>

            <Divider />
            <div className="w-full space-y-3">
              <label htmlFor="bio">Biography</label>
              <Textarea
                ref={missionRef}
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

            <Divider />
            <div className="w-full flex flex-col">
              <h1>Intro Video</h1>
            </div>
            <Divider />
            <div>
              {/* <h1>Actions</h1> */}
              <Button variant="solid" color="primary">
                Save
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col p-5">
            <CompanyLogoUi company={companyInfo ?? null} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function CompanyLogoUi({ company }: { company: CompanyInfo | null }) {
  const thumbRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  //const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const onChangePic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    window.location.reload();
  };

  const removeSelectedVideo = () => {
    //setSelectedVideo(null);
    window.location.reload();
  };
  return (
    <div className="flex flex-col items-center rounded-xl p-3 h-[40dvh] gap-5">
      <div>
        <h1>Manage Assets</h1>
      </div>
      <Divider />

      {/* Assets */}
      <div className={`w-full flex justify-between gap-2`}>
        {/* Image Asset */}
        <div className={`w-full border rounded-xl p-2`}>
          <h1>Main Logo</h1>
          {selectedImage ? (
            <>
              <Image
                className={`h-[25vh] object-cover`}
                isZoomed
                src={URL.createObjectURL(selectedImage)}
              />
            </>
          ) : (
            <>
              <Image
                className={`h-[25vh] object-cover`}
                isZoomed
                src={`${company?.logoUrl !== "" ? company?.logoUrl : siteConfig.footerTexts.footerImage}`}
              />
            </>
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

          {selectedImage ? (
            <>
              <Image
                className={`h-[25vh] object-cover`}
                isZoomed
                src={URL.createObjectURL(selectedImage)}
              />
            </>
          ) : (
            <>
              <Image
                className={`h-[25vh] object-cover`}
                isZoomed
                src={`${company?.logoUrl !== "" ? company?.logoUrl : siteConfig.footerTexts.footerImage}`}
              />
            </>
          )}

          <div className="p-3 flex items-center">
            <input
              accept="video/*"
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
