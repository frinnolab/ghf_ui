import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import {
  GoEye,
  GoPencil,
  GoPlus,
  GoTrash,
} from "react-icons/go";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import useAuthedProfile from "@/hooks/use-auth";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

export type Blog = {
  blogId?: string;
  title?: string;
  description?: string;
  authorId?: string;
};
export default function DashBlogsListPage() {
  const columns = ["Title", "Description", "Actions"];
  const actionTypes = ["detail", "edit", "delete"];
  const [blogs] = useState<Blog[]>([
    {
      blogId:"adadadadadadadadaf",
      title:"Test blog"
    },
    {
      blogId:"adadadadadadadadaf",
      title:"Test blog 2"
    }
  ]);

  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get(`${api}/blogs`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization":`Bearer ${authed?.token}`
        },
      })
      .then((res: AxiosResponse) => {
        console.log(res.data);
      });
  }, []);

  const handleSelectedRow = (p: Blog) => {
    console.log(p);
    nav(`/dashboard/blogs/${p.blogId}`,{
      state:p.blogId
    });
  };

  const handleAction = (p: Blog, action: string) => {
    switch (action) {
      case actionTypes[0]:
        handleSelectedRow(p);
        alert(`Detail ${p.title}`);
        break;
      case actionTypes[1]:
        alert(`Edit ${p.title}`);
        break;
      case actionTypes[2]:
        alert(`Delete ${p.title}`);
        break;
    }
  };

  const handleCreate=()=>{
    nav('/dashboard/blogs/create', {
      state:null
    }) ;
  }

  return (
    <DashboardLayout>
      {/* <div
        className={`shadow-2xl bg-red-500 absolute w-[90%] md:w-[50%] 
        rounded-l-2xl right-0 z-30 ${!isPanelOpen ? "hidden animate-appearance-out" : "animate-appearance-in"} transition-left  `}
      >
        <div className="flex justify-end p-5">
          <GoXCircleFill size={20} onClick={handleOpenPanel} />
        </div>
        <Divider />

        <div className="p-5"> 
          <h1>Panel</h1>
        </div>
      </div> */}
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Blogs</h1>

          <Button variant="solid" color="primary" onClick={handleCreate}>
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
          <TableBody emptyContent="No Blogs at the moment" items={blogs}>
            {blogs.map((blog, i) => (
              <TableRow className="w-full" key={i}>
                <TableCell onClick={() => handleSelectedRow(blog)}>
                  {blog?.title}
                </TableCell>
                <TableCell onClick={() => handleSelectedRow(blog)}>
                  {blog?.description}
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="View">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoEye
                          onClick={() => handleAction(blog, actionTypes[0])}
                        />
                      </span>
                    </Tooltip>

                    {/* <Tooltip content="Edit">
                      <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <GoPencil
                          onClick={() => handleAction(blog, actionTypes[1])}
                        />
                      </span>
                    </Tooltip> */}

                    <Tooltip color="danger" content="Delete">
                      <span className="text-lg text-danger-500 cursor-pointer active:opacity-50">
                        <GoTrash
                          onClick={() => handleAction(blog, actionTypes[2])}
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
