import {
  Avatar,
  Button,
  Divider,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
  Textarea,
  Input,
} from "@nextui-org/react";
import { GoPersonFill } from "react-icons/go";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as motion from "motion/react-client";

import { TeamMember } from "./dashboard/teams/dash-teams";

// import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function DocsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [hasMembers, setHasMembers] = useState<boolean>(false);
  const api = `${import.meta.env.VITE_API_URL}`;
  // const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (!hasMembers) {
      axios
        .get(`${api}/teams/members/main`)
        .then((res: AxiosResponse) => {
          console.log(res?.data);

          const datas: TeamMember[] = Array.from(res?.data).flatMap(
            (d: any) => {
              const data: TeamMember = {
                memberId: d?.memberId,
                memberAvatarUrl: d?.memberAvatarUrl,
                member: d?.member,
                teamId: d?.teamId,
                teamPosition: d?.teamPosition,
              };

              return [data];
            }
          );

          setMembers([...datas]);
          setHasMembers(true);
        })
        .catch((err: AxiosError) => {
          console.error(err.response);
          setHasMembers(false);
        });
    }
  }, [hasMembers]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 cursor-default">
        <div className="w-full flex flex-col items-center gap-5 md:p-10 h-[30dvh] md:h-[80dvh] relative">
          <motion.div
            className={`w-full absolute top-[-40%] md:top-[-30%] saturate-[100%]`}
          >
            <Image
              alt="About Bg"
              className=" object-fill"
              radius="none"
              src="assets/images/static/ABOUT_US_FINAL.jpg"
              width={5000}
            />
          </motion.div>

          <div className="inline-block max-w-lg text-center justify-center p-3 z-10">
            <motion.h1
              className={`text-3xl md:text-5xl text-orange-500 font-semibold`}
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  ease: "linear",
                  delay: 0.5,
                  duration: 1,
                },
              }}
            >
              About Us
            </motion.h1>

            <motion.span
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
                transition: {
                  ease: "linear",
                  delay: 0.8,
                  duration: 1,
                },
              }}
            >
              <Divider className="p-1 bg-orange-500 -rotate-3" />
            </motion.span>
          </div>
        </div>

        {/* <Divider /> */}

        {/* Vision Section */}
        <div
          className="w-full md:min-h-[85dvh] flex flex-col gap-5 justify-center items-center p-5 md:p-10 bg-orange-500 panel z-10"
          id="aboutInfo"
        >
          <div className="w-full flex flex-col justify-center items-center  md:space-y-5">
            {/* Our vision */}
            <div className="w-full flex flex-col md:space-y-3">
              <h1 className="text-4xl md:text-6xl py-3 md:py-5 font-semibold">
                About Us
              </h1>

              <p className="text-2xl text-balance">
                Great Hope Foundation (GHF) is a local Non - Governmental
                Organization, legally registered in Tanzania, with a
                registration number of 3976 in 2010. Since its initiation, the
                NGO has been working to develop platforms that capacitate young
                people with both entrepreneurial and 21st Century Skills. We
                believe in bringing the best out of young people, in a way that
                benefits them and the community around them. We aim at being an
                organization that enlightens young people potential, giving them
                hope and courage to bring the very best out of themselves.
              </p>
            </div>

            {/* Our vision */}
            <div className="w-full flex flex-col md:space-y-3">
              <h1 className="text-4xl md:text-6xl py-3 md:py-5 font-semibold">
                Our Vision
              </h1>

              <p className="text-2xl text-balance">
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
            <div className="w-full flex flex-col space-y-3">
              <h1 className="text-4xl md:text-6xl py-3 md:py-5 font-semibold">
                Our Mission
              </h1>

              <p className="text-2xl text-balance">
                Great Hope Foundation mission is to develop and implement
                programs innovatively, that assist young people to acquire
                appropriate skills that can help them thrive in the labor market
                through either self or formal employment.
              </p>
            </div>
          </div>
        </div>
        {/* Vision Section End*/}

        {/* Team */}
        <div
          className={` ${hasMembers && members?.length > 0 ? "w-full flex flex-col p-5" : "hidden"} `}
        >
          <div className={`text-center`}>
            <h1 className=" text-3xl md:text-5xl font-semibold text-black hover:text-orange-500 py-3">
              Our Board Members
            </h1>

            {members?.length === 0 ? (
              <>
                <h1 className={`text-center`}>
                  {/* No team Currently please check back soon */}
                </h1>
              </>
            ) : (
              <>
                <div
                  className={`p-5 w-full flex flex-col md:flex-row justify-center md:justify-start flex-wrap gap-5`}
                >
                  {members?.flatMap((m) => (
                    <TeamCard key={m?.teamId} member={m} />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* <Divider/> */}
        </div>
      </section>
    </DefaultLayout>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div
      className={`flex flex-col bg-default-100 gap-3 rounded-xl text-end w-full md:w-[30dvw]`}
    >
      <div hidden>
        <div className="w-full flex justify-between">
          <div hidden>
            <Avatar
              defaultValue={`${(<GoPersonFill />)}`}
              size="lg"
              src={
                member?.memberAvatarUrl !== null
                  ? member?.memberAvatarUrl
                  : "assets/images/static/ghf_default.png"
              }
            />
          </div>
          {/* <Image src={`${member?.member?.avatarUrl ?? <GoPersonFill />}`} /> */}

          <div>
            <div className="">
              <label className="text-small text-slate-500" htmlFor="pname">
                Fullname
              </label>
              <h1>
                {member?.member?.firstname} {member?.member?.lastname}
              </h1>
            </div>

            <div className="hidden">
              <label className="text-small text-slate-500" htmlFor="pname">
                Email
              </label>
              <h1>{member?.member?.email}</h1>
            </div>

            {/* <div>
            <label className="text-small text-slate-500" htmlFor="pos">
              Position
            </label>
            <h1>{member?.teamPosition ?? ""}</h1>
          </div> */}
          </div>
        </div>
      </div>

      {/* New Card */}

      <div className="w-full md:w-[30dvw] h-[30dvh]">
        <Image
          className={`w-screen md:w-[30dvw] h-[30dvh] object-fill rounded-b-none`}
          src={
            member?.memberAvatarUrl !== null
              ? member?.memberAvatarUrl
              : "assets/images/static/ghf_default.png"
          }
        />
      </div>

      <div className="p-3 flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl text-black hover:text-orange-500 uppercase">
          {member?.member?.firstname} {member?.member?.lastname}
        </h1>

        <p className=" text-lg md:text-xl text-black hover:text-orange-500/80 uppercase">
          {member?.member?.position ?? ""}
        </p>
      </div>

      {/* New Card End */}
      {/* CTA */}
      <div className="w-full flex p-0">
        <Button
          className="w-full rounded-t-none border-t-1 border-t-orange-500 p-6 text-sm font-normal  text-orange-500 bg-transparent hover:bg-orange-500  hover:text-black"
          // color="primary"
          // variant="light"
          onPress={onOpen}
        >
          View full Profile
          {/* <GoArrowUp size={20} /> */}
        </Button>

        <div />
      </div>

      {/* Member Pop Up */}
      <Modal
        hideCloseButton
        backdrop="blur"
        isOpen={isOpen}
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="p-0 w-full">
                {/* <h1>Member Profile</h1> */}

                <Image
                  className=" w-screen h-[50dvh] z-0 rounded-b-none "
                  // defaultValue={`${(<GoPersonFill />)}`}
                  // size="lg"
                  src={
                    member?.memberAvatarUrl !== null
                      ? member?.memberAvatarUrl
                      : "assets/images/static/ghf_default.png"
                  }
                />
              </ModalHeader>
              <ModalBody className="p-0">
                <form
                  className=" flex flex-col gap-1 px-5"
                  // onSubmit={handleSubmit(handleCreate)}
                >
                  {/* Profil Pic */}
                  {/* <div className="w-full space-y-2 flex justify-center">
                    <Image
                      className="w-full h-[30dvh] object-cover"
                      src={
                        member?.memberAvatarUrl !== null
                          ? member?.memberAvatarUrl
                          : "assets/images/static/ghf_default.png"
                      }
                    />
                  </div> */}
                  <p className=" text-3xl md:text-4xl text-black hover:text-orange-400 uppercase">
                    {member?.member?.position ?? ""}
                  </p>
                  {/* Profil PicEnd */}
                  <div className="w-full hidden">
                    <label htmlFor="email">Email</label>
                    <Input
                      isDisabled
                      className="text-default-200"
                      id="email"
                      placeholder={`${member?.member?.email}`}
                      type="email"
                      // {...register("email", { required: true })}
                      // required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="w-full flex flex-col">
                      <label htmlFor="firstName">Firstname</label>
                      <label
                        className=" text-default-600 "
                        htmlFor="firstName1"
                      >{`${member?.member?.firstname}`}</label>
                      <Input
                        className="text-default-200 hidden"
                        placeholder={`${member?.member?.firstname}`}
                        isDisabled
                        // required
                        id="firstName"
                        type="text"
                        value={`${member?.member?.firstname}`}
                        // {...register("firstname", { required: true })}
                      />
                      {/* {errors.firstname && (
                        <span className="text-danger">
                          Firstname field is required
                        </span>
                      )} */}
                    </div>

                    <div className="w-full space-y-2 flex flex-col">
                      <label htmlFor="lastName">Lastname</label>
                      <label
                        className="text-default-600"
                        htmlFor="lastName1"
                      >{`${member?.member?.lastname}`}</label>
                      <Input
                        className="text-default-200 hidden"
                        isDisabled
                        id="lastName"
                        placeholder={`${member?.member?.lastname}`}
                        type="text"
                        // {...register("lastname", { required: true })}
                      />
                      {/* {errors.lastname && (
                        <span className="text-danger">
                          Lastname field is required
                        </span>
                      )} */}
                    </div>
                  </div>

                  <div className="w-full space-y-2 hidden">
                    <label htmlFor="posi">Position</label>
                    <Input
                      isDisabled
                      className="text-default-200"
                      id="email"
                      placeholder={`${member?.member?.position ?? ""}`}
                      type="email"
                      // {...register("email", { required: true })}
                      // required
                    />
                  </div>

                  <div
                    hidden
                    // className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    <div className="w-full space-y-2">
                      <label htmlFor="city">City</label>
                      <Input
                        className="text-default-200"
                        // required
                        id="firstNamcitye"
                        // placeholder={`${member?.member?.ci}`}

                        type="text"
                        // {...register("city", { required: true })}
                      />
                      {/* {errors.city && (
                        <span className="text-danger">
                          City field is required
                        </span>
                      )} */}
                    </div>

                    <div className="w-full space-y-2">
                      <label htmlFor="country">Country</label>
                      <Input
                        className="text-default-200"
                        // required
                        id="country"
                        placeholder="Enter your country"
                        type="text"
                        // {...register("country", { required: true })}
                      />
                      {/* {errors.country && (
                        <span className="text-danger">
                          Country field is required
                        </span>
                      )} */}
                    </div>
                  </div>

                  <div className="w-full space-y-2 hidden">
                    <div className="w-full space-y-2">
                      <label htmlFor="phone">Phone number</label>
                      <Input
                        isDisabled
                        className="text-default-200"
                        id="phone"
                        placeholder={`${member?.member?.mobile ?? ""}`}
                        type="number"
                        // {...register("mobile")}
                        // required
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label htmlFor="coverLetter">Biography</label>
                    <Textarea
                      // isDisabled
                      isReadOnly
                      className="text-default-200 text-pretty"
                      id="coverLetter"
                      placeholder={`${member?.member?.biography ?? ""}`}
                      rows={3}
                    />
                  </div>

                  {/* <div className="w-full flex justify-end">
                          <Button color="primary" type="submit">
                            Submit Application
                          </Button>
                        </div> */}
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Member Pop Up End */}
    </div>
  );
}
