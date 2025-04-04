import DashboardLayout from "@/layouts/dash-layout";
import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import {
  Divider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import useAuthedProfile from "@/hooks/use-auth";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { AuthRole } from "@/types";

export type Blog = {
  blogId?: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  authorId?: string;
  isArchived?: boolean;
};
export default function DashBlogsListPage() {
  const columns = ["Title", "Actions"];
  const actionTypes = ["detail", "edit", "delete"];
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isBlogs, setIsBlogs] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();

  useEffect(() => {
    if (!isBlogs) {
      setIsloading(true);
      axios
        .get(`${api}/blogs`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authed?.token}`,
          },
        })
        .then((res: AxiosResponse) => {

          console.log(res?.data);
          
          const datas: Blog[] = Array.from(res?.data).flatMap((b: any) => {
            const data: Blog = {
              blogId: `${b.blogId}`,
              authorId: `${b.authorId}`,
              title: `${b.title}`,
              description: `${b.description}`,
              thumbnailUrl: `${b.thumbnailUrl}`,
              isArchived: Boolean(b?.isArchived)
            };

            return [data];
          });

          setBlogs(datas);
          // setArchivedBlogs(datas.filter((d) => d.isArchived === true));
          setIsBlogs(true);

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
  }, [blogs]);

  const handleSelectedRow = (p: Blog) => {
    nav(`/dashboard/blogs/${p.blogId}`, {
      state: p.blogId,
    });
  };

  const handleAction = (p: Blog, action: string) => {
    setIsloading(true);
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

  const handleDelete = (blog: Blog) => {
    if (authed?.role == AuthRole.User) {
      alert(HttpStatusCode.Unauthorized);
    }

    axios
      .delete(`${api}/blogs/${blog?.blogId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err: AxiosError) => {
        console.error(err.response?.data ?? err.response?.statusText);
      });
  };

  const handleCreate = () => {
    nav("/dashboard/blogs/create", {
      state: null,
    });
  };

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        {/* Main Actions */}
        <div className="w-full flex justify-between ">
          <h1 className=" text-2xl ">Manage Blogs</h1>

          <Button color="primary" variant="solid" onClick={handleCreate}>
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
            <TableBody emptyContent="No Blogs at the moment" items={blogs}>
              {blogs.map((blog, i) => (
                <TableRow className="w-full" key={i}>
                  <TableCell onClick={() => handleSelectedRow(blog)}>
                    {blog?.title}
                  </TableCell>
                  {/* <TableCell onClick={() => handleSelectedRow(blog)}>
                    {blog?.description}
                  </TableCell> */}
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip content="View">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <GoEye
                            onClick={() => handleAction(blog, actionTypes[0])}
                          />
                        </span>
                      </Tooltip>

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
        )}
      </div>
    </DashboardLayout>
  );
}
