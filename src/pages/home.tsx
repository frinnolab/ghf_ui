import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { FaMapMarkedAlt, FaUniversity } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup } from "react-icons/fa6";
import { GoArrowDown, GoArrowUpRight } from "react-icons/go";
import { SummaryInfo } from "./dashboard/summary/dash-summary";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { Impact } from "./dashboard/impacts/dash-impacts-list";
import { useNavigate } from "react-router-dom";
import { PartnerType } from "@/types";
export type Partner = {
  label?: string;
  logo?: string;
  type?: PartnerType;
  startYear: number;
};

export default function HomePage() {
  const mainSectionRef = useRef(null);
  const headerTextsRef = useRef(null);
  const headTxtCardRef = useRef<HTMLDivElement | null>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const sumRegRef = useRef<HTMLHeadingElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const api = `${import.meta.env.VITE_API_URL}`;
  const [summaryInfo, setSummarInfo] = useState<SummaryInfo | null>(null);
  const [impacts, setImpacts] = useState<Impact[] | null>(null);
  const navigate = useNavigate();

  const [isPartners, setIsPartners] = useState<boolean>(false);
  const [collabs, setCollabs] = useState<Partner[] | null>(null);
  //const [donors, setDonors] = useState<Partner[]|null>(null);
  const [partners, setPartners] = useState<Partner[] | null>(null);

  useEffect(() => {
    if (summaryInfo === null) {
      axios
        .get(`${api}/settings/summaryinfo`)
        .then((res: AxiosResponse) => {
          console.log(res.data);

          setSummarInfo(() => {
            return {
              regions: {
                label: "Total Regions",
                value: `${res?.data["totalRegions"] ?? 0}`,
              },
              districts: {
                label: "Total Districts",
                value: `${res?.data["totalDistricts"] ?? 0}`,
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
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [summaryInfo]);

  useEffect(() => {
    if (impacts === null) {
      axios
        .get(`${api}/impacts?limit=3`)
        .then((res: AxiosResponse) => {
          console.log(res.data);
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
            console.log(d);

            const resData: Impact = {
              impactId: `${d?.impactId}`,
              assetUrl: d?.assetUrl ?? null,
              title: d?.title,
              schoolName: d?.schoolName,
              schoolRegion: d?.schoolRegion,
              studentsTotal: Number(d?.studentsTotal),
            };
            return [resData];
          });

          setImpacts(() => {
            return [...data];
          });
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
        });
    }
  }, [impacts]);

  //fetch Partners
  useEffect(() => {
    if (!isPartners) {
      axios
        .get(`${api}/partners`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);
          setIsPartners(true);

          //donors & Partners

          const dataP: Partner[] = Array.from(res?.data).flatMap((p: any) => {
            const pData: Partner = {
              label: p?.name,
              logo: p?.logoUrl,
              type: p?.type,
              startYear: Number(p?.startYear),
            };
            return [pData];
          });

          console.log(dataP);

          setPartners(() => {
            return dataP.filter((p) => p?.type !== PartnerType.COLLABORATOR);
          });

          setCollabs(() => {
            return dataP?.filter((p) => p?.type === PartnerType.COLLABORATOR && p.startYear <= 2016);
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [isPartners]);

  const playInftro = () => {
    if (introVideoRef?.current?.paused) {
      setIsPaused(false);
      introVideoRef?.current?.play();
    } else {
      introVideoRef?.current?.pause();
      setIsPaused(true);
    }
  };

  const toImpactDetail = (b: Impact) => {
    navigate(`/impacts/${b?.impactId}`, {
      state: `${b?.impactId}`,
    });
  };

  return (
    <DefaultLayout>
      <div
        ref={mainSectionRef}
        className="w-full flex flex-col items-center justify-center bg-default-50"
      >
        {/* Hero Section */}
        <div className="h-screen w-full flex flex-col justify-center panel panel-main">
          {/* Header Text */}
          <div
            ref={headerTextsRef}
            className="w-full flex flex-col gap-5 z-30 absolute text-end p-10"
          >
            <div className="w-full flex justify-between">
              <div></div>
              <div hidden>
                <Button
                  variant="light"
                  color="primary"
                  className="flex items-center"
                  onClick={() => {
                    window.scrollTo(0, window.innerHeight);
                  }}
                >
                  <GoArrowDown size={20} />
                </Button>
              </div>
              <div
                ref={headTxtCardRef}
                className="flex flex-col space-y-3 font-semibold p-5 shadow-md rounded-3xl bg-default-50/40"
              >
                <h1 className=" text-xl md:text-3xl font-semibold">
                  WE LIVE TO EMPOWER
                </h1>
                <h1 className=" text-xl md:text-3xl font-semibold">DEVELOP</h1>
                <h1 className=" text-xl md:text-3xl font-semibold">
                  AND INSPIRE YOUNG GENERATION
                </h1>
                <h1 className=" text-xl md:text-3xl font-semibold">
                  TO ACQUIRE ENTREPRENEURSHIP
                </h1>
                <h1 className=" text-xl md:text-3xl font-semibold">
                  AND 21ST CENTURY SKILLS
                </h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute">
            <Image
              radius="none"
              alt="Header img"
              src="/assets/images/static/MAIN_PAGE.jpg"
            />
            {/* <img alt="Header img" src="/assets/images/UCT_024_86_2.jpg" /> */}
          </div>
        </div>

        {/* Who We're */}
        <motion.div className="w-full flex flex-col space-y-5 px-20 font-semibold cursor-default z-50 panel panel-intro">
          <div className=" bg-default-200 rounded-2xl p-10 ">
            <h1 className="text-3xl py-3">Who we are</h1>

            <p className="text-xl text-justify">
              Great Hope Foundation (GHF) is a local Non - Governmental
              Organization, legally registered in Tanzania, with a registration
              number of 3976 in 2010. Since its initiation, the NGO has been
              working to develop platforms that capacitate young people with
              both entrepreneurial and 21st Century Skills. We believe in
              bringing the best out of young people, in a way that benefits them
              and the community around them. We aim at being an organization
              that enlightens young people potential, giving them hope and
              courage to bring the very best out of themselves.
            </p>
          </div>
        </motion.div>
        {/* Who We're End */}

        {/* Data Summary Section */}
        <div
          id="infoStats"
          className="w-full flex flex-col justify-center items-center h-screen p-5 cursor-default panel panel-sum"
        >
          {/* <h1 className=" text-5xl ">Data Summary</h1> */}
          <div className="w-full flex  justify-between gap-10 p-10">
            {/* Regions */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-transparent">
              <FaMapMarkedAlt className="text-green-500" size={30} />
              <h1 className=" text-6xl" ref={sumRegRef}>
                {summaryInfo?.regions?.value ?? 0}
              </h1>
              <h1 className=" text-2xl ">Regions Reached</h1>
            </div>

            {/* Districts */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-transparent">
              <FaMapPin className="text-red-500" size={30} />
              <h1 className=" text-6xl ">
                {summaryInfo?.districts?.value ?? 0}
              </h1>
              <h1 className=" text-2xl ">Districts Reached</h1>
            </div>
          </div>

          <div className="w-full flex  justify-between gap-10 p-10">
            {/* Schools */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-transparent">
              <FaUniversity className="text-blue-500" size={30} />
              <h1 className=" text-6xl ">{summaryInfo?.schools?.value ?? 0}</h1>
              <h1 className=" text-2xl ">Schools Reached</h1>
            </div>

            {/* Studentes */}
            <div className="border p-5 shadow flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-transparent">
              <FaPeopleGroup className="text-orange-500" size={30} />
              <h1 className=" text-6xl ">
                {summaryInfo?.students?.value ?? 0}
              </h1>
              <h1 className=" text-2xl ">Students Impacted</h1>
            </div>
          </div>
        </div>
        {/* Data Summary Section End*/}

        {/* Vision Section */}
        <div
          id="aboutInfo"
          className="w-full flex flex-col md:flex-row gap-5 justify-between items-center p-10 bg-orange-500 h-screen panel"
        >
          <div className="flex flex-col w-full space-y-5">
            {/* Our vision */}
            <div className="w-full flex flex-col space-y-5">
              <h1 className="text-5xl py-5 font-semibold">Our vision</h1>

              <p className="text-xl text-balance">
                Great Hope Foundation envisions to build an empowered, developed
                and responsible young generation that contribute significantly
                to the social, economic and political development of the
                continent. We believe youth have tremendous power to bring
                positive change in the community once, appropriate platforms
                have been developed for them to understand their potential and
                bring the best out of it.
              </p>
            </div>

            {/* Our Mission */}
            <div className="w-full flex flex-col space-y-5">
              <h1 className="text-5xl py-5 font-semibold">Our Mission</h1>

              <p className="text-xl text-balance">
                Great Hope Foundation mission is to develop and implement
                programs innovatively, that assist young people to acquire
                appropriate skills that can help them thrive in the labor market
                through either self or formal employment.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col justify-center space-y-5">
            <video
              ref={introVideoRef}
              style={{
                borderRadius: "20px",
              }}
              width={1000}
              src={siteConfig.staticAssets.staticIntroVideo}
              onClick={playInftro}
              muted
              // controls
            />
            <div className=" w-full flex justify-end items-center gap-3 ">
              <p className=" italic text-small ">A word from our founder</p>
              <Button
                variant="flat"
                className=" px-10 py-5 "
                onClick={playInftro}
              >
                {isPaused ? "Play" : "Pause"}
              </Button>
            </div>
          </div>
        </div>
        {/* Vision Section End*/}

        {/* Donors Section */}
        <div
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center p-10 h-screen panel"}`}
        >
          <h1 className=" text-5xl ">Our Partners & Donors</h1>

          <div className="w-full flex justify-between items-center gap-5 p-5">
            {partners?.map((p: Partner, i) => (
              <div key={i} className=" p-10 rounded-2xl text-center ">
                <h1 className=" text-2xl hidden ">{p?.label}</h1>

                <Image
                  width={350}
                  height={350}
                  className={``}
                  src={`${p?.logo}`}
                />
              </div>
            ))}
          </div>
          <div></div>
        </div>
        {/* Donors Section End*/}

        {/* Contact Section */}
        <div className="w-full flex-col justify-center text-center items-center gap-10 p-10 panel hidden">
          <h1 className=" text-5xl ">Current Projects</h1>

          <p className=" text-balance text-2xl hidden ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor
            asperiores veritatis doloremque expedita consequatur maxime.
          </p>
          <h1 className=" text-9xl text-orange-500 ">
            {summaryInfo?.projects?.value ?? 0}
          </h1>

          <Link href="/uwezo">
            View Projects <GoArrowUpRight />{" "}
          </Link>
        </div>
        {/* Contact Section End*/}

        {/* Impacts */}
        <div
          className={`w-full ${impacts === null || impacts?.length === 0 ? "hidden" : "flex items-center"}  bg-default-200 p-10 min-h-screen`}
        >
          {impacts === null || impacts?.length === 0 ? (
            <div className={`w-full flex justify-center items-center`}>
              <p></p>
            </div>
          ) : (
            // <> {impacts?.length}</>
            <div className={`w-full flex flex-col gap-8`}>
              <h1 className=" text-5xl ">Recent Impacts</h1>
              <div className={`w-full flex  gap-10`}>
                {impacts?.flatMap((mp) => (
                  <div
                    key={mp?.impactId}
                    className={`w-[30%] cursor-default flex flex-col rounded-2xl bg-default-100`}
                  >
                    <Image
                      src={`${mp?.assetUrl ?? siteConfig?.staticAssets?.staticLogo}`}
                    />
                    <div className={`p-3 flex flex-col gap-3`}>
                      <h1 className={`text-2xl`}>{mp?.title}</h1>
                      <span className={`flex items-center gap-3`}>
                        <FaUniversity className="text-blue-500" />
                        <p className={`text-md`}>{mp?.schoolName}</p>
                      </span>
                      <span className={`flex items-center gap-3`}>
                        <FaMapMarkedAlt className="text-green-500" />
                        <p className={`text-md`}>{mp?.schoolRegion}</p>
                      </span>

                      <span className={`flex items-center gap-3`}>
                        <FaPeopleGroup className="text-orange-500" />
                        <p className={`text-md`}>{mp?.studentsTotal}</p>
                      </span>

                      <div className="p-1">
                        <Button
                          variant="light"
                          color="primary"
                          className="flex items-center"
                          onClick={() => {
                            toImpactDetail(mp);
                          }}
                        >
                          View Impact <GoArrowUpRight size={20} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`w-full flex items-center justify-center`}>
                <Link
                  href={`impacts`}
                  className="flex text-center rounded p-2 border border-transparent bg-primary text-default-100"
                >
                  View all impacts <GoArrowUpRight />{" "}
                </Link>
              </div>
            </div>
          )}
        </div>
        {/* Impacts End */}

        {/* Collaborators */}
        <div
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center p-10 h-screen panel"}`}
        >
          <h1 className=" text-5xl ">Collaborators Since 2016</h1>

          <div className="w-full flex justify-between items-center gap-5 p-5">
            {collabs?.map((p: Partner, i) => (
              <div key={i} className=" p-10 rounded-2xl text-center ">
                <h1 className=" text-2xl hidden ">{p?.label}</h1>

                <Image
                  width={250}
                  height={250}
                  className={``}
                  src={`${p?.logo}`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Collaborators End */}
      </div>
    </DefaultLayout>
  );
}
