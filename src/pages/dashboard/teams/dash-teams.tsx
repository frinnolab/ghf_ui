import useAuthedProfile from "@/hooks/use-auth";
import DashboardLayout from "@/layouts/dash-layout";
import { AuthRole } from "@/types";
import { Button } from "@nextui-org/button";
import {
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError, HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import { Profile } from "../profiles/dash-profiles-list";

export type Team = {
  teamId?: string;
  name?: string;
  isMainBoard?: boolean;
  totalMembers?: string;
};

export type TeamMember = {
  teamMemberId?: string;
  teamId?: string;
  memberAvatarUrl?: string;
  member?: Profile;
  memberId?: string;
  teamPosition?: string;
  isTeamMember?: boolean;
};

export default function DashboardTeamsPage() {
  const columns = ["Name", "Total Members", "Actions"];
  const [teams, setTeams] = useState<Team[]>([]);
  const [isTeams, setIsTeams] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const actionTypes = ["detail", "edit", "delete"];
  const [isLoading, setIsloading] = useState<boolean>(false);

  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();

  const teamNameRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (
      teamNameRef?.current?.value !== "" ||
      teamNameRef?.current?.value !== undefined
    ) {
      const data = {
        profileId: `${authed?.profileId}`,
        name: `${teamNameRef?.current?.value}`,
        isMainBoard: false,
      };

      axios
        .post(`${api}/teams`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          console.log(res.data);
          if (res?.data) {
            onClose();
            window.location.reload();
          }
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }

    onClose();
  };

  const handleSelectedRow = (p: Team) => {
    console.log(p);
    nav(`/dashboard/teams/${p.teamId}`, {
      state: p.teamId,
    });
  };

  const handleAction = (p: Team, action: string) => {
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

  const handleDelete = (b: Team) => {
    if (authed?.role == AuthRole.User) {
      alert(HttpStatusCode.Unauthorized);
    }

    axios
      .delete(`${api}/teams/${b?.teamId}`, {
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
  };

  useEffect(() => {
    if (!isTeams) {
      setIsloading(true);

      axios
        .get(`${api}/teams`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {
          const datas: Team[] = Array.from(res?.data).flatMap((b: any) => {
            const data: Team = {
              teamId: `${b.teamId}`,
              name: `${b.name}`,
              totalMembers: `${b.totalMembers ?? 0}`,
            };
            return [data];
          });

          setIsTeams(true);
          setTeams([...datas]);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  }, [isTeams, teams]);

  return (
    <DashboardLayout>
      <section className="w-full flex flex-col p-10 gap-3">
        {/* Main Actions */}
        <div className="w-full flex justify-between">
          <h1 className=" text-2xl ">Manage Teams</h1>
          <Button variant="solid" color="primary" onPress={onOpen}>
            Add{" "}
            <span>
              <GoPlus size={20} />
            </span>
          </Button>
        </div>
        <Divider />

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
          <Table fullWidth isStriped removeWrapper>
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column}>{column}</TableColumn>
              ))}
            </TableHeader>

            <TableBody emptyContent="No Teams at the moment" items={teams}>
              {teams.map((team) => (
                <TableRow className="w-full" key={team?.teamId}>
                  <TableCell onClick={() => handleSelectedRow(team)}>
                    {team?.name}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(team)}>
                    {team?.totalMembers}
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="View">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(team, actionTypes[0])}
                          />
                        </span>
                      </Tooltip>

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
        )}
        {/* Table */}
        {/* Table End */}
      </section>

      {/* Create Modal */}
      <>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create Team
                </ModalHeader>
                <ModalBody>
                  <Input
                    ref={teamNameRef}
                    label="Team name"
                    placeholder="Enter Team name"
                    variant="bordered"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleCreate}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </DashboardLayout>
  );
}
