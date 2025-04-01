/* eslint-disable react/jsx-no-target-blank */
import { Link } from "@nextui-org/link";
import {
  FaMailBulk,
  FaMapMarkedAlt,
  FaMapPin,
  FaPhoneAlt,
} from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaSignsPost,
  FaTwitter,
} from "react-icons/fa6";
import { Button, Image, Input } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { useRef } from "react";

import { siteConfig as config } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { PublicationSubscriber } from "@/pages/dashboard/publications/dash-publications";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const api = `${import.meta.env.VITE_API_URL}`;

  const subRef = useRef<HTMLInputElement>(null);

  const handleSubscription = () => {
    // alert(subRef?.current?.value);
    if (
      subRef?.current?.value === undefined ||
      subRef?.current?.value === null ||
      subRef?.current?.value === ""
    ) {
      alert("Add email to subscribe!.");
    } else {
      const data: PublicationSubscriber = {
        email: `${subRef?.current?.value ?? ""}`,
        isSubscribed: true,
      };

      axios
        .post(`${api}/publications/subscriptions`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          //window.location.reload();

          alert(`Subscription success!.`);
          window.location.reload();
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };

  return (
    <div className="w-full relative flex flex-col h-screen">
      <Navbar />
      {/* <main className="container mx-auto max-w-7xl px-0 flex-grow pt-16"> */}
      <main className="w-full px-0 flex-grow pt-16 bg-default-200">
        {children}
      </main>
      {/* FOOTER */}

      <footer className="w-full flex flex-col gap-5  items-center justify-between p-5 xl:p-10 md:p-20 bg-default-50 z-10">
        {/* Subscription */}
        <div className="w-full flex items-center justify-between py-5">
          <div className="w-full hidden md:flex" />
          <div className="w-full flex items-center gap-5">
            <Input
              ref={subRef}
              className="border border-orange-500 rounded-md p-1"
              placeholder="Enter email to subscribe to our newsletters"
              radius="none"
              type="email"
              variant="flat"
            />
            <Button
              className="text-sm font-normal  bg-orange-400 border border-transparent hover:border-orange-500 hover:bg-transparent hover:text-orange-500"
              size="lg"
              variant="flat"
              onClick={handleSubscription}
            >
              subscribe
            </Button>
          </div>
        </div>
        {/* Subscription End */}
        <div className="w-full flex flex-col-reverse md:flex-row gap-5 justify-between items-center ">
          <Link
            className="w-full flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            {/* <Logo /> */}

            <Image
              // isZoomed
              alt="logo of ghf"
              src={config?.staticAssets?.staticLogoLine}
              width={500}
            />
          </Link>

          {/* Socials */}

          <div className="w-full flex flex-col space-y-10">
            <h1 className=" text-3xl md:text-4xl text-black">
              Connect with us
            </h1>

            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-5 hover:text-orange-500">
                <a
                  className="flex items-center gap-5"
                  href={`${config?.socialLinks?.twitterX?.link}`}
                  target="_blank"
                >
                  <FaTwitter /> {config?.socialLinks?.twitterX?.name}
                </a>
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                <a
                  className="flex items-center gap-5"
                  href={`${config?.socialLinks?.facebook?.link}`}
                  target="_blank"
                >
                  <FaFacebook /> {config?.socialLinks?.facebook?.name}
                </a>
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                <a
                  className="flex items-center gap-5"
                  href={`${config?.socialLinks?.instagram?.link}`}
                  target="_blank"
                >
                  <FaInstagram /> {config?.socialLinks?.instagram?.name}
                </a>
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                <a
                  className="flex items-center gap-5"
                  href={`${config?.socialLinks?.linkedin?.link}`}
                  target="_blank"
                >
                  <FaLinkedinIn /> {config?.socialLinks?.linkedin?.name}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div className="w-full flex flex-col space-y-10">
            <h1 className=" text-3xl md:text-4xl text-black">
              Get Intouch with us
            </h1>

            <ul className="space-y-3 text-lg ">
              <li className="flex items-center gap-5 hover:text-orange-500">
                <FaMailBulk /> {config?.footerTexts?.contact?.email}
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                <FaPhoneAlt />
                {config?.footerTexts?.contact?.contacts}
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                {" "}
                <FaSignsPost /> {config?.footerTexts?.address?.postoffice}
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                {" "}
                <FaMapPin /> {config?.footerTexts?.address?.city}
              </li>
              <li className="flex items-center gap-5 hover:text-orange-500">
                <FaMapMarkedAlt /> {config?.footerTexts?.address?.country}
              </li>
            </ul>
          </div>

          {/* Contact End */}
        </div>

        <div className="w-full flex justify-center md:justify-start">
          <Link
            isExternal
            className="hidden items-center gap-1 text-current"
            href="/"
          >
            <span className="text-default-600">Developed by</span>
            <p className="text-primary">PBM Technologies</p>
          </Link>
        </div>

        {/* FOOTER END */}
      </footer>
    </div>
  );
}
