import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Impact, ImpactAsset } from "../dashboard/impacts/dash-impacts-list";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowLeft } from "react-icons/go";
import { Divider, Image } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import { FaUniversity, FaMapMarkedAlt } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

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
  const [impactAssets, setImpactAssets] = useState<ImpactAsset[] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (impactId) {
      axios
        .get(`${api}/impacts/${impactId}`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

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
            description: res?.data["description"],
          };

          setImpact(data);
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
      
      <div className="w-full flex flex-col gap-5 p-10">
        <div className={`p-2`}>
          <Image
            radius="none"
            className={`w-screen h-screen object-cover`}
            src={`${impact?.assetUrl !== "" || null ? impact?.assetUrl : siteConfig?.staticAssets?.staticLogo}`}
          />
        </div>

        <Divider />

        {/* Contents */}
        <div className="w-full flex flex-col gap-5 p-10">
          <div className=" space-y-5 ">
            <h1 className="text-3xl">{impact?.title}</h1>
          </div>

          {/* Impact Stats */}
          <div>
            <span className={`flex items-center text-xl gap-3`}>
              <FaUniversity className="text-blue-500" />
              <p className={`text-md`}>{impact?.schoolName}</p>
            </span>
            <span className={`flex items-center text-xl gap-3`}>
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
            <label htmlFor="description">Description</label>
            <p className=" text-xl text-balance p-5 bg-default-200 rounded-2xl ">
              {impact?.description}
            </p>
          </div>

          {/* Impact Assets */}
          <div
            className={`w-full overflow-y-scroll h-[80dvh] p-3 scrollbar-hide`}
          >
            <h1 className="text-3xl">{impact?.title} assets</h1>
            {impactAssets === null || impactAssets?.length === 0 ? (
              <>
                <p className=" text-center ">No Asset(s) for impact</p>
              </>
            ) : (
              <div className={`w-full flex gap-5`}>
                {impactAssets?.flatMap((d: ImpactAsset) => (
                  <div
                    key={d?.impactAssetId}
                    className={`shadow rounded-xl flex flex-col justify-between items-center gap-1 P-2`}
                  >
                    <Image src={d?.assetUrl} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Assets End */}
        </div>
        {/* Contents End */}
      </div>
    </div>
  );
}
