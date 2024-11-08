import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Avatar, Divider } from "@nextui-org/react";
import { TeamMember } from "./dashboard/teams/dash-teams";
import { GoPersonFill } from "react-icons/go";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

export default function DocsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [hasMembers, setHasMembers] = useState<boolean>(false);
  const api = `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    if (!hasMembers) {
      axios
        .get(`${api}/teams/members/main`)
        .then((res: AxiosResponse) => {
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
          console.log(err.response);
          setHasMembers(false);
        });
    }
  }, [hasMembers]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 cursor-default">
        <div className="w-full flex flex-col items-center gap-5 md:p-10 md:min-h-[85dvh]">
          <div className="inline-block max-w-lg text-center justify-center p-3">
            <h1 className={title()}>About Us</h1>
          </div>
          {/* Bio */}
          <div className="rounded-2xl">
            <p className=" text-2xl md:text-3xl text-pretty md:text-justify p-5 md:py-10">
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
        </div>

        <Divider />

        {/* Vision Section */}
        <div
          id="aboutInfo"
          className="w-full md:min-h-[85dvh] flex flex-col gap-5 justify-center items-center p-5 md:p-10 bg-orange-500 panel"
        >
          <div className="w-full flex flex-col justify-center items-center  md:space-y-5">
            {/* Our vision */}
            <div className="w-full flex flex-col md:space-y-3">
              <h1 className="text-4xl md:text-6xl py-3 md:py-5 font-semibold">
                Our vision
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
        <div className="w-full flex flex-col p-5">
          <div className={`text-center`}>
            <h1 className={title()}>Our Team</h1>

            {members?.length === 0 ? (
              <>
                <h1 className={`text-center`}>
                  No team Currently please check back soon
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
  return (
    <div
      className={`flex justify-between bg-default-100 gap-3 p-5 rounded-xl shadow text-end md:w-[30dvw]`}
    >
      <div>
        <Avatar
          size="lg"
          src={member?.memberAvatarUrl !== "" ? member?.memberAvatarUrl : ""}
          defaultValue={`${(<GoPersonFill />)}`}
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

        <div className="">
          <label className="text-small text-slate-500" htmlFor="pname">
            Email
          </label>
          <h1>{member?.member?.email}</h1>
        </div>

        <div className="">
          <label className="text-small text-slate-500" htmlFor="pos">
            Position
          </label>
          <h1>{member?.teamPosition}</h1>
        </div>
      </div>
    </div>
  );
}
