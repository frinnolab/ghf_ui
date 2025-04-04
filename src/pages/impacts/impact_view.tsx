/* eslint-disable import/order */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Impact,
  ImpactAsset,
  ImpactReport,
} from "../dashboard/impacts/dash-impacts-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowLeft, GoEye } from "react-icons/go";
import { Divider, Image, Spinner } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { FaUniversity, FaMapMarkedAlt, FaRegFilePdf } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
// import fileDownload from "js-file-download";

export default function ImpactView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [impactId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }

    return null;
  });

  const [impact, setImpact] = useState<Impact | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [impactAssets, setImpactAssets] = useState<ImpactAsset[] | null>(null);
  const [impactReports, setImpacReports] = useState<ImpactReport[] | null>(
    null
  );

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    if (impactId) {
      axios
        .get(`${api}/impacts/${impactId}`)
        .then((res: AxiosResponse) => {
          const data: Impact = {
            impactId: `${res?.data["impactId"]}`,
            assetUrl: res?.data["assetUrl"] ?? null,
            title: res?.data["title"],
            schoolName: res?.data["schoolName"],
            schoolDistrict: res?.data["schoolDistrict"],
            schoolRegion: res?.data["schoolRegion"],
            studentBoys: Number(`${res?.data["studentBoys"]}`),
            studentGirls: Number(`${res?.data["studentGirls"]}`),
            studentsTotal: Number(`${res?.data["studentsTotal"]}`),
            schoolsTotal: Number(`${res?.data["schoolsTotal"]}`),
            description: res?.data["description"],
          };

          setImpact(data);

          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impactId]);

  //fetch assets
  useEffect(() => {
    if (impact) {
      axios
        .get(`${api}/impacts/assets/${impactId}`)
        .then((res: AxiosResponse) => {
          const datas: ImpactAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: ImpactAsset = {
                assetUrl: d?.assetUrl,
                impactAssetId: d?.assetId,
                impactId: d?.impactId,
              };

              return [data];
            }
          );

          setImpactAssets([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impact]);

  //fetch reports
  useEffect(() => {
    if (impact) {
      axios
        .get(`${api}/impacts/reports/${impactId}`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const datas: ImpactReport[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: ImpactReport = {
                reportUrl: d?.reportUrl,
                impactReportId: d?.assetId,
                impactId: d?.impactId,
                title: d?.title ?? null,
              };

              return [data];
            }
          );

          setImpacReports([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [impact]);

  // const downloadReport = (
  //   reportId: string,
  //   filename: string = "Impact Report"
  // ) => {
  //   axios
  //     .get(`${api}/impacts/reports/${impactId}/${reportId}`, {
  //       headers: {
  //         // Accept: "application/json",
  //         // Authorization: `Bearer ${authed?.token}`,
  //         "Content-Disposition": "attachment;",
  //         "Content-Type": "application/octet-stream",
  //       },
  //       responseType: "blob",
  //     })
  //     .then((res: AxiosResponse) => {
  //       if (res) {
  //         //console.log(res?.data);

  //         fileDownload(res?.data, filename, res.headers["content-type"]);
  //       }
  //     })
  //     .catch((err: AxiosError) => {
  //       console.log(err.response);

  //       window.location.reload();
  //     });
  // };

  const viewReport = (reportUrl: String) => {
    window.open(`${reportUrl}`, "_blank");
  };

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/impacts");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>

      <Divider />

      {isLoading ? (
        <>
          <Spinner
            className=" flex justify-center py-5 "
            color="primary"
            label="Loading..."
            size="lg"
          />
        </>
      ) : (
        <div className="w-full flex flex-col gap-5">
          <div className={`p-2`}>
            <Image
              className={`md:w-screen md:h-screen object-cover`}
              radius="none"
              src={`${impact?.assetUrl !== "" || null ? impact?.assetUrl : siteConfig?.staticAssets?.staticLogo}`}
            />
          </div>

          <Divider />

          {/* Contents */}
          <div className="w-full flex flex-col gap-5 px-10">
            <div className=" space-y-5 ">
              <h1 className="text-3xl">{impact?.title}</h1>
            </div>

            {/* Impact Stats */}
            <div hidden>
              <span className={`flex items-center text-xl gap-3`}>
                <FaUniversity className="text-blue-500" />
                <p className={`text-md`}>{impact?.schoolsTotal ?? 0}</p>
              </span>
              <span className={`items-center text-xl gap-3 hidden`}>
                <FaMapMarkedAlt className="text-green-500" />
                <p className={`text-md`}>{impact?.schoolRegion}</p>
              </span>

              <span className={`flex items-center text-xl gap-3`}>
                <FaPeopleGroup className="text-orange-500" />
                <p className={`text-md`}>{impact?.studentsTotal}</p>
              </span>
            </div>
            {/* Impact Stats End */}

            <div className=" space-y-5 ">
              {/* <label htmlFor="description">Description</label> */}
              <p className=" text-xl text-balance p-5 bg-default-200 ">
                {impact?.description}
              </p>
            </div>

            {/* Impact Report */}
            <div
              className={`w-full ${impactReports === null ? "hidden" : "flex flex-col gap-5 p-3 scrollbar-hide"}  `}
            >
              {/* <h1 className="text-xl md:text-3xl">{impact?.title} Reports</h1> */}

              {impactReports === null || impactReports?.length === 0 ? (
                <>{/* <p className=" text-center "></p> */}</>
              ) : (
                <div className={`w-full flex flex-col md:flex-row gap-5`}>
                  {impactReports?.flatMap((d: ImpactReport, i) => (
                    <div
                      key={i}
                      className={` bg-default-100 rounded-xl flex flex-col justify-between items-center gap-1 pt-5`}
                    >
                      {/* <GoFile className="text-orange-500" size={30} /> */}
                      <FaRegFilePdf className="text-orange-500" size={50}/>

                      <h1 className=" text-2xl ">{d?.title}</h1>

                      <Button>
                        <GoEye
                          size={20}
                          className=" text-primary-500"
                          onClick={() => {
                            // downloadReport(
                            //   `${d?.impactReportId}`,
                            //   `${d?.title ?? "Impact Report"}`
                            // );

                            viewReport(`${d?.reportUrl}`);
                          }}
                        />
                      </Button>
                      {/* <Image src={d?.assetUrl} /> */}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Impact Report End */}

            {/* Impact Assets */}
            <div
              className={`w-full ${impactAssets === null || impactAssets?.length > 0 ? "flex flex-col gap-5 overflow-y-scroll h-[80dvh] p-3 scrollbar-hide" : "hidden"}  `}
            >
              {/* <h1 className="text-xl md:text-3xl">{impact?.title} assets</h1> */}
              {impactAssets === null || impactAssets?.length === 0 ? (
                <>
                  {/* <p className=" text-center ">No Asset(s) for impact</p> */}
                </>
              ) : (
                <div className={`w-full flex flex-col md:flex-row gap-5`}>
                  {impactAssets?.flatMap((d: ImpactAsset) => (
                    <div
                      key={d?.impactAssetId}
                      className={`shadow rounded-xl flex flex-col justify-between items-center gap-1 P-2`}
                    >
                      <Image
                        radius="none"
                        height={500}
                        src={d?.assetUrl}
                        width={500}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Impact Assets End */}
          </div>
          {/* Contents End */}
        </div>
      )}
    </div>
  );
}
