/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import DashboardLayout from "@/layouts/dash-layout";
import {
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup, FaSchool } from "react-icons/fa6";
import { StatsInfo } from "../settings/dash-settings";
import { Button } from "@nextui-org/button";
import { SubmitHandler, useForm } from "react-hook-form";
import useAuthedProfile from "@/hooks/use-auth";
type summaryData = {
  label?: string;
  value?: string;
};

export type SummaryInfo = {
  regions?: summaryData;
  districts?: summaryData;
  schools?: summaryData;
  students?: summaryData;
  projects?: summaryData;
};
export default function DashSummaryPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  //const [summaryInfo, setSummarInfo] = useState<SummaryInfo | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [statsInfo, setStatsInfo] = useState<StatsInfo | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const authed = useAuthedProfile();

  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<StatsInfo>();

  const fetchStatInfo = () => {
    if (statsInfo === null) {
      setIsloading(true);

      axios
        .get(`${api}/settings/statsinfo`)
        .then((res: AxiosResponse) => {
          // if (res?.data["introVideoUrl"]) {
          //   setIsIntrovideo(true);
          // }

          // setCompanyInfo(res?.data);

          const data: StatsInfo = {
            statId: res?.data["statId"] ?? null,
            studentsImpacted: Number(res?.data["studentsImpacted"] ?? 0),
            regionsReached: Number(res?.data["regionsReached"] ?? 0),
            schoolsReached: Number(res?.data["schoolsReached"] ?? 0),
            districtsReached: Number(res?.data["districtsReached"] ?? 0),
          };

          setStatsInfo(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
          setStatsInfo(() => {
            return {
              studentsImpacted: 0,
              regionsReached: 0,
              schoolsReached: 0,
              districtsReached: 0,
            };
          });

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  };

  useEffect(() => {
    // if (summaryInfo === null) {
    //   setIsloading(true);
    //   axios
    //     .get(`${api}/settings/summaryinfo`)
    //     .then((res: AxiosResponse) => {
    //       setSummarInfo(() => {
    //         return {
    //           regions: {
    //             label: "Total Regions",
    //             value: `${res?.data["totalRegions"]}`,
    //           },
    //           districts: {
    //             label: "Total Districts",
    //             value: `${res?.data["totalDistricts"]}`,
    //           },
    //           schools: {
    //             label: "Total Schools",
    //             value: `${res?.data["totalSchools"]}`,
    //           },
    //           students: {
    //             label: "Total Students",
    //             value: `${res?.data["totalStudents"]}`,
    //           },
    //           projects: {
    //             label: "Total Projects",
    //             value: `${res?.data["totalProjects"]}`,
    //           },
    //         };
    //       });

    //       //setSummaries(res?.data);

    //       setTimeout(() => {
    //         setIsloading(false);
    //       }, 2000);
    //     })
    //     .catch((err: AxiosError) => {
    //       console.log(err.response);

    //       setIsloading(false);
    //     });
    // }

    fetchStatInfo();
  }, []);

  const onStatSubmit: SubmitHandler<StatsInfo> = (p) => {
    //alert(quillValue);

    const data = new FormData();

    data.append("regionsReached", `${p?.regionsReached}`);
    data.append("districtsReached", `${p?.districtsReached}`);
    data.append("studentsImpacted", `${p?.studentsImpacted}`);
    data.append("schoolsReached", `${p?.schoolsReached}`);

    if (statsInfo?.statId) {
      //Update

      onUpdateStats(statsInfo?.statId, data);
    } else {
      //Save
      onSaveStats(data);
    }
  };

  const onUpdateStats = (statId: string, data: FormData) => {
    axios
      .put(`${api}/settings/statsinfo/${statId}`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          alert("Successfully Submitted.");
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err?.response);
      });
  };
  
  const onSaveStats = (data: FormData) => {
    axios
      .post(`${api}/settings/statsinfo`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed?.token}`,
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          alert("Successfully Submitted.");
          window.location.reload();
        }
      })
      .catch((err: AxiosError) => {
        console.error(err?.response);
      });
  };

  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl">Summary</h1>

          <Button
            color="primary"
            disabled={isLoading}
            variant="solid"
            onPress={onOpen}
          >
            Manage Stats
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
          <div className={`w-full flex justify-between gap-5`}>
            {/* Regions */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaMapMarkedAlt size={30} />

              {/* <h1 className=" text-6xl ">{summaryInfo?.regions?.value ?? 0}</h1> */}
              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.regionsReached ?? 0)}
                separator=" "
              />
              <h1 className="text-2xl">Total Regions Reached</h1>
            </div>

            {/* Districts */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaMapPin size={30} />

              {/* <h1 className=" text-6xl ">
                {summaryInfo?.districts?.value ?? 0}
              </h1> */}

              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.districtsReached ?? 0)}
                separator=" "
              />

              <h1 className="text-2xl">Total Districts Reached</h1>
            </div>

            {/* Schools */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaSchool size={30} />
              {/* <h1 className=" text-6xl ">{summaryInfo?.schools?.value ?? 0}</h1> */}

              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.schoolsReached ?? 0)}
                separator=" "
              />
              <h1 className="text-2xl">Total Schools Reached</h1>
            </div>

            {/* Students */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaPeopleGroup size={30} />
              {/* <h1 className=" text-6xl ">
                {summaryInfo?.students?.value ?? 0}
              </h1> */}

              <CountUp
                className="text-6xl"
                duration={5}
                end={Number(statsInfo?.studentsImpacted ?? 0)}
                separator=","
              />
              <h1 className="text-2xl">Total Students Reached</h1>
            </div>
          </div>
        )}

        {/* Stats Dialog */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>
              <h2>Manage Statistics</h2>
            </ModalHeader>
            <ModalBody>
              <form
                className=" flex flex-col gap-1 p-4 space-y-1"
                onSubmit={handleSubmit(onStatSubmit)}
              >
                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="regionsReached">
                    Regions Reached
                  </label>

                  <Input
                    defaultValue={`${statsInfo?.regionsReached ?? 0}`}
                    min={0}
                    type="number"
                    {...register("regionsReached")}
                    placeholder={`${statsInfo?.regionsReached ?? 0}`}
                  />
                </div>

                <div className="w-full space-y-1">
                  <label
                    className="text-default-500"
                    htmlFor="districtsReached"
                  >
                    Districts Reached
                  </label>

                  <Input
                    defaultValue={`${statsInfo?.districtsReached ?? 0}`}
                    min={0}
                    type="number"
                    {...register("districtsReached")}
                    placeholder={`${statsInfo?.districtsReached ?? 0}`}
                  />
                </div>

                <div className="w-full space-y-1">
                  <label
                    className="text-default-500"
                    htmlFor="studentsImpacted"
                  >
                    Students Impacted
                  </label>

                  <Input
                    defaultValue={`${statsInfo?.studentsImpacted ?? 0}`}
                    min={0}
                    type="number"
                    {...register("studentsImpacted")}
                    placeholder={`${statsInfo?.studentsImpacted ?? 0}`}
                  />
                </div>

                <div className="w-full space-y-1">
                  <label className="text-default-500" htmlFor="schoolsReached">
                    Schools Reached
                  </label>

                  <Input
                    defaultValue={`${statsInfo?.schoolsReached ?? 0}`}
                    min={0}
                    type="number"
                    {...register("schoolsReached")}
                    placeholder={`${statsInfo?.schoolsReached ?? 0}`}
                  />
                </div>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" onPress={onClose}>
                    {statsInfo?.statId === null ? 'Save' : 'Update'}
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
        {/* Stats Dialog End */}
      </div>
    </DashboardLayout>
  );
}
