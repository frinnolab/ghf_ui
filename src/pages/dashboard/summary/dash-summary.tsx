import DashboardLayout from "@/layouts/dash-layout";
import { Divider, Spinner } from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup, FaSchool } from "react-icons/fa6";
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
  const [summaryInfo, setSummarInfo] = useState<SummaryInfo | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    if (summaryInfo === null) {
      setIsloading(true);
      axios
        .get(`${api}/settings/summaryinfo`)
        .then((res: AxiosResponse) => {
          setSummarInfo(() => {
            return {
              regions: {
                label: "Total Regions",
                value: `${res?.data["totalRegions"]}`,
              },
              districts: {
                label: "Total Districts",
                value: `${res?.data["totalDistricts"]}`,
              },
              schools: {
                label: "Total Schools",
                value: `${res?.data["totalSchools"]}`,
              },
              students: {
                label: "Total Students",
                value: `${res?.data["totalStudents"]}`,
              },
              projects: {
                label: "Total Projects",
                value: `${res?.data["totalProjects"]}`,
              },
            };
          });

          //setSummaries(res?.data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);

          setIsloading(false);
        });
    }
  }, [summaryInfo]);
  return (
    <DashboardLayout>
      <div className="w-full font-semibold space-y-3 p-5">
        <h1 className="text-2xl">Summary</h1>

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
          <div className={`w-full flex justify-between gap-5`}>
            {/* Regions */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaMapMarkedAlt size={30} />

              <h1 className=" text-6xl ">{summaryInfo?.regions?.value ?? 0}</h1>
              <h1 className="text-2xl">Total Regions Reached</h1>
            </div>

            {/* Districts */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaMapPin size={30} />

              <h1 className=" text-6xl ">
                {summaryInfo?.districts?.value ?? 0}
              </h1>
              <h1 className="text-2xl">Total Districts Reached</h1>
            </div>

            {/* Schools */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaSchool size={30} />
              <h1 className=" text-6xl ">{summaryInfo?.schools?.value ?? 0}</h1>
              <h1 className="text-2xl">Total Schools Reached</h1>
            </div>

            {/* Students */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full">
              <FaPeopleGroup size={30} />
              <h1 className=" text-6xl ">
                {summaryInfo?.students?.value ?? 0}
              </h1>
              <h1 className="text-2xl">Total Students Reached</h1>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
