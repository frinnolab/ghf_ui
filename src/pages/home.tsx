import DefaultLayout from "@/layouts/default";
import { useRef } from "react";

/* eslint-disable prettier/prettier */
export default function HomePage() {
  const headerTextsRef = useRef(null);

  return (
    <DefaultLayout>
      <section className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex flex-col justify-center">
          {/* Header Text */}
          <div
            ref={headerTextsRef}
            className=" self-start flex flex-col gap-5 z-30 p-4"
          >
            <h1 className=" text-4xl font-semibold">WE LIVE TO EMPOWER</h1>
            <h1 className=" text-4xl font-semibold">DEVELOP</h1>
            <h1 className=" text-4xl font-semibold">
              AND INSPIRE YOUNG GENERATION
            </h1>
            <h1 className=" text-4xl font-semibold">
              TO ACQUIRE ENTREPRENEURSHIP
            </h1>
            <h1 className=" text-4xl font-semibold">AND 21ST CENTURY SKILLS</h1>
          </div>
          {/* Header Text End*/}

          <img alt="Header img" src="/assets/images/_MBX0174.jpg" />
        </div>

        {/* Who we're Section */}
        <div className="w-full bg-red-400 z-30 p-10">
          <h1>Who we&apos;re</h1>
        </div>
        {/* Who we're Section End*/}

        {/* Data Summary Section */}
        <div className="w-full bg-yellow-400 z-30 p-10">
          <h1>Data Summary</h1>
        </div>
        {/* Data Summary Section End*/}

        {/* What we do Section */}
        <div className="w-full bg-purple-400 z-30 p-10">
          <h1>What we do</h1>
        </div>
        {/* What we do Section End*/}

        {/* Intro Video Section */}
        <div className="w-full bg-green-400 z-30 p-10">
          <h1>Intro video</h1>
        </div>
        {/* Intro Video Section End*/}

        {/* Donors Section */}
        <div className="w-full bg-blue-400 z-30 p-10">
          <h1>Donors</h1>
        </div>
        {/* Donors Section End*/}


        {/* Contact Section */}
        <div className="w-full bg-pink-400 z-30 p-10">
          <h1>Contact</h1>
        </div>
        {/* Contact Section End*/}
      </section>
    </DefaultLayout>
  );
}
