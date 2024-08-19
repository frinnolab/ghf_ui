import useAuthedProfile from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Team } from "./dash-teams";
import { Button } from "@nextui-org/button";
import { Divider, Switch } from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil } from "react-icons/go";
import axios, { AxiosResponse } from "axios";

export default function DashboardTeamPage() {
  const api = `${import.meta.env.VITE_API_URL}`;

  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [teamId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [team, setTeam] = useState<Team | null>(null);
  const handleBack = () => nav("/dashboard/teams");

  useEffect(() => {
    if (teamId) {
      axios
        .get(`${api}/teams/${teamId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Team = {
            teamId: `${res.data["teamId"]}`,
            name: `${res.data["name"]}`,
            totalMembers: `${res.data["totalMembers"]}`,
          };

          setTeam(data);
        });
    }
  }, [teamId]);

  return (
    <div className="w-full">
      {/* Main Actions */}
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create" : ` ${isEdit ? " Manage" : "View"} Team`}`}</h1>
      </div>
      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={` flex justify-between items-center gap-5 `}>
          <div className={``}>
            <h1 className="text-2xl">{team?.name}</h1>
          </div>

          <div className={`flex items-center gap-3`}>
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
        <div className="w-full rounded-2xl bg-slate-200 shadow flex p-5 justify-between h-[75dvh]">
          <h1>Content</h1>
        </div>
      </div>
    </div>
  );
}
