import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alumni } from "../dashboard/alumnis/dash-alumni-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Profile } from "../dashboard/profiles/dash-profiles-list";
import { AuthRole } from "@/types";
import { Button } from "@nextui-org/button";
import { Avatar, Divider } from "@nextui-org/react";
import { GoArrowLeft } from "react-icons/go";
import { siteConfig } from "@/config/site";

export default function AlumniView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [alumniId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }
    return null;
  });

  const [alumni, setAlumni] = useState<Alumni | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (alumniId) {
      axios
        .get(`${api}/alumnis/${alumniId}`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const profData: Profile = {
            profileId: res.data?.alumniProfile?.profileId,
            firstname: res.data?.alumniProfile?.firstname,
            lastname: res.data?.alumniProfile?.lastname,
            email: res.data?.alumniProfile?.email,
            role: Number(res.data.alumniProfile?.roleType) ?? AuthRole.Alumni,
            avatarUrl: `${res.data?.alumniProfile?.avatarUrl ?? ""}`,
            position: res.data?.alumniProfile?.position,
          };

          const data: Alumni = {
            age: Number(res?.data?.age),
            alumniId: `${res?.data?.alumniId}`,
            profileId: `${res?.data?.profileId}`,
            participationSchool: `${res?.data?.participationSchool}`,
            participationYear: res?.data?.participationYear,
            story: res?.data?.story,
            alumniProfile: profData,
          };

          setAlumni(data);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [alumniId]);

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/alumni");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>
      <Divider />

      <div className="w-full flex flex-col">
        <div className=" w-full flex gap-10 justify-between p-10">
          <div className=" w-full space-y-3 ">
            <h1 className=" text-3xl font-semibold ">Alumni Profile{""}</h1>

            {/* Impact */}
            <div className=" space-y-3 w-full">
              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1 className="text-lg">Fullname</h1>
                <h1 className="text-2xl">
                  {alumni?.alumniProfile?.firstname}{" "}
                  {alumni?.alumniProfile?.lastname}
                </h1>
              </div>

              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1 className="text-lg">Email</h1>
                <h1 className="text-2xl">{alumni?.alumniProfile?.email}</h1>
              </div>

              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1 className="text-lg">Participation School</h1>
                <h1 className="text-2xl">{alumni?.participationSchool}</h1>
              </div>

              <div className="w-full text-xl p-5 bg-default-200 rounded-2xl ">
                <h1 className="text-lg">Participation Year</h1>
                <h1 className="text-2xl">{alumni?.participationYear}</h1>
              </div>

              <div
                className={`w-full text-xl p-5 bg-default-200 rounded-2xl ${alumni?.currenctOccupation ? "" : "hidden"}`}
              >
                <h1 className="text-lg">Occupation</h1>
                <h1 className="text-2xl">{alumni?.currenctOccupation}</h1>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center items-center">
            <Avatar
              isBordered
              radius="full"
              className={` w-[35%] h-[50%] `}
              src={`${
                alumni?.alumniProfile?.avatarUrl === "" || null
                  ? siteConfig?.staticAssets?.staticLogo
                  : alumni?.alumniProfile?.avatarUrl
              }`}
            />
          </div>
        </div>

        {/* Contents */}
        <div className="w-full flex flex-col gap-5 p-10">
          {/* Description */}
          <div className=" space-y-3">
            <h1 className=" text-2xl ">Impact Story</h1>
            <Divider />
            <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {alumni?.story}
            </p>
          </div>
        </div>
        {/* Contents End */}
      </div>
    </div>
  );
}
