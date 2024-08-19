import useAuthedProfile from "@/hooks/use-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Team, TeamMember } from "./dash-teams";
import { Button } from "@nextui-org/button";
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { GoArrowLeft, GoEye, GoPencil, GoTrash, GoX } from "react-icons/go";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Profile } from "../profiles/dash-profiles-list";
import { Input } from "@nextui-org/input";

export type profileSelect = {
  key: string;
  value: Profile;
};

export default function DashboardTeamPage() {
  const columns = ["Name", "Position", "Team Position", "Actions"];
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [, setValue] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [members, setMembers] = useState<profileSelect[]>([]);
  const [tmembers, setTMembers] = useState<TeamMember[]>([]);
  const [hasMembers, setHasMembers] = useState<boolean>(false);
  const actionTypes = ["detail", "edit", "delete"];

  const [teamId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [team, setTeam] = useState<Team | null>(null);

  const teamPos = useRef<HTMLInputElement | null>(null);
  const handleBack = () => nav("/dashboard/teams");

  const onMemberChange = (member: profileSelect) => {
    setSelectedMember(member?.value);
  };

  const onInputChange = (value: string) => {
    if (value !== "") {
      setValue(value);
      axios
        .get(`${api}/profiles?email=${value}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const data: profileSelect[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const p: profileSelect = {
                key: d?.profileId,
                value: d,
              };

              return [p];
            }
          );

          setMembers([...data]);
          setValue("");

          console.log(data);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const addToTeam = () => {
    if (selectedMember) {
      const data: TeamMember = {
        teamId: team?.teamId,
        teamPosition: `${teamPos?.current?.value.toUpperCase() ?? ""}`,
        member: selectedMember,
        memberId: `${selectedMember?.profileId}`,
      };

      console.log(data);

      axios
        .post(`${api}/teams/members`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res?.data);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  };

  const handleSelectedRow = (p: TeamMember) => {
    if (p?.member) {
      setSelectedMember(p?.member);

      //setTeamTeamPos(`${p?.teamPosition}`);
    }
  };

  const handleAction = (p: TeamMember, action: string) => {
    switch (action) {
      case actionTypes[0]:
        //Detail
        handleSelectedRow(p);
        break;
      case actionTypes[1]:
        handleSelectedRow(p);
        //Detail
        break;
      case actionTypes[2]:
        handleDelete(p);
        break;
    }
  };

  const handleDelete = (b: TeamMember) => {
    alert(`Deleting ${b?.memberId}`);
    // if (authed?.role == AuthRole.User) {
    //   alert(HttpStatusCode.Unauthorized);
    // }

    // axios
    //   .delete(`${api}/teams/${b?.teamId}`, {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: `Bearer ${authed?.token}`,
    //     },
    //   })
    //   .then(() => {
    //     window.location.reload();
    //   })
    //   .catch((err: AxiosError) => {
    //     console.log(err.response?.data ?? err.response?.statusText);
    //   });
  };

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

  useEffect(() => {
    if (!hasMembers) {
      axios
        .get(`${api}/teams/members/${teamId}`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const datas: TeamMember[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: TeamMember = {
                memberId: d?.memberId,
                member: d?.member,
                teamId: d?.teamId,
                teamPosition: d?.teamPosition,
              };

              return [data];
            }
          );

          setTMembers([...datas]);
          setHasMembers(true);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [hasMembers]);

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
            <h1 className="text-2xl">
              {team?.name} ({team?.totalMembers})
            </h1>
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
        <div className="w-full rounded-2xl bg-slate-200 shadow flex justify-between p-5 h-[75dvh]">
          <div className={`w-full border flex flex-col gap-3 p-3`}>
            <h1 className={`text-xl`}>Manage Team Member</h1>
            {/* <h1>Search/Add member</h1> */}
            <div className="w-full flex  flex-col gap-2">
              <Autocomplete
                label="Search a profile"
                variant="flat"
                disabled={isEdit ? true : false}
                defaultItems={members}
                endContent={
                  <GoX
                    className=" cursor-pointer "
                    onClick={() => {
                      setSelectedMember(null);
                      setMembers([]);
                      setValue("");
                      close();
                    }}
                  />
                }
                className="w-full"
                allowsCustomValue={true}
                placeholder={`${selectedMember ? selectedMember?.email : "Enter profile email"}`}
                onSelectionChange={(e) => {
                  const member = members.filter((m) => m?.key === e)[0];

                  if (member) {
                    onMemberChange(member);

                    setValue(`${member?.value?.email}`);
                  }
                }}
                onInputChange={onInputChange}
                allowsEmptyCollection={false}
              >
                {(item) => (
                  <AutocompleteItem key={`${item.key}`}>
                    {/* {item?.value?.email} */}
                    <div className={`flex flex-col gap-1`}>
                      <label className=" text-xs" htmlFor="email">
                        {item?.value?.email}
                      </label>

                      <h1 className={` text-sm `}>{item?.value?.firstname}</h1>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <p className="mt-1 text-small text-default-500">
                Current selected member: {selectedMember?.email}
              </p>
              {/* <p className="text-small text-default-500">
                Current input text: {value}
              </p> */}

              {/* Form */}
              <div className={`w-full flex flex-col gap-2`}>
                <div className={`flex flex-col gap-1`}>
                  <label htmlFor="fName">Firstname</label>
                  <Input
                    disabled
                    placeholder={`${selectedMember ? selectedMember?.firstname : "Member firstname"}`}
                  />
                </div>

                <div className={`flex flex-col gap-1`}>
                  <label htmlFor="lName">Lastname</label>
                  <Input
                    disabled
                    placeholder={`${selectedMember ? selectedMember?.lastname : "Member lastname"}`}
                  />
                </div>

                <div className={`flex flex-col gap-1`}>
                  <label htmlFor="pName">Position</label>
                  <Input
                    disabled
                    placeholder={`${selectedMember ? selectedMember?.position : "Member position"}`}
                  />
                </div>

                <div className={`flex flex-col gap-1`}>
                  <label htmlFor="pName">Team member position</label>
                  <Input
                    disabled={!isEdit}
                    ref={teamPos}
                    placeholder={`${"Enter team position"}`}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-5">
                  <label htmlFor=""></label>
                  <Button
                    color={isEdit ? "primary" : "default"}
                    disabled={!isEdit ? true : false}
                    onClick={() => {
                      if (selectedMember) {
                        addToTeam();
                      } else {
                        alert("No profile to add to Team.");
                      }
                    }}
                  >
                    {"Add member"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={`w-full border flex flex-col p-5 gap-3`}>
            <h1 className={`text-xl`}>Team members</h1>

            <Table fullWidth isStriped removeWrapper>
              <TableHeader>
                {columns.map((column) => (
                  <TableColumn key={column}>{column}</TableColumn>
                ))}
              </TableHeader>

              <TableBody
                emptyContent="No members at the moment"
                items={tmembers}
              >
                {tmembers.map((team) => (
                  <TableRow className="w-full" key={team?.teamId}>
                    <TableCell onClick={() => handleSelectedRow(team)}>
                      {team?.member?.firstname}
                    </TableCell>
                    <TableCell onClick={() => handleSelectedRow(team)}>
                      {team?.member?.position}
                    </TableCell>
                    <TableCell onClick={() => handleSelectedRow(team)}>
                      {team?.teamPosition}
                    </TableCell>
                    <TableCell>
                      <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Delete">
                          <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                            <GoTrash
                              onClick={() => handleAction(team, actionTypes[2])}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
