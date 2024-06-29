import { Link } from "@nextui-org/link";

import { Navbar } from "@/components/navbar";

import { siteConfig as config } from "@/config/site";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      {/* <main className="container mx-auto max-w-7xl px-0 flex-grow pt-16"> */}
      <main className="w-full px-0 flex-grow pt-16">{children}</main>
      <footer className="container flex flex-col gap-5  items-center justify-between p-3 md:pt-20">
        <div className="w-full flex items-center justify-between">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            {/* <Logo /> */}

            <img
              alt="logo of ghf"
              src={config?.footerTexts?.footerImage}
              width={300}
            />

          </Link>
          <div className="flex flex-col space-y-5"></div>

          <div className="flex flex-col space-y-10">
            <h1 className=" text-2xl ">Address</h1>

            <ul className="space-y-3 text-lg">
              <li>{config?.footerTexts?.contact?.email}</li>
              <li>{config?.footerTexts?.contact?.contacts}</li>
              <li>{config?.footerTexts?.address?.postoffice}</li>
              <li>{config?.footerTexts?.address?.city}</li>
              <li>{config?.footerTexts?.address?.country}</li>
            </ul>
          </div>
        </div>
        <div className="w-full flex">
          <Link
            isExternal
            className="flex items-center gap-1 text-current"
            href="#"
            
          >
            <span className="text-default-600">Developed by</span>
            <p className="text-primary">PBM Technologies</p>
          </Link>
        </div>

        {/* FOOTER */}

        {/* FOOTER END */}
      </footer>
    </div>
  );
}
