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
import {
  Divider,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
// import fileDownload from "js-file-download";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
// import { Document, Page } from "react-pdf";

export default function PublicationsView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const route = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // const [numPages, setNumPages] = useState<number>();
  // const [pageNumber, setPageNumber] = useState<number>(1);

  const [publishId] = useState<string | null>(() => {
    if (route?.state) {
      return `${route?.state["detailId"]}`;
    }

    return null;
  });

  const [publication, setPublication] = useState<Publication | null>(null);
  const [pubsAssets, setPubsAssets] = useState<PublicationAsset[] | null>(null);

  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }

  useEffect(() => {
    setIsloading(true);
    window.scrollTo(0, 0);
    if (!publication) {
      axios
        .get(`${api}/publications/${publishId}`)
        .then((res: AxiosResponse) => {
          const data: Publication = {
            publishId: `${res.data["publishId"]}`,
            title: res?.data["title"],
            description: res?.data["description"] ?? "",
            publishType: Number(`${res.data["publishType"] ?? 0}`),
            publishDate: res?.data["publishDate"],
          };

          setPublication(data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.error(err);
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
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(err?.response));
        });
    }
  }, [publication]);

  // function downloadPubAsset2(assetId: string, filename: string = "") {
  //   axios({
  //     headers: {
  //       "Content-Type": "application/octet-stream",
  //     },
  //     url: `${api}/publications/assets/${assetId}`, //your url
  //     method: "GET",
  //     responseType: "blob", // important
  //   }).then((res: AxiosResponse) => {
  //     console.error(res);

  //     const contentType = res.headers["content-type"];

  //     fileDownload(res?.data, filename, contentType);
  //   });
  // }

  // function fetchFile(assetId: string) {
  //   alert(`${api}/publications/assets/${publishId}`);
  //   // fetch(`${api}/publications/assets/${assetId}`, {
  //   //   mode: "no-cors",
  //   // })
  //   //   .then((d) => {
  //   //     console.log(d.blob());
  //   //   })
  //   //   .then((v) => {
  //   //     console.log(v);
  //   //   })
  //   //   .catch((e) => {
  //   //     console.log("Error: " + e);
  //   //   });

  //   // axios({
  //   //   headers: {
  //   //     "Content-Type": "application/octet-stream",
  //   //     Accept: "application/pdf",
  //   //   },
  //   //   url: `${api}/publications/assets/${assetId}`, //your url
  //   //   method: "GET",
  //   //   responseType: "blob", // important
  //   // })
  //   //   .then((res) => {
  //   //     // Validate response
  //   //     const contentType = res.headers["content-type"];

  //   //     if (!contentType || !contentType.includes("pdf")) {
  //   //       // throw new Error("Invalid file format received");

  //   //       alert("Invalid file format received");
  //   //     }
  //   //     const blob = new Blob([res.data], { type: "application/pdf" });
  //   //     const blobUrl = URL.createObjectURL(blob);

  //   //     //setPdfUrl(URL.createObjectURL(blob));

  //   //     // Open in new tab
  //   //     window.open(blobUrl, "_blank");
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error("Error fetching the PDF:", error);
  //   //   });
  // }

  const viewDocument = (p: PublicationAsset) => {
    if (p?.assetUrl === null) {
      alert("No Document found");
    } else {

      window.open(p?.assetUrl, "_blank");
    }
  };

  return (
    <div className="w-full">
      <div className="w-full p-5">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate(route?.state["path"]);
            // window.location.origin
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
        <div className="w-full flex flex-col gap-5 p-10">
          <div className=" space-y-5 ">
            <h1 className="text-3xl">{publication?.title}</h1>
          </div>

          <Divider />

          <div className=" space-y-5 ">
            {/* <label htmlFor="description">Description</label> */}
            <div
              dangerouslySetInnerHTML={{
                __html: `${publication?.description ?? ""}`,
              }}
              className={` ${publication?.description ? "text-xl text-balance p-5 bg-default-200" : "hidden"} `}
            />
          </div>

          {/* Assets */}
          <div
            className={`w-full flex flex-col gap-5 overflow-y-scroll h-[80dvh] p-3 scrollbar-hide`}
          >
            {/* <h1 className="text-3xl">{publication?.title} assets</h1> */}

            {pubsAssets === null || pubsAssets?.length === 0 ? (
              <>
                {/* <p className=" text-center ">No Asset(s) for Publication</p> */}
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

                    {/* <p>{d?.assetUrl}</p> */}

                    <Button
                      // onPress={onOpen}
                      onClick={() => {
                        //fetchFile(`${d?.assetId}`);

                        viewDocument(d);

                        // downloadPubAsset2(`${d?.assetId}`);
                      }}
                    >
                      <GoDownload
                        className=" text-primary-500"
                        size={20}

                        // onClick={() => {
                        //   downloadPubAsset2(`${d?.assetId}`, `${d?.title}`);
                        // }}
                      />
                    </Button>

                    {/* {pdfUrl && (
                      <iframe
                        title="test"
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                      />
                    )} */}

                    <Modal
                      backdrop="blur"
                      isOpen={isOpen}
                      size="2xl"
                      onOpenChange={onOpenChange}
                    >
                      <ModalContent>
                        {() => (
                          <>
                            <ModalHeader>
                              <h1>{d?.title}</h1>
                            </ModalHeader>

                            <ModalBody>
                              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <Viewer fileUrl={`${d?.assetUrl}`} />
                              </Worker>
                            </ModalBody>
                          </>
                        )}
                      </ModalContent>

                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assets End */}
        </div>
      )}
    </div>
  );
}
