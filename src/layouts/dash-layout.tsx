import { siteConfig as config } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import { loginResponse } from "@/pages/auth/login";
import { Button } from "@nextui-org/button";
import { Tab, Tabs } from "@nextui-org/react";
import { createContext, ReactNode, useEffect } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext<loginResponse | null>(null);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const route = useLocation();
  const nav = useNavigate();
  const authedProfile = useAuthedProfile();



  const logOut = () => {
    if (!authedProfile) {
      window.sessionStorage.clear();
      nav("/login");
    }

  };

  useEffect(() => {
    logOut();
  }, [authedProfile]);

  return (
    <AuthContext.Provider value={authedProfile}>
      <div className="w-full flex flex-col justify-between cursor-default overflow-hidden relative">
        <div className="w-full px-10 py-5 flex justify-between border-b-1">
          <Link className="flex items-center gap-1" to={"/"}>
            Back Home <GoHome size={20} />
          </Link>

          <h1>Welcome back {authedProfile?.email}</h1>

          <Button
            color="danger"
            onClick={() => {
              if (authedProfile) {
                window.sessionStorage.clear();
                nav("/login");
              }
            }}
          >
            <BiLogOutCircle size={20} />
          </Button>
        </div>

        <div className="w-full  flex flex-col space-y-3 p-10">
          <div>
            {config.dashNavMenuItems.map((t, i) => {
              return (
                <h1 className=" text-6xl " key={i}>
                  {route.pathname === t.href ? t.label : ""}
                </h1>
              );
            })}
          </div>
          <Tabs
            fullWidth
            selectedKey={route.pathname}
            className="bg-default-50 rounded-xl p-1"
            variant="underlined"
            color="primary"
          >
            {config.dashNavMenuItems.map((t) => (
              <Tab title={t.label} key={t.href} href={t.href} />
            ))}
          </Tabs>
          <main className="rounded-2xl bg-default-50 shadow">{children}</main>
        </div>

        {/* Dash Footer */}
        <div className="hidden">
          <p>Footer</p>
        </div>
        {/* Dash Footer End */}
        {/* Content End */}
      </div>
    </AuthContext.Provider>
  );
}
