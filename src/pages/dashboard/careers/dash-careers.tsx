import DashboardLayout from "@/layouts/dash-layout";
import useAuthedProfile from "@/hooks/use-auth";
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
  Radio,
  RadioGroup,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";

import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoEye, GoPlus, GoTrash } from "react-icons/go";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactQuill from "react-quill";

// import { Qformats, Qmodules } from "../blog/dash-blog-create";

export const carQformats = [
  "header",
  "bold",
  "italic",
  "underline",
  // "strike",
  // "blockquote",
  "list",
  "bullet",
  "indent",
  // "link",
  // "image",
  // "video",
];

export const carQmodules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    [
      "bold",
      "italic",
      "underline",
      // "strike", "blockquote"
    ],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    // ["image"],
    // ["video"],
    // ["link"],
    // ["clean"],
  ],
};

const DashCareersList = () => {
  const columns = ["Position", "Type", "Validity", "Actions"];
  const [careers, setCareers] = useState<Career[]>([]);
  const [career] = useState<Career>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const actionTypes = ["detail", "edit", "delete"];
  const [isLoading, setIsloading] = useState<boolean>(false);
  //const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [quillValue, setQuillValue] = useState<string>("");

  const careerRadioTypes = [
    {
      key: 0,
      label: "Volunteering",
      type: CareerType.Volunteering,
    },
    {
      key: 1,
      label: "Employment",
      type: CareerType.Employment,
    },
    {
      key: 2,
      label: "Internship",
      type: CareerType.Internship,
    },
  ];

  const [selectedCareerRadio, setSelectedCareeRadio] = useState(
    careerRadioTypes[0]
  );

  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const nav = useNavigate();
  const { register, handleSubmit } = useForm<Career>();

  const handleCreate: SubmitHandler<Career> = (data: Career) => {
    setIsloading(true);

    const newData: Career = {
      position: data?.position,
      description: data?.description,
      requirements: quillValue,
      // careerType: Number(data?.careerType ?? CareerType.Volunteering),
      careerType: Number(selectedCareerRadio?.type),
      careerValidity: Number(data?.careerValidity ?? CareerValidity?.Open),
    };

    axios
      .post(`${api}/careers`, newData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          // console.log(res?.data);
          setIsloading(false);
          onClose();
          window.location.reload();
        }
      })
      .catch((e: AxiosError) => {
        console.error(e);
        //setIsloading(false);
        //window.location.reload();
      });
  };

  const handleSelectedRow = (p: Career) => {
    //console.log(p);
    nav(`/dashboard/careers/${p.careerId}`, {
      state: p.careerId,
    });
  };

  const handleAction = (p: Career, action: string) => {
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

  const handleDelete = (b: Career) => {
    if (Number(authed?.role) !== Number(AuthRole.SuperAdmin)) {
      alert(`You are not Authorised to perform this action!.`);
      //console.log(HttpStatusCode);
    } else {
      axios
        .delete(`${api}/careers/${b?.careerId}`, {
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

  const careerTypeText = (cType: CareerType) => {
    switch (cType) {
      case CareerType.Employment:
        return "Employment";
      case CareerType.Volunteering:
        return "Volunteering";
      case CareerType.Internship:
        return "Internship";
    }
  };

  const careerValidityText = (cvType: CareerValidity) => {
    switch (cvType) {
      case CareerValidity.Open:
        return "Open";
      case CareerValidity.Closed:
        return "Closed";
    }
  };

  const fetchCareers = async () => {
    axios
      .get(`${api}/careers`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res?.data) {
          console.log(res?.data);

          const data: Career[] = Array.from(res?.data).flatMap((d: any) => {
            const dd: Career = {
              careerId: d?.careerId,
              description: d?.description,
              position: d?.position,
              requirements: d?.requirements,
              careerType: Number(d?.careerType ?? CareerType.Volunteering),
              careerValidity: Number(d?.careerValidity ?? CareerValidity.Open),
            };

            return [dd];
          });

          setCareers(data);
          setIsloading(false);
        }
      });
  };

  useEffect(() => {
    setIsloading(true);
    fetchCareers();
  }, []);

  return (
    <DashboardLayout>
      <section className="w-full flex flex-col p-10 gap-3">
        {/* Main Actions */}
        <div className="w-full flex justify-between">
          <h1 className=" text-2xl ">Manage Careers</h1>

          <Button color="primary" variant="solid" onPress={onOpen}>
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
              size="lg"
              className=" flex justify-center "
              label="Loading..."
              color="primary"
            />
          </>
        ) : (
          <Table fullWidth isStriped removeWrapper>
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column}>{column}</TableColumn>
              ))}
            </TableHeader>

            <TableBody emptyContent="No Careers at the moment" items={careers}>
              {careers.map((team) => (
                <TableRow className="w-full" key={team?.careerId}>
                  <TableCell onClick={() => handleSelectedRow(team)}>
                    {team?.position}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(team)}>
                    {careerTypeText(Number(team?.careerType))}
                  </TableCell>
                  <TableCell onClick={() => handleSelectedRow(team)}>
                    {careerValidityText(Number(team?.careerValidity))}
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
        {/* Main Actions End*/}
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
                  New Career
                </ModalHeader>
                <div>
                  {isLoading ? (
                    <>
                      <Spinner
                        size="lg"
                        className=" flex justify-center "
                        label="Loading..."
                        color="primary"
                      />
                    </>
                  ) : (
                    <form
                      className="w-full flex flex-col gap-5 "
                      onSubmit={handleSubmit(handleCreate)}
                    >
                      <ModalBody>
                        <Input
                          defaultValue={`${career?.position ?? ""}`}
                          label="Position"
                          type="text"
                          {...register("position")}
                          placeholder={`${career?.position?.toUpperCase() ?? "Enter Position"}`}
                        />

                        <RadioGroup
                          color="warning"
                          label={`Selected Career Type: ${selectedCareerRadio?.label}`}
                          orientation="horizontal"
                          value={`${selectedCareerRadio?.type}`}
                          onValueChange={(e) => {
                            // console.log(e);

                            const selCareer = careerRadioTypes.find(
                              (ct) => ct.type === Number(e)
                            );

                            // console.log(selCareer);

                            setSelectedCareeRadio(
                              selCareer ?? selectedCareerRadio
                            );
                          }}
                        >
                          {/* {careerRadioTypes?.map((ct)=>{
                            <Radio value={ct?.type}>{ct.label}</Radio>
                          })} */}

                          <Radio value={`${careerRadioTypes[0]?.type}`}>
                            {careerRadioTypes[0]?.label}
                          </Radio>
                          <Radio value={`${careerRadioTypes[1]?.type}`}>
                            {careerRadioTypes[1]?.label}
                          </Radio>
                          <Radio value={`${careerRadioTypes[2]?.type}`}>
                            {careerRadioTypes[2]?.label}
                          </Radio>
                        </RadioGroup>

                        {/* <Input
                          label="Career Type"
                          type="text"
                          defaultValue={`${career?.position ?? ""}`}
                          {...register("position")}
                          placeholder={`${career?.position?.toUpperCase() ?? "Enter Position"}`}
                        /> */}

                        <Textarea
                          defaultValue={`${career?.description ?? ""}`}
                          label="Description"
                          type="text"
                          {...register("description")}
                          placeholder={`${career?.description?.toUpperCase() ?? "Enter Description"}`}
                        />

                        <div>
                          <label htmlFor="req">Requirements</label>
                          <ReactQuill
                            style={{
                              height: "20dvh",
                              overflowY: "scroll",
                              overflowX: "hidden",
                            }}
                            formats={carQformats.filter((p) => p)}
                            modules={carQmodules}
                            placeholder={`${career?.requirements ?? "Enter Requirements"}`}
                            theme="snow"
                            value={quillValue}
                            onChange={setQuillValue}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                          Close
                        </Button>
                        <Button color="primary" type="submit">
                          Create
                        </Button>
                      </ModalFooter>
                    </form>
                  )}
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </DashboardLayout>
  );
};

export default DashCareersList;

export type Career = {
  careerId?: string;
  position?: string;
  description?: string;
  requirements?: string;
  careerValidity?: CareerValidity;
  careerType?: CareerType;
};

export type CareerApplication = {
  careerAppId?: string;
  careerId?: string;
  avatarUrl?: string;
  cvUrl?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  biography?: string;
  city?: string;
  country?: string;
  careerStatus?: CareerStatus;
  careerRoleType?: AuthRole;
};

export enum CareerType {
  Volunteering = 0,
  Employment = 1,
  Internship = 2,
}

export enum CareerStatus {
  Pending = 0,
  Denied = 1,
  Accepted = 2,
  //Pending = 0 | Denied = 1 | Accepted = 2
}

export enum CareerValidity {
  Closed = 0,
  Open = 1,
  //Closed = 0, Open = 1;
}
