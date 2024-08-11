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

export type Team = {
  teamId?: string;
  name?: string;
  totalMembers?: string;
};

export default function DashboardTeamsPage() {
  const columns = ["Name", "Total Members", "Actions"];
  const [teams, setTeams] = useState<Team[]>([]);
  const [isTeams, setIsTeams] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const actionTypes = ["detail", "edit", "delete"];

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
        "profileId": `${authed?.profileId}`,
        "name": `${teamNameRef?.current?.value}`,
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
          setTeams(datas);

          console.log(res.data);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
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

        {/* Table */}
        <Table fullWidth isStriped removeWrapper>
          <TableHeader>
            {columns.map((column, i) => (
              <TableColumn key={i}>{column}</TableColumn>
            ))}
          </TableHeader>

          <TableBody emptyContent="No Teams at the moment" items={teams}>
            {teams.map((team, i) => (
              <TableRow className="w-full" key={i}>
                <TableCell onClick={() => handleSelectedRow(team)}>
                  {team?.name}
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
        {/* Table End */}
      </section>

      {/* Create Modal */}
      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
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
                    autoFocus
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
