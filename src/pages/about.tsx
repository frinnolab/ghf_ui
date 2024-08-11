import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Divider } from "@nextui-org/react";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:p-10">
        <div className="w-full flex flex-col items-center gap-5 min-h-[50vh] ">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>About Us</h1>
          </div>
          {/* Bio */}
          <div className="bg-default-200 rounded-2xl p-10">
            <p className="text-2xl text-justify">
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

        <Divider/>

        {/* Team */}
        <div className="w-full flex flex-col h-screen">
          <h1 className="text-4xl">Team</h1>
          {/* <Divider/> */}

          <p>
            Coming Soon
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
