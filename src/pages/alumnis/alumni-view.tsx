import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alumni } from "../dashboard/alumnis/dash-alumni-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Profile } from "../dashboard/profiles/dash-profiles-list";
import { AuthRole } from "@/types";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { GoArrowLeft } from "react-icons/go";

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

  const setRoleName = (role: AuthRole) => {
    switch (role) {
      case AuthRole.Alumni:
        return "Alumni";
      default:
        return "Alumni";
    }
  };

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
            avatarUrl: res.data?.alumniProfile?.avatarUrl,
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
            navigate("/alumnis");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>
      <Divider />

      <div className="w-full flex flex-col">
      </div>
    </div>
  );
}
