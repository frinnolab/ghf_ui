import { Button } from "@nextui-org/button";
import { Divider, Switch } from "@nextui-org/react";
import { useState } from "react";
import { GoArrowLeft, GoEye, GoPencil } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { Blog } from "./dash-blogs";

export default function DashBlogCreate() {
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [blogId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    }
  });
  const [blog, setBlog] = useState<Blog | null>(null);
  const handleBack = () => nav("/dashboard/blogs");

  return (
    <div className="w-full">
      {/* Main Actions */}
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "Create Blog" : ` ${isEdit ? " Edit" : "View"} Blog: ${blogId}`}`}</h1>
      </div>
      <Divider />

      <div className="w-full flex flex-col p-5">
        <div className={` flex justify-end items-center gap-5 `}>
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
            // thumbIcon={() => {
            //   return isEdit ?  <GoPencil /> : <GoEye />;
            // }}
            title={`${isEdit ? "View" : "Edit"}`}
          ></Switch>
        </div>
      </div>
    </div>
  );
}
