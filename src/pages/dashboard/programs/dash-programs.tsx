import DashboardLayout from "@/layouts/dash-layout";
import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { GoEye, GoPencil, GoPlus, GoTrash } from "react-icons/go";
import { useState } from "react";
//import useAuthedProfile from "@/hooks/use-auth";
type Program = {
  name?: string;
  description?: string;
};
export default function DashProgramsListPage() {
  const columns = ["Email", "Firstname", "Actions"];
  const actionTypes = ["detail", "edit", "delete"];
  //const authed = useAuthedProfile();
  const [programs] = useState<Program[]>([
    {
      name: "test0-program",
      description: "test0 Program description",
    },
    {
      name: "test1-program",
      description: "test2 Program description",
    },
    {
      name: "test2-program",
      description: "test2 Program description",
    },
    {
      name: "test3-program",
      description: "test3 Program description",
    },
    {
      name: "test4-program",
      description: "test4 Program description",
    },
  ]);

  const handleSelectedRow = (p: Program) => {
    console.log(p);
  };

  const handleAction = (p: Program, action: string) => {
    switch (action) {
      case actionTypes[0]:
        alert(`Detail ${p.name}`);
        break;
      case actionTypes[1]:
        alert(`Edit ${p.name}`);
        break;
      case actionTypes[2]:
        alert(`Delete ${p.name}`);
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Programs</h1>

          <Button variant="solid" color="primary">
            Add{" "}
            <span>
              <GoPlus size={20} />
            </span>
          </Button>
        </div>
        <Divider />

        <Table fullWidth isStriped removeWrapper>
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="No profiles at the moment" items={programs}>
            {programs.map((program, i) => (
              <TableRow className="w-full" key={i}>
                <TableCell onClick={() => handleSelectedRow(program)}>
                  {program?.name}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(program)}>
                  {program?.description}
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Detail">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoEye
                          onClick={() => handleAction(program, actionTypes[0])}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip content="Edit">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoPencil
                          onClick={() => handleAction(program, actionTypes[1])}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip color="danger" content="Delete">
                      <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                        <GoTrash
                          onClick={() => handleAction(program, actionTypes[2])}
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
    </DashboardLayout>
  );
}
