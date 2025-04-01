/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable import/order */
import * as motion from "motion/react-client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Image,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaMapMarkedAlt, FaUniversity } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup } from "react-icons/fa6";
import { GoArrowRight, GoArrowUpRight } from "react-icons/go";
import { siteConfig } from "@/config/site";
import { Impact } from "./dashboard/impacts/dash-impacts-list";
import CountUp from "react-countup";
import { PartnerType } from "@/types";
import {
  Donation,
  DonationCurrencyType,
  DonationType,
} from "./dashboard/donations/dash-donations-list";
import { SubmitHandler, useForm } from "react-hook-form";
import { Blog } from "./dashboard/blog/dash-blogs";
import { useNavigate } from "react-router-dom";
// import { SummaryInfo } from "./dashboard/summary/dash-summary";
import { CompanyInfo, StatsInfo } from "./dashboard/settings/dash-settings";
import DefaultLayout from "@/layouts/default";
export type Partner = {
  label?: string;
  logo?: string;
  type?: PartnerType;
  startYear: number;
};

export default function HomePage() {
  const mainSectionRef = useRef(null);
  const headerTextsRef = useRef(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  // const [isInfoloading, setIsInfoloading] = useState<boolean>(true);
  const api = `${import.meta.env.VITE_API_URL}`;
  //const [summaryInfo, setSummarInfo] = useState<SummaryInfo | null>(null);
  const [impacts, setImpacts] = useState<Impact[] | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [statsInfo, setStatsInfo] = useState<StatsInfo | null>(null);

  const [isPartners, setIsPartners] = useState<boolean>(false);
  const [collabs, setCollabs] = useState<Partner[] | null>(null);
  //const [donors, setDonors] = useState<Partner[]|null>(null);
  const [partners, setPartners] = useState<Partner[] | null>(null);
  const [donation] = useState<Donation | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isIntroVideo, setIsIntrovideo] = useState<boolean>(false);
  // const [, setIsIntrovideo] = useState<boolean>(false);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);

  const [donationTypes, setDonationTypes] = useState<DonationType[] | null>(
    null
  );

  const [selectedDonorType, setSelectedselectedDonorType] =
    useState<DonationType>();

  const [currencyTypes, setCurrencyTypes] = useState<
    DonationCurrencyType[] | null
  >(null);

  const [selectedDonorCurrType, setSelectedselectedDonorCurrType] =
    useState<DonationCurrencyType>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Donation>();
  const onDonationSubmit: SubmitHandler<Donation> = (d) => {
    setIsloading(true);

    onSaveDonor(d);
  };

  const changeDonorType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = donationTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setSelectedselectedDonorType(statusVal);
  };

  const changeDonorCurrType = (e: ChangeEvent<HTMLSelectElement>) => {
    const statusVal = currencyTypes?.find(
      (p) => p?.type === Number(e.target.value)
    );

    setSelectedselectedDonorCurrType(statusVal);
  };

  const fetchStatInfo = () => {
    if (statsInfo === null) {
      setIsloading(true);

      axios
        .get(`${api}/settings/statsinfo`)
        .then((res: AxiosResponse) => {
          if (res?.data["introVideoUrl"]) {
            setIsIntrovideo(true);
          }

          setCompanyInfo(res?.data);

          const data: StatsInfo = {
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
  const fetchCompanyinfo = () => {
    if (companyInfo === null) {
      setIsloading(true);

      axios
        .get(`${api}/settings/companyinfo`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          if (res?.data["introVideoUrl"]) {
            setIsIntrovideo(true);
          }

          setCompanyInfo(res?.data);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        })
        .catch((err: AxiosError) => {
          console.log(err.response);
          setCompanyInfo(null);

          setTimeout(() => {
            setIsloading(false);
          }, 2000);
        });
    }
  };

  // const fetchSummaryinfo = () => {
  //   if (summaryInfo === null) {
  //     axios
  //       .get(`${api}/settings/summaryinfo`)
  //       .then((res: AxiosResponse) => {
  //         setSummarInfo(() => {
  //           return {
  //             regions: {
  //               label: "Total Regions",
  //               value: `${res?.data["totalRegions"] ?? 0}`,
  //             },
  //             districts: {
  //               label: "Total Districts",
  //               value: `${res?.data["totalDistricts"] ?? 0}`,
  //             },
  //             schools: {
  //               label: "Total Schools",
  //               value: `${res?.data["totalSchools"]}`,
  //             },
  //             students: {
  //               label: "Total Students",
  //               value: `${res?.data["totalStudents"]}`,
  //             },
  //             projects: {
  //               label: "Total Projects",
  //               value: `${res?.data["totalProjects"]}`,
  //             },
  //           };
  //         });
  //       })
  //       .catch((err: AxiosError) => {
  //         console.log(err.response);
  //       });
  //   }
  // };

  const fetchBlogs = () => {
    if (blogs === null) {
      axios
        .get(`${api}/blogs?limit=3&&isArchived=false`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          // console.log(res?.data);

          const datas: Blog[] = Array.from(res?.data).flatMap((b: any) => {
            const data: Blog = {
              blogId: b?.blogId,
              authorId: b?.authorId,
              title: b?.title ?? "",
              description: b?.description ?? "",
              thumbnailUrl: b?.thumbnailUrl ?? "",
              isArchived: Boolean(b?.isArchived ?? false),
            };

            return [data];
          });

          setBlogs(datas);
        })
        .catch((err: AxiosError) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  };

  const onSaveDonor = (p: Donation) => {
    const data: Donation = {
      amountPledged: p?.amountPledged,
      company: p?.company,
      description: p?.description,
      email: p?.email,
      firstname: p?.firstname,
      lastname: p?.lastname,
      mobile: p?.mobile,
      donorCurrencyType: Number(`${selectedDonorCurrType?.type ?? 0}`),
      donorType: Number(`${selectedDonorType?.type ?? 0}`),
      statusType: 0,
    };

    axios
      .post(`${api}/donations`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res) {
          setIsloading(false);
          alert("Successfully Submitted.");
        }
      })
      .catch((err: AxiosError) => {
        setIsloading(false);
        alert(JSON.stringify(err?.response));
      });
  };

  const fetchDonationTypes = () => {
    let data: DonationType[] = [];

    axios
      .get(`${api}/donations/types`)
      .then((res: AxiosResponse) => {
        data = Array.from(res?.data).flatMap((d: any) => {
          const dType: DonationType = {
            title: d?.title,
            type: Number(d?.type),
          };

          return [dType];
        });

        setDonationTypes([...data]);
      })
      .catch((err: AxiosError) => {
        console.log(err.response);

        return null;
      });
  };

  const fetchCurrencyTypes = () => {
    let data: DonationCurrencyType[] = [];

    axios
      .get(`${api}/donations/currencies`)
      .then((res: AxiosResponse) => {
        data = Array.from(res?.data).flatMap((d: any) => {
          const dType: DonationCurrencyType = {
            title: d?.title,
            type: Number(d?.type),
            shortName: d?.shortname,
          };

          return [dType];
        });

        setCurrencyTypes([...data]);
      })
      .catch((err: AxiosError) => {
        console.log(err.response);

        return null;
      });
  };

  useEffect(() => {
    fetchStatInfo();
    //setIsInfoloading(true);
    fetchCompanyinfo();
    //fetchSummaryinfo();
    //setIsInfoloading(false);
  }, []);

  useEffect(() => {
    if (impacts === null) {
      axios
        .get(`${api}/impacts?limit=3`)
        .then((res: AxiosResponse) => {
          const data: Impact[] = Array.from(res?.data).flatMap((d: any) => {
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

          setPartners(() => {
            return dataP.filter((p) => p?.type !== PartnerType.COLLABORATOR);
          });

          setCollabs(() => {
            return dataP?.filter(
              (p) => p?.type === PartnerType.COLLABORATOR && p.startYear <= 2016
            );
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [isPartners]);

  //fetch Donations
  useEffect(() => {
    fetchBlogs();
    fetchCurrencyTypes();
    fetchDonationTypes();
  }, []);

  const playInftro = () => {
    if (introVideoRef?.current?.paused) {
      setIsPaused(false);
      introVideoRef?.current?.play();
      // !introVideoRef?.current?.muted
    } else {
      introVideoRef?.current?.pause();
      setIsPaused(true);
    }
  };

  return (
    <DefaultLayout>
      {/* Container */}
      <motion.div
        ref={mainSectionRef}
        className="w-full flex flex-col items-center justify-center "
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
        {/* Hero Section */}

        <div hidden>
          {/* New Hero */}
          <motion.div className="w-full h-screen">
            <div className="absolute top-[-20%] z-0">
              <Image
                alt="Header img"
                className=""
                radius="none"
                src="/assets/images/static/MAIN_PAGE.jpg"
              />
            </div>
            {/* <h1> New Hero</h1> */}
          </motion.div>
          {/* New Hero End */}

          {/* New Header Texts */}
          <div className="w-full z-10 flex text-center justify-center p-10">
            <motion.h1
              className={`text-black text-3xl md:text-4xl font-semibold uppercase text-justify `}
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  delay: 0.5,
                  duration: 0.8,
                  ease: "linear",
                },
              }}
            >
              We design innovative platforms and projects that equip young
              people with entrepreneurial and 21st-century skills, preparing
              them for a seamless transition into the marketplace
            </motion.h1>
          </div>
          {/* New Header Texts End */}
        </div>

        <div>
          <div className="h-[25dvh] md:h-screen  w-full flex flex-col justify-center items-center panel panel-main">
            {/* Header Text */}
            <div
              ref={headerTextsRef}
              className=" flex flex-col items-center gap-5 md:top-[65%] top-[15%] z-30 absolute p-10"
            >
              <motion.div className="w-full flex flex-col  md:flex-row items-center gap-1 text-center md:text-5xl text-white  font-semibold p-5  rounded-xl">
                {/* <div/> */}
                <motion.h1
                  className={` uppercase text-balance md:pt-5`}
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    transition: {
                      delay: 0.5,
                      duration: 0.8,
                      ease: "linear",
                    },
                  }}
                >
                  We design innovative platforms and projects that equip young
                  people with entrepreneurial and 21st-century skills, preparing
                  them for a seamless transition into the marketplace
                </motion.h1>
              </motion.div>
            </div>
            {/* Header Text End*/}

            <div className="absolute top-[-3%] md:top-[-20%] z-0">
              <Image
                alt="Header img"
                radius="none"
                src="/assets/images/static/MAIN_PAGE.jpg"
              />
            </div>
          </div>
        </div>

        {/* Hero Section End */}

        {/* Who We're */}
        <div>
          <div className="w-full flex flex-col gap-5 md:space-y-5 px-5 md:px-10 font-semibold cursor-default panel panel-intro md:relative md:pt-[5%] z-30 ">
            <motion.div
              // animate={{ opacity: 1, scale: 1 }}
              className=" bg-primary rounded-2xl p-10 text-default-50 "
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.3,
                  ease: "linear",
                  // ease: [0, 0.71, 0.2, 1.01],
                },
              }}
            >
              <motion.h1
                className="md:text-3xl text-2xl py-3"
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: 0.5,
                    duration: 0.8,
                    ease: "linear",
                  },
                }}
              >
                Who we are
              </motion.h1>

              <motion.p
                className="md:text-xl text-justify"
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: 0.7,
                    duration: 0.9,
                    ease: "linear",
                  },
                }}
              >
                {/* Great Hope Foundation (GHF) is a local Non - Governmental
              Organization, legally registered in Tanzania, with a registration
              number of 3976 in 2010. Since its initiation, the NGO has been
              working to develop platforms that capacitate young people with
              both entrepreneurial and 21st Century Skills. We believe in
              bringing the best out of young people, in a way that benefits them
              and the community around them. We aim at being an organization
              that enlightens young people potential, giving them hope and
              courage to bring the very best out of themselves. */}
                Great Hope Foundation has been empowering youth for over a
                decade, equipping them with entrepreneurial and 21st-century
                skills to thrive in the marketplace. Our flagship initiative,
                the UWEZO PROGRAM, has empowered over 6,700 young people since
                2016. As a nonprofit, we believe in investing in young minds
                today to build a thriving society tomorrow. Through education,
                mentorship, and leadership programs, we’re shaping the next
                generation of leaders who will drive change in their
                communities. Join us in creating a brighter future, because when
                young minds are empowered, the world transforms
              </motion.p>
            </motion.div>

            <div className={`w-full flex items-center justify-center`}>
              <Link
                className="flex text-center rounded-xl p-3 border border-transparent bg-primary text-default-100"
                href={`whatwedo`}
              >
                What we do <GoArrowUpRight />{" "}
              </Link>
            </div>
          </div>
        </div>
        {/* Who We're End */}

        {/* Data Summary Section */}
        <div
          className="w-full p-5 md:p-0 xl:h-[60%] md:h-screen flex flex-col gap-5 md:gap-0 justify-center items-center cursor-default panel panel-sum "
          id="infoStats"
        >
          {/* <h1 className=" text-5xl ">Data Summary</h1> */}
          <div className="w-full flex md:flex-row flex-col justify-between gap-5 md:gap-10 md:p-10 ">
            {/* Regions */}
            <div className=" border-3 border-transparent p-5 flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-orange-400 bg-default-100">
              <FaMapMarkedAlt className="text-green-500" size={30} />
              {/* <h1 className=" text-6xl" ref={sumRegRef}>
                {summaryInfo?.regions?.value ?? 0}
              </h1> */}

              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.regionsReached ?? 0)}
                separator=" "
              />
              <h1 className=" text-2xl ">Regions Reached</h1>
            </div>

            {/* Districts */}
            <div className="border-3 border-transparent p-5 flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-orange-400 bg-default-100">
              <FaMapPin className="text-red-500" size={30} />
              {/* <h1 className=" text-6xl ">
                {summaryInfo?.districts?.value ?? 0}
              </h1> */}
              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.districtsReached ?? 0)}
                separator=","
              />
              <h1 className=" text-2xl ">Districts Reached</h1>
            </div>
          </div>

          <div className="w-full flex md:flex-row flex-col justify-between gap-5 md:gap-10 md:p-10">
            {/* Schools */}
            <div className="border-3 border-transparent p-5 flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-orange-400 bg-default-100">
              <FaUniversity className="text-blue-500" size={30} />
              {/* <h1 className=" text-6xl ">{summaryInfo?.schools?.value ?? 0}</h1> */}
              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.schoolsReached ?? 0)}
                separator=","
              />
              <h1 className=" text-2xl ">Schools Reached</h1>
            </div>

            {/* Studentes */}
            <div className="border-3 border-transparent p-5 flex flex-col gap-5 rounded-2xl w-full hover:bg-orange-300 hover:border-orange-400 bg-default-100">
              <FaPeopleGroup className="text-orange-500" size={30} />
              {/* <h1 className=" text-6xl ">
                {summaryInfo?.students?.value ?? 0}
              </h1> */}
              <CountUp
                className="text-6xl"
                duration={10}
                end={Number(statsInfo?.studentsImpacted ?? 0)}
                separator=","
              />
              <h1 className=" text-2xl ">Students Impacted</h1>
            </div>
          </div>
        </div>
        {/* Data Summary Section End*/}

        {/* New About Simple */}
        <div hidden>
          <div className="w-full flex flex-col gap-5 md:space-y-5 p-10 font-semibold cursor-default panel panel-intro md:relative z-30  bg-sky-300">
            <motion.div
              // animate={{ opacity: 1, scale: 1 }}
              className=" rounded-2xl p-10 text-black "
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.3,
                  ease: "linear",
                  // ease: [0, 0.71, 0.2, 1.01],
                },
              }}
            >
              <motion.h1
                className="md:text-4xl text-3xl py-3 font-semibold uppercase"
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: 0.5,
                    duration: 0.8,
                    ease: "linear",
                  },
                }}
              >
                Who we are
              </motion.h1>

              <motion.p
                className="md:text-3xl text-2xl text-justify"
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: 0.7,
                    duration: 0.9,
                    ease: "linear",
                  },
                }}
              >
                {/* Great Hope Foundation (GHF) is a local Non - Governmental
              Organization, legally registered in Tanzania, with a registration
              number of 3976 in 2010. Since its initiation, the NGO has been
              working to develop platforms that capacitate young people with
              both entrepreneurial and 21st Century Skills. We believe in
              bringing the best out of young people, in a way that benefits them
              and the community around them. We aim at being an organization
              that enlightens young people potential, giving them hope and
              courage to bring the very best out of themselves. */}
                Great Hope Foundation has been empowering youth for over a
                decade, equipping them with entrepreneurial and 21st-century
                skills to thrive in the marketplace. Our flagship initiative,
                the UWEZO PROGRAM, has empowered over 6,700 young people since
                2016. As a nonprofit, we believe in investing in young minds
                today to build a thriving society tomorrow. Through education,
                mentorship, and leadership programs, we’re shaping the next
                generation of leaders who will drive change in their
                communities. Join us in creating a brighter future, because when
                young minds are empowered, the world transforms
              </motion.p>
            </motion.div>

            <div className={`w-full flex items-center justify-center`}>
              <Link
                className="flex text-center rounded p-3 border border-transparent bg-orange-500 text-black hover:border-orange-500 hover:bg-transparent hover:text-orange-500"
                href={`whatwedo`}
              >
                What we do <GoArrowUpRight />{" "}
              </Link>
            </div>
          </div>
        </div>
        {/* New About Simple End */}

        {/* Vision Section */}
        <div
          // className="hidden"
          className={`w-full ${!isIntroVideo ? "hidden" : "flex flex-col gap-5 justify-center items-center p-5 md:p-10 bg-orange-500 md:h-screen panel"} `}
          id="aboutInfo"
        >
          <div
          // className={`w-full flex flex-col justify-center items-center space-y-5`}
          >
            {/* <h1 className="md:text-3xl text-2xl py-3">Introduction</h1> */}

            <div className="flex flex-col gap-5 md:drop-shadow-2xl">
              <video
                ref={introVideoRef}
                controls
                disablePictureInPicture
                muted
                className=" md:w-[1000px]"
                src={companyInfo?.introVideoUrl}
                style={{
                  borderRadius: "20px",
                }}
                onClick={() => {
                  playInftro();
                }}
              />
              <div className=" w-full hidden">
                {/* <p className=" italic text-small "></p> */}
                <Button
                  className=" px-10 py-5 "
                  variant="flat"
                  onClick={playInftro}
                >
                  {isPaused ? "Play" : "Pause"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Vision Section End*/}

        {/* Donors Section */}
        <motion.div
          initial={{ opacity: 0 }}
          transition={{
            duration: 1,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          whileInView={{ opacity: 1 }}
          // eslint-disable-next-line react/jsx-sort-props
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center p-5 md:p-10 panel"}`}
        >
          <h1 className=" text-3xl md:text-5xl font-semibold text-black py-3">
            Our Partners & Donors
          </h1>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-5 p-5">
            {partners?.map((p: Partner, i) => (
              <motion.div
                key={i}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-[50dvh] rounded-2xl flex flex-col justify-center items-center text-center bg-white"
                initial={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                }}
                whileHover={{
                  opacity: 1,
                  scale: 1.05,
                  transition: { duration: 0.5 },
                }}
              >
                {/* <h1 className=" text-2xl hidden ">{p?.label}</h1> */}

                <Image src={`${p?.logo}`} width={350} />

                {/* <div className="w-full bg-green-600 p-3 flex self-end align-baseline" /> */}
              </motion.div>
            ))}
          </div>
          {/* <div></div> */}
        </motion.div>
        {/* Donors Section End*/}

        {/* Collaborators */}
        <motion.div
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center md:p-10 panel text-black"}`}
          initial={{ opacity: 0 }}
          transition={{
            duration: 1,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          whileInView={{ opacity: 1 }}
        >
          <div className={`w-full space-y-3 p-3 text-center`}>
            <h1 className="text-3xl md:text-5xl font-semibold">
              Collaborators
            </h1>
            <p className="md:text-2xl">
              Happy to have worked with these organization since 2016
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row md:justify-start flex-wrap  justify-center items-center ">
            {collabs?.map((p: Partner) => (
              <motion.div
                key={p?.logo}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    default: { type: "spring" },
                    opacity: { ease: "linear" },
                  },
                }}
                className="p-2 rounded-lg flex flex-col justify-center items-center text-center "
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.5 },
                }}
              >
                {/* <h1 className=" text-2xl hidden ">{p?.label}</h1> */}

                <Image
                  className={`h-[100px] w-[100px] md:h-[150px] md:w-[150px]`}
                  src={`${p?.logo}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Collaborators End */}

        {/* Donations */}
        <div
          className={`${"w-full h-screen md:h-[auto] bg-default-200  hidden gap-5 justify-center items-center p-10 panel"}`}
        >
          <div className={`w-full space-y-3 text-center`}>
            <h1 className="text-3xl  md:text-5xl ">Donations</h1>
            <p className="text-xl md:text-2xl text-default-500 ">
              To pledge donation, please fill in the form.
            </p>
          </div>

          <div className=" shadow rounded-2xl bg-default-50 p-5 ">
            {isLoading ? (
              <Spinner
                className={` justify-center items-center `}
                label="Submitting..."
              />
            ) : (
              <form
                className=" flex flex-col gap-3 p-5 space-y-2"
                onSubmit={handleSubmit(onDonationSubmit)}
              >
                {/* Fullnames */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Fname */}
                  <div className="w-full space-y-2">
                    <label htmlFor="Firstname">Firstname</label>
                    <Input
                      defaultValue={`${donation?.firstname ?? ""}`}
                      type="text"
                      {...register("firstname", { required: true })}
                      placeholder={`${donation?.firstname ?? "Enter Firstname"}`}
                    />

                    {errors.firstname && (
                      <span className="text-danger">
                        Firstname field is required
                      </span>
                    )}
                  </div>

                  {/* Lname */}
                  <div className="w-full space-y-2">
                    <label htmlFor="Lastname">Lastname</label>
                    <Input
                      defaultValue={`${donation?.lastname ?? ""}`}
                      type="text"
                      {...register("lastname")}
                      placeholder={`${donation?.lastname ?? "Enter Lastname"}`}
                    />
                  </div>
                </div>

                {/* Fullnames End*/}

                {/* Contact */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Email */}
                  <div className="w-full space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      defaultValue={`${donation?.email ?? ""}`}
                      type="text"
                      {...register("email", { required: true })}
                      placeholder={`${donation?.email ?? "Enter email"}`}
                    />

                    {errors.email && (
                      <span className="text-danger">
                        Email field is required
                      </span>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="w-full space-y-2">
                    <label htmlFor="mobile">Mobile</label>
                    <Input
                      isRequired
                      defaultValue={`${donation?.mobile ?? ""}`}
                      type="text"
                      {...register("mobile")}
                      placeholder={`${donation?.mobile ?? "Enter mobile"}`}
                    />
                  </div>
                </div>

                {/* Contact End*/}

                {/* Types */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Type */}
                  {donationTypes === null ? (
                    <></>
                  ) : (
                    <div className="w-full space-y-2">
                      <label htmlFor="donorType">Donor</label>
                      <Select
                        isRequired
                        className="max-w-xs"
                        label="Select Donor Type"
                        onChange={(e) => {
                          changeDonorType(e);
                        }}
                      >
                        {donationTypes?.map((status) => (
                          <SelectItem key={`${status.type}`}>
                            {status.title}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* Company */}
                  <div className="w-full space-y-2">
                    <label htmlFor="company">Company</label>
                    <Input
                      defaultValue={`${donation?.company ?? ""}`}
                      type="text"
                      {...register("company")}
                      placeholder={`${donation?.company ?? "Enter company"}`}
                    />
                  </div>
                </div>

                {/* Types End*/}

                {/* Currencies */}
                <div className="w-full gap-5 flex justify-between items-center">
                  {/* Currency Type */}

                  {currencyTypes === null ? (
                    <></>
                  ) : (
                    <div className="w-full space-y-2">
                      <label htmlFor="currency">Currency</label>
                      <Select
                        isRequired
                        className="max-w-xs"
                        label="Select Currency Type"
                        onChange={(e) => {
                          changeDonorCurrType(e);
                        }}
                      >
                        {currencyTypes?.map((status) => (
                          <SelectItem key={`${status.type}`}>
                            {status.shortName}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}

                  {/* Pledge */}
                  <div className="w-full space-y-2">
                    <label htmlFor="amount">Amount</label>
                    <Input
                      defaultValue={`${donation?.amountPledged ?? ""}`}
                      min={0}
                      type="number"
                      {...register("amountPledged")}
                      placeholder={`${donation?.amountPledged ?? "Enter Amount Pledge"}`}
                    />
                  </div>
                </div>

                {/* Editor */}
                <div className="w-full space-y-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    defaultValue={`${donation?.description ?? ""}`}
                    type="text"
                    {...register("description")}
                    placeholder={`${donation?.description ?? "Enter Description"}`}
                  />
                </div>

                {/* Actions */}
                <div className="w-full space-y-2 flex items-center justify-end">
                  <Button color="primary" type="submit">
                    {"Submit"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* Donations End */}

        {/* Recent Projects */}
        <div
          // className="hidden"
          className={`w-full ${blogs?.length === 0 || null ? "hidden" : "md:h-screen bg-default-100  flex flex-col gap-5 justify-center items-center p-10 panel"}`}
        >
          <div className={`w-full space-y-3 text-center`}>
            <h1 className="text-3xl  md:text-5xl font-semibold text-black ">
              Recent Blogs
            </h1>
            <p className="text-xl md:text-2xl text-default-500 ">
              {/* View our recent Blogs */}
            </p>
          </div>

          <div className="w-full flex justify-center ">
            {blogs === null ? (
              <Spinner
                className={` justify-center items-center `}
                label="Loading..."
              />
            ) : (
              <div className={`w-full flex flex-col gap-3`}>
                <motion.div
                  className={`w-full ${blogs?.length === 0 ? "hidden" : "  flex flex-col md:flex-row md:justify-start items-center gap-5"}`}
                >
                  {blogs?.map((p) => (
                    <motion.div
                      key={p?.blogId}
                      className={` w-full md:w-[32%] rounded-xl bg-default-200 flex flex-col justify-between`}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        scale: [null, 1, 1.05],
                        zIndex: 100,
                        transition: {
                          duration: 0.3,
                          delay: 0.2,
                          times: [0, 0.2, 0.5],
                          ease: ["easeInOut", "easeOut"],
                        },
                      }}
                    >
                      <Image
                        className={`w-screen h-[30vh] object-cover rounded-b-none`}
                        src={
                          p?.thumbnailUrl !== "" || null
                            ? p?.thumbnailUrl
                            : siteConfig?.staticAssets?.staticLogo
                        }
                      />

                      <div className={`w-full flex flex-col justify-between`}>
                        <h1 className=" text-xl font-semibold p-5 ">
                          {p?.title}
                        </h1>

                        <div className="w-full p-1 flex justify-end">
                          <Button
                            className="text-sm font-normal  text-orange-500 bg-transparent hover:bg-orange-500  hover:text-black"
                            // variant="light"
                            onClick={() => {
                              navigate(`blog/${p?.blogId}`, {
                                state: `${p?.blogId}`,
                              });
                            }}
                          >
                            Read more <GoArrowRight size={20} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex justify-end p-5">
                  <a className=" text-orange-500 " href="/blog">
                    View all blogs
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Recent Projects End */}
      </motion.div>
      {/* Container End */}
    </DefaultLayout>
  );
}
