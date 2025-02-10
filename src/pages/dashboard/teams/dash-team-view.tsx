import useAuthedProfile from "@/hooks/use-auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Team, TeamMember } from "./dash-teams";
import { Button } from "@nextui-org/button";
import {
  Autocomplete,
  AutocompleteItem,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  GoArrowLeft,
  GoEye,
  GoLock,
  GoPencil,
  GoTrash,
  GoUnlock,
  GoX,
} from "react-icons/go";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { Input } from "@nextui-org/input";
import { SubmitHandler, useForm } from "react-hook-form";

import { Profile } from "../profiles/dash-profiles-list";

import { AuthRole } from "@/types";

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
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  const [isMainBoard, setIsMainBoard] = useState<boolean>(false);
  //const [isMainBoard, setIsMainBoard] = useState<boolean>(false);
  const [, setValue] = useState<string>("");
  //const [, setValue] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [members, setMembers] = useState<profileSelect[]>([]);
  const [tmembers, setTMembers] = useState<TeamMember[]>([]);
  const [hasMembers, setHasMembers] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const actionTypes = ["detail", "edit", "delete"];

  const { register, handleSubmit } = useForm<Team>();

  //Team Manage Modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

    const availableMember =
      tmembers.find((p) => p?.member?.profileId === member?.value?.profileId) ??
      null;

    if (availableMember) {
      setIsAvailable(true);
    }
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
    setIsloading(true);
    if (selectedMember) {
      const data: TeamMember = {
        teamId: team?.teamId,
        teamPosition: `${teamPos?.current?.value.toUpperCase() ?? ""}`,
        member: selectedMember,
        memberId: `${selectedMember?.profileId}`,
        isTeamMember: isTeamMember,
      };

      //Update Team Member
      if (isAvailable) {
        const availableMember =
          tmembers.find((p) => p?.member?.profileId === data?.memberId) ?? null;

        if (availableMember) {
          const data2: TeamMember = {
            teamId: team?.teamId,
            teamMemberId: availableMember?.teamMemberId,
            teamPosition: `${teamPos?.current?.value.toUpperCase() ?? ""}`,
            member: selectedMember,
            memberId: `${selectedMember?.profileId}`,
            isTeamMember: isTeamMember,
          };

          axios
            .put(`${api}/teams/members`, data2, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${authed?.token}`,
              },
            })
            .then(() => {
              window.location.reload();
            })
            .catch((err: AxiosError) => {
              console.error(err.response);

              // if (HttpStatusCode.Found) {
              //   alert("Member already exists in team!.");
              // }
            });
        }
      } else {
        //Add new Member to Team
        axios
          .post(`${api}/teams/members`, data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${authed?.token}`,
            },
          })
          .then(() => {
            window.location.reload();
          })
          .catch((err: AxiosError) => {
            console.error(err.response);

            if (HttpStatusCode.Found) {
              alert("Member already exists in team!.");
            }
          });
      }
    }
  };

  const handleSelectedRow = (p: TeamMember) => {
    if (p?.member) {
      setSelectedMember(p?.member);
      setIsTeamMember(p?.isTeamMember ?? false);
    }

    const availableMember =
      tmembers.find((p) => p?.member?.profileId === p?.memberId) ?? null;

    if (availableMember) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
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

    setIsloading(true);
    if (authed?.role !== AuthRole.SuperAdmin) {
      alert(`You're not authorised:${HttpStatusCode.Unauthorized}`);
      setIsloading(false);
    }else{
      axios
        .delete(`${api}/teams/members/${b?.teamId}/${b?.memberId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.log(err.response?.data ?? err.response?.statusText);
        });
    }

  };

  const onUpdateTeam: SubmitHandler<Team> = (d: Team) => {
    setIsloading(true);
    const data = {
      name: d?.name ?? team?.name,
      teamId: team?.teamId,
      isMainBoard: isMainBoard,
      profileId: `${authed?.profileId}`,
    };

    axios
      .put(`${api}/teams/${team?.teamId}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const onSetMainBoardTeam = () => {
    axios
      .get(`${api}/teams/main`)
      .then((res: AxiosResponse) => {
        if (HttpStatusCode.Ok) {
          if (res?.data["teamId"] === team?.teamId) {
            alert("Team already Main Board.");
            setIsMainBoard(true);
          }
        }

        if (HttpStatusCode.NoContent) {
          alert("Main Board Set. Update to Save changes.");
          //Update Team name. Set isMainBoard to false.
          setIsMainBoard(true);
          // const data = {
          //   profileId: `${authed?.profileId}`,
          //   teamId: `${team?.teamId}`,
          //   isMainBoard: true,
          // };

          // axios
          //   .put(`${api}/teams/${team?.teamId}`, data, {
          //     headers: {
          //       Accept: "application/json",
          //       "Content-Type": "application/json",
          //       Authorization: `Bearer ${authed?.token}`,
          //     },
          //   })
          //   .then((res: AxiosResponse) => {
          //     console.log(res?.data);

          //     //onClose();
          //   });
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
        setIsMainBoard(Boolean(team?.isMainBoard));
        onClose();
      });
  };

  const onRemoveMainBoardTeam = () => {
    //Update Team name. Set isMainBoard to false.
    setIsMainBoard(false);
    // const data = {
    //   profileId: `${authed?.profileId}`,
    //   teamId: `${team?.teamId}`,
    //   isMainBoard: false,
    // };

    // axios
    //   .put(`${api}/teams/${team?.teamId}`, data, {
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${authed?.token}`,
    //     },
    //   })
    //   .then((res: AxiosResponse) => {
    //     console.log(res?.data);
    //     onClose();
    //   })
    //   .catch((err: AxiosError) => {
    //     console.log(err);
    //   });
  };

  useEffect(() => {
    setIsloading(true);
    if (teamId) {
      axios
        .get(`${api}/teams/${teamId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          // console.log(res?.data);
          const data: Team = {
            teamId: `${res.data["teamId"]}`,
            name: `${res.data["name"]}`,
            isMainBoard: res?.data["isMainBoard"],
            totalMembers: `${res.data["totalMembers"]}`,
          };

          setTeam(data);
          setIsMainBoard(res?.data["isMainBoard"]);
          setIsloading(false);
        });
    }
  }, [teamId]);

  useEffect(() => {
    if (!hasMembers) {
      setIsloading(true);

      axios
        .get(`${api}/teams/members/${teamId}`)
        .then((res: AxiosResponse) => {
          // console.log(res?.data);

          const datas: TeamMember[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: TeamMember = {
                teamMemberId: d?.teamMemberId,
                memberId: d?.memberId,
                member: d?.member,
                teamId: d?.teamId,
                teamPosition: d?.teamPosition,
                isTeamMember: Number(d?.isTeamMember) === 1 ? true : false,
              };

              return [data];
            }
          );

          setTMembers([...datas]);
          setHasMembers(true);

          setIsloading(false);
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
          <div className={`flex items-center gap-5`}>
            <h1 className="text-2xl">
              {team?.name} ({team?.totalMembers})
            </h1>

            <Tooltip
              content="Edit Team name"
              hidden={!isEdit}
              placement="bottom"
            >
              <Button
                disableRipple
                size="sm"
                className={`bg-transparent ${isEdit ? "visible" : "invisible"}`}
                onPress={onOpen}
              >
                <span className={`p-2 rounded-full hover:bg-default-200`}>
                  <GoPencil className={`text-xl`} />
                </span>
              </Button>
            </Tooltip>
          </div>

          <div className={`flex items-center gap-3`}>
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

        {/* Content */}
        <div className="w-full rounded-2xl bg-slate-200 shadow flex justify-between p-5 h-[75dvh]">
          {isLoading ? (
            <div className="w-full flex justify-center">
              <Spinner
                className=" flex justify-center "
                color="primary"
                label="Loading..."
                size="lg"
              />
            </div>
          ) : (
            <>
              {/* Team Input */}
              <div className={`w-full border flex flex-col gap-3 p-3`}>
                <h1 className={`text-xl`}>Manage Team Member</h1>
                {/* <h1>Search/Add member</h1> */}
                <div className="w-full flex  flex-col gap-2">
                  <Autocomplete
                    allowsCustomValue={true}
                    allowsEmptyCollection={false}
                    className="w-full"
                    defaultItems={members}
                    disabled={isEdit ? true : false}
                    endContent={
                      <GoX
                        className=" cursor-pointer hover:bg-default-400 text-danger-400 p-1 rounded-full text-2xl"
                        onClick={() => {
                          setSelectedMember(null);
                          setMembers([]);
                          setValue("");
                          setIsTeamMember(false);
                          setIsAvailable(false);
                          close();
                        }}
                      />
                    }
                    label="Search a profile"
                    placeholder={`${selectedMember ? selectedMember?.email : "Enter profile email"}`}
                    variant="flat"
                    onInputChange={onInputChange}
                    onSelectionChange={(e) => {
                      const member = members.filter((m) => m?.key === e)[0];

                      if (member) {
                        onMemberChange(member);
                        setValue(`${member?.value?.email}`);
                      }
                    }}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.key}>
                        {/* {item?.value?.email} */}
                        <div className={`flex flex-col gap-1`}>
                          <label className=" text-xs" htmlFor="email">
                            {item?.value?.email}
                          </label>

                          <h1 className={` text-sm `}>
                            {item?.value?.firstname}
                          </h1>
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
                        placeholder={
                          selectedMember
                            ? selectedMember?.firstname
                            : "Member firstname"
                        }
                      />
                    </div>

                    <div className={`flex flex-col gap-1`}>
                      <label htmlFor="lName">Lastname</label>
                      <Input
                        disabled
                        placeholder={
                          selectedMember
                            ? selectedMember?.lastname
                            : "Member lastname"
                        }
                      />
                    </div>

                    <div className={`flex flex-col gap-1`}>
                      <label htmlFor="pName">Position</label>
                      <Input
                        disabled
                        placeholder={
                          selectedMember
                            ? selectedMember?.position
                            : "Member position"
                        }
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

                    <div
                      className={`w-full flex justify-end items-center gap-3`}
                    >
                      <p>{`Is Team Member: ${isTeamMember ? "Member" : "Not member"}`}</p>

                      <Switch
                        isDisabled={!isEdit ? true : false}
                        defaultSelected={isTeamMember}
                        isSelected={isTeamMember}
                        endContent={<GoLock />}
                        size="lg"
                        startContent={<GoUnlock />}
                        title={`${isTeamMember ? "Team member" : "Not Team member"}`}
                        onClick={() => {
                          if (!isTeamMember) {
                            setIsTeamMember(true);
                          } else {
                            setIsTeamMember(false);
                          }
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="space-y-5">
                      {/* <label htmlFor=""></label> */}
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
                        {`${isAvailable ? "Update Member" : "Add member"}`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Input End*/}

              {/* Team Members */}
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
                          <p>{team?.member?.firstname}</p>
                        </TableCell>
                        <TableCell onClick={() => handleSelectedRow(team)}>
                          <p>{team?.member?.position}</p>
                        </TableCell>
                        <TableCell onClick={() => handleSelectedRow(team)}>
                          <p>{team?.teamPosition}</p>
                        </TableCell>
                        <TableCell>
                          <div className="relative flex items-center gap-2">
                            <Tooltip color="danger" content="Delete">
                              <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                                <GoTrash
                                  onClick={() =>
                                    handleAction(team, actionTypes[2])
                                  }
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
              {/* Team Members End*/}
            </>
          )}
        </div>

        {/* Team Edit Dialog */}
        <>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    Edit {team?.name} {isMainBoard ? "True" : "False"}
                  </ModalHeader>

                  <ModalBody>
                    <form onSubmit={handleSubmit(onUpdateTeam)}>
                      <Input
                        label="Name"
                        placeholder={`${team?.name ?? "Edit Team name"}`}
                        {...register("name")}
                      />

                      <div className={`flex flex-col`}>
                        <label htmlFor="isMain">
                          Is Main Board: {isMainBoard ? "True" : "False"}
                        </label>
                        <Switch
                          onClick={() => {
                            if (!isMainBoard) {
                              alert("Set as Main board");
                              onSetMainBoardTeam();
                              //setIsMainBoard(true);
                            } else {
                              alert("Remove Main board");
                              onRemoveMainBoardTeam();
                              //setIsMainBoard(false);
                            }
                          }}
                          defaultSelected={team?.isMainBoard}
                          isSelected={team?.isMainBoard}
                          size="lg"
                        ></Switch>
                      </div>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={() => {
                            setIsMainBoard(Boolean(team?.isMainBoard));

                            onClose();
                          }}
                        >
                          Close
                        </Button>
                        <Button color="primary" type="submit">
                          Update
                        </Button>
                      </ModalFooter>
                    </form>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
        {/* Team Edit Dialog End */}
      </div>
    </div>
  );
}
// function TeamManage({ team, modelOpen }: { team: Team; modelOpen: boolean }) {
//   return;
//   <>
//     <Modal isOpen={modelOpen} placement="top">
//       <ModalHeader>
//         Edit {team?.name}
//       </ModalHeader>
//     </Modal>
//   </>;
// }
