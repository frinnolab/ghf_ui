import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Image, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import axios, { AxiosResponse, AxiosError } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaMapMarkedAlt, FaUniversity } from "react-icons/fa";
import { FaMapPin, FaPeopleGroup } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { SummaryInfo } from "./dashboard/summary/dash-summary";
import { siteConfig } from "@/config/site";
import { Impact } from "./dashboard/impacts/dash-impacts-list";
import { useNavigate } from "react-router-dom";
import { PartnerType } from "@/types";
import {
  Donation,
  DonationCurrencyType,
  DonationType,
} from "./dashboard/donations/dash-donations-list";
import { SubmitHandler, useForm } from "react-hook-form";
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
  const [donation] = useState<Donation | null>(null);

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

  const { register, handleSubmit } = useForm<Donation>();
  const onDonationSubmit: SubmitHandler<Donation> = (d) => {
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
          alert("Successfully Submitted.");
        }
      })
      .catch(() => {});
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
    if (summaryInfo === null) {
      axios
        .get(`${api}/settings/summaryinfo`)
        .then((res: AxiosResponse) => {
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

          console.log(dataP);

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
    fetchCurrencyTypes();
    fetchDonationTypes();
  }, []);

  const playInftro = () => {
    if (introVideoRef?.current?.paused) {
      setIsPaused(false);
      introVideoRef?.current?.play();
    } else {
      introVideoRef?.current?.pause();
      setIsPaused(true);
    }
  };


  return (
    <DefaultLayout>
      <div
        ref={mainSectionRef}
        className="w-full flex flex-col items-center justify-center bg-default-50"
      >
        {/* Hero Section */}
        <div className="h-[90dvh] md:h-screen  w-full flex flex-col justify-center items-center panel panel-main">
          {/* Header Text */}
          <div
            ref={headerTextsRef}
            className=" flex flex-col items-center gap-5 md:top-[85%] top-[15%] z-30 absolute p-10"
          >
            <div className="w-full flex flex-col md:flex-row items-center gap-1 text-center md:text-xl  font-semibold p-5 shadow-md rounded-xl bg-default-50/50">
              <h1>WE LIVE TO EMPOWER,</h1>
              <h1>DEVELOP</h1>
              <h1>AND INSPIRE YOUNG GENERATION</h1>
              <h1>TO ACQUIRE ENTREPRENEURSHIP</h1>
              <h1>AND 21ST CENTURY SKILLS</h1>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-16 md:top-[-1%] xl:top-[3%] ">
            <Image
              radius="none"
              alt="Header img"
              src="/assets/images/static/MAIN_PAGE.jpg"
            />
            {/* <img alt="Header img" src="/assets/images/UCT_024_86_2.jpg" /> */}
          </div>

        </div>

        {/* Who We're */}
        <div className="w-full flex flex-col gap-5 md:space-y-5 px-5 md:px-20 font-semibold cursor-default panel panel-intro absolute top-[50%] md:relative z-30">
          <div className=" bg-default-200 rounded-2xl p-10 ">
            <h1 className="md:text-3xl text-2xl py-3">Who we are</h1>

            <p className="md:text-xl text-justify">
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

          <div className={`w-full flex items-center justify-center`}>
            <Link
              href={`whatwedo`}
              className="flex text-center rounded p-3 border border-transparent bg-primary text-default-100"
            >
              What we do <GoArrowUpRight />{" "}
            </Link>
          </div>
        </div>
        {/* Who We're End */}

        {/* Data Summary Section */}
        <div
          id="infoStats"
          className="w-full xl:h-[60%] md:h-screen flex flex-col gap-5 md:gap-0 justify-center items-center p-5 cursor-default panel panel-sum"
        >
          {/* <h1 className=" text-5xl ">Data Summary</h1> */}
          <div className="w-full flex md:flex-row flex-col justify-between gap-5 md:gap-10 md:p-10">
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

          <div className="w-full flex md:flex-row flex-col justify-between gap-5 md:gap-10 md:p-10">
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
          className="w-full flex flex-col md:flex-row gap-5 justify-between items-center p-5 md:p-10 bg-orange-500 h-screen panel"
        >
          <div className="w-full flex flex-col  md:space-y-5">
            {/* Our vision */}
            <div className="w-full flex flex-col md:space-y-5">
              <h1 className="text-3xl md:text-5xl py-3 md:py-5 font-semibold">
                Our vision
              </h1>

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
              <h1 className="text-3xl md:text-5xl py-3 md:py-5 font-semibold">
                Our Mission
              </h1>

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
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center p-10 panel"}`}
        >
          <h1 className=" text-3xl md:text-5xl ">Our Partners & Donors</h1>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-5 p-5">
            {partners?.map((p: Partner, i) => (
              <div key={i} className=" p-5 md:p-10 rounded-2xl text-center ">
                <h1 className=" text-2xl hidden ">{p?.label}</h1>

                <Image
                  className={`h-[100px] w-[100px] md:h-[150px] md:w-[auto]`}
                  src={`${p?.logo}`}
                />
              </div>
            ))}
          </div>
          <div></div>
        </div>
        {/* Donors Section End*/}

        {/* Collaborators */}
        <div
          className={`${!isPartners ? "hidden" : "w-full flex flex-col justify-center items-center p-10 panel"}`}
        >
          <div className={`w-full space-y-3 text-center`}>
            <h1 className="text-3xl md:text-5xl ">Collaborators Since 2016</h1>
            <p className="md:text-2xl text-default-500 ">
              Happy to have worked with these organization since 2016
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 md:gap-5 p-5">
            {collabs?.map((p: Partner, i) => (
              <div key={i} className="p-5 md:p-10 rounded-2xl text-center ">
                <h1 className=" text-2xl hidden ">{p?.label}</h1>

                <Image
                  className={`h-[100px] w-[100px] md:h-[150px] md:w-[150px]`}
                  src={`${p?.logo}`}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Collaborators End */}

        {/* Donations */}
        <div
          className={`${"w-full h-screen md:h-[auto] bg-default-200  flex flex-col gap-5 justify-center items-center p-10 panel"}`}
        >
          <div className={`w-full space-y-3 text-center`}>
            <h1 className="text-3xl  md:text-5xl ">Donations</h1>
            <p className="text-xl md:text-2xl text-default-500 ">
              To pledge donation, please fill in the form.
            </p>
          </div>

          <div className=" shadow rounded-2xl bg-default-50 p-5 ">
            <form
              onSubmit={handleSubmit(onDonationSubmit)}
              className=" flex flex-col gap-3 p-5 space-y-2"
            >
              {/* Fullnames */}
              <div className="w-full gap-5 flex justify-between items-center">
                {/* Fname */}
                <div className="w-full space-y-2">
                  <label htmlFor="Firstname">Firstname</label>
                  <Input
                    type="text"
                    defaultValue={`${donation?.firstname ?? ""}`}
                    {...register("firstname")}
                    placeholder={`${donation?.firstname ?? "Enter Firstname"}`}
                  />
                </div>

                {/* Lname */}
                <div className="w-full space-y-2">
                  <label htmlFor="Lastname">Lastname</label>
                  <Input
                    type="text"
                    defaultValue={`${donation?.lastname ?? ""}`}
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
                    type="text"
                    defaultValue={`${donation?.email ?? ""}`}
                    {...register("email")}
                    placeholder={`${donation?.email ?? "Enter email"}`}
                  />
                </div>

                {/* Mobile */}
                <div className="w-full space-y-2">
                  <label htmlFor="mobile">Mobile</label>
                  <Input
                    type="text"
                    defaultValue={`${donation?.mobile ?? ""}`}
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
                      label="Select Donor Type"
                      className="max-w-xs"
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
                    type="text"
                    defaultValue={`${donation?.company ?? ""}`}
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
                      label="Select Currency Type"
                      className="max-w-xs"
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
                    type="number"
                    min={0}
                    defaultValue={`${donation?.amountPledged ?? ""}`}
                    {...register("amountPledged")}
                    placeholder={`${donation?.amountPledged ?? "Enter Amount Pledge"}`}
                  />
                </div>
              </div>

              {/* Editor */}
              <div className="w-full space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  type="text"
                  defaultValue={`${donation?.description ?? ""}`}
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
          </div>
        </div>
        {/* Donations End */}
      </div>
    </DefaultLayout>
  );
}
