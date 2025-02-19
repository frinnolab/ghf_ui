/* eslint-disable import/order */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Publication,
  PublicationAsset,
} from "../dashboard/publications/dash-publications";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Button } from "@nextui-org/button";
import { GoArrowLeft, GoDownload, GoFile } from "react-icons/go";
import { Divider } from "@nextui-org/react";
import fileDownload from "js-file-download";

export default function PublicationsView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [publishId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state}`;
    }
    return null;
  });

  const [publication, setPublication] = useState<Publication | null>(null);
  const [pubsAssets, setPubsAssets] = useState<PublicationAsset[] | null>(null);

  // const setTypeName = (pubType: PublishTypeEnum) => {
  //   switch (pubType) {
  //     case PublishTypeEnum.Report:
  //       return "Report";
  //     default:
  //       return "Newsletter";
  //   }
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!publication) {
      axios
        .get(`${api}/publications/${publishId}`)
        .then((res: AxiosResponse) => {
          const data: Publication = {
            publishId: `${res.data["publishId"]}`,
            title: res?.data["title"],
            description: res?.data["description"],
            publishType: Number(`${res.data["publishType"] ?? 0}`),
            publishDate: res?.data["publishDate"],
          };

          setPublication(data);
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [publication]);

  //fetch assets
  useEffect(() => {
    if (publication) {
      axios
        .get(`${api}/publications/assets/${publication?.publishId}`)
        .then((res: AxiosResponse) => {
          const datas: PublicationAsset[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: PublicationAsset = {
                assetUrl: d?.assetUrl,
                assetId: d?.assetId,
                publishId: d?.publishId,
                title: d?.title,
              };

              return [data];
            }
          );

          setPubsAssets([...datas]);
        })
        .catch((err: AxiosError) => {
          console.log(JSON.stringify(err?.response));
        });
    }
  }, [publication]);

  function downloadPubAsset2(assetId: string, filename: string = "") {
    axios({
      headers: {
        "Content-Type": "application/octet-stream",
      },
      url: `${api}/publications/assets/${publishId}/${assetId}`, //your url
      method: "GET",
      responseType: "blob", // important
    }).then((res: AxiosResponse) => {
      console.log(res);

      const contentType = res.headers["content-type"];

      fileDownload(res?.data, filename, contentType);
    });
  }

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/publications");
          }}
        >
          <span>
            <GoArrowLeft size={16} />
          </span>
        </Button>
      </div>

      <Divider />

      <div className="w-full flex flex-col gap-5 p-10">
        <div className=" space-y-5 ">
          <h1 className="text-3xl">{publication?.title}</h1>
        </div>

        <Divider />

        <div className=" space-y-5 ">
          <label htmlFor="description">Description</label>
          <div
            dangerouslySetInnerHTML={{ __html: `${publication?.description}` }}
            className=" text-xl text-balance p-5 bg-default-200 rounded-2xl "
          />
        </div>

        {/* Assets */}
        <div
          className={`w-full flex flex-col gap-5 overflow-y-scroll h-[80dvh] p-3 scrollbar-hide`}
        >
          <h1 className="text-3xl">{publication?.title} assets</h1>

          {pubsAssets === null || pubsAssets?.length === 0 ? (
            <>
              <p className=" text-center ">No Asset(s) for Publication</p>
            </>
          ) : (
            <div className={`w-full flex gap-5`}>
              {pubsAssets?.flatMap((d: PublicationAsset) => (
                <div
                  key={d?.publishId}
                  className={`bg-default-100 rounded-xl flex flex-col justify-between items-center gap-1 p-5`}
                >
                  <GoFile size={20} />

                  <h1 className=" text-2xl ">{d?.title}</h1>

                  <Button>
                    <GoDownload
                      size={20}
                      className=" text-primary-500"
                      onClick={() => {
                        downloadPubAsset2(`${d?.assetId}`, `${d?.title}`);
                      }}
                    />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assets End */}
      </div>
    </div>
  );
}
