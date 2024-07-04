import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import { useRef, useState } from "react";

/* eslint-disable prettier/prettier */
export default function HomePage() {
  const headerTextsRef = useRef(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);

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
      <section className="w-full flex flex-col items-center justify-center">
        <div className="h-screen w-full flex flex-col justify-center">
          {/* Header Text */}
          <div
            ref={headerTextsRef}
            className="w-full flex flex-col gap-5 z-30 absolute text-end p-10"
          >
            <div className=" text-primary flex flex-col space-y-5 font-semibold">
              <h1 className=" text-2xl md:text-6xl font-semibold">
                WE LIVE TO EMPOWER
              </h1>
              <h1 className=" text-2xl md:text-6xl font-semibold">DEVELOP</h1>
              <h1 className=" text-2xl md:text-6xl font-semibold">
                AND INSPIRE YOUNG GENERATION
              </h1>
              <h1 className=" text-2xl md:text-6xl font-semibold">
                TO ACQUIRE ENTREPRENEURSHIP
              </h1>
              <h1 className=" text-2xl md:text-6xl font-semibold">
                AND 21ST CENTURY SKILLS
              </h1>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[8.5%] filter saturate-[50%]">
            <img alt="Header img" src="/assets/images/_MBX0174crp.jpg" />
          </div>
        </div>

        {/* Who We're */}
        <div className="w-full flex flex-col space-y-5 px-10 font-semibold">
          <h1 className="text-6xl py-5">Who we are</h1>

          <p className="text-2xl text-justify">
            Great Hope Foundation (GHF) is a local Non - Governmental
            Organization, legally registered in Tanzania, with a registration
            number of 3976 in 2010. Since its initiation, the NGO has been
            working to develop platforms that capacitate young people with both
            entrepreneurial and 21st Century Skills. We believe in bringing the
            best out of young people, in a way that benefits them and the
            community around them. We aim at being an organization that
            enlightens young people potential, giving them hope and courage to
            bring the very best out of themselves.
          </p>
          {/* <div className="w-full flex justify-center">
            <video
              style={{
                borderRadius: "20px",
              }}
              width={900}
              src="assets/videos/sample_videoP.mp4"
              autoPlay
              controls
            />
          </div> */}
        </div>
        {/* Who We're End */}

        {/* Data Summary Section */}
        <div className="w-full flex flex-col justify-center items-center p-10 h-screen">
          <h1 className=" text-5xl ">Data Summary</h1>
        </div>
        {/* Data Summary Section End*/}

        {/* Vision Section */}
        <div className="w-full flex flex-col md:flex-row gap-5 justify-between items-center p-10 bg-orange-500 h-screen">
          <div className="flex flex-col w-full space-y-5">
            {/* Our vision */}
            <div className="w-full flex flex-col space-y-5">
              <h1 className="text-6xl py-5 font-semibold">Our vision</h1>

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
            <div className="w-full flex flex-col space-y-5">
              <h1 className="text-6xl py-5 font-semibold">Our Mission</h1>

              <p className="text-2xl text-balance">
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
              src="assets/videos/sample_videoP.mp4"
              onClick={playInftro}
              muted
              // controls
            />
            <div className=" w-full flex justify-end ">
              <Button variant="flat" className=" px-10 py-5 " onClick={playInftro}>
                {isPaused ? 'Play' :'Pause'}
              </Button>
            </div>
          </div>
        </div>
        {/* Who we're Section End*/}

        {/* Donors Section */}
        <div className="w-full flex flex-col justify-center items-center p-10 h-screen">
          <h1 className=" text-5xl ">Partners & Donors</h1>
        </div>
        {/* Donors Section End*/}

        {/* Contact Section */}
        <div className="w-full flex flex-col justify-center items-center p-10 h-screen">
          <h1 className=" text-5xl ">Contact</h1>
        </div>
        {/* Contact Section End*/}

        {/* What we do Section */}
        {/* <div className="w-full bg-purple-400 z-30 p-10">
          <h1>Our Programs</h1>
        </div> */}
        {/* What we do Section End*/}

        {/* Intro Video Section */}
        {/* <div className="w-full bg-green-400 z-30 p-10">
          <h1>Intro video</h1>
        </div> */}
        {/* Intro Video Section End*/}
      </section>
    </DefaultLayout>
  );
}
