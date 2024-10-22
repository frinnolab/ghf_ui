import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

import { siteConfig as config } from "@/config/site";
import {
  FaMailBulk,
  FaMapMarkedAlt,
  FaMapPin,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaSignsPost, FaTwitter } from "react-icons/fa6";
import { Image } from "@nextui-org/react";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full relative flex flex-col h-screen">
      <Navbar />
      {/* <main className="container mx-auto max-w-7xl px-0 flex-grow pt-16"> */}
      <main className="w-full px-0 flex-grow pt-16 bg-default-50">
        {children}
      </main>
      {/* FOOTER */}

      <footer className="w-full flex flex-col gap-5  items-center justify-between p-5 xl:p-10 md:p-20">
        <div className="w-full flex flex-col-reverse md:flex-row gap-5 items-center justify-between">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            {/* <Logo /> */}

            <Image
              isZoomed
              alt="logo of ghf"
              src={config?.staticAssets?.staticLogoLine}
              width={300}
            />
          </Link>

          {/* Socials */}

          <div className="flex flex-col space-y-10">
            <h1 className=" text-2xl ">Connect with us</h1>

            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-5">
                <a href={`${config?.socialLinks?.twitterX?.link}`} className="flex items-center gap-5">
                  <FaTwitter /> {config?.socialLinks?.twitterX?.name}
                </a>
              </li>
              <li className="flex items-center gap-5">
              <a href={`${config?.socialLinks?.facebook?.link}`} className="flex items-center gap-5">
                  <FaFacebook /> {config?.socialLinks?.facebook?.name}
                </a>
              </li>
              <li className="flex items-center gap-5">
              <a href={`${config?.socialLinks?.instagram?.link}`} className="flex items-center gap-5">
                  <FaInstagram /> {config?.socialLinks?.instagram?.name}
                </a>
              </li>
              <li className="flex items-center gap-5">
              <a href={`${config?.socialLinks?.linkedin?.link}`} className="flex items-center gap-5">
                  <FaLinkedinIn /> {config?.socialLinks?.linkedin?.name}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div className="flex flex-col space-y-10">
            <h1 className=" text-2xl ">Get Intouch with us</h1>

            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-5">
                <FaMailBulk /> {config?.footerTexts?.contact?.email}
              </li>
              <li className="flex items-center gap-5">
                <FaPhoneAlt />
                {config?.footerTexts?.contact?.contacts}
              </li>
              <li className="flex items-center gap-5">
                {" "}
                <FaSignsPost /> {config?.footerTexts?.address?.postoffice}
              </li>
              <li className="flex items-center gap-5">
                {" "}
                <FaMapPin /> {config?.footerTexts?.address?.city}
              </li>
              <li className="flex items-center gap-5">
                <FaMapMarkedAlt /> {config?.footerTexts?.address?.country}
              </li>
            </ul>
          </div>

          {/* Contact End */}
        </div>

        <div className="w-full flex justify-center md:justify-start">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
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
