import { siteConfig as config } from "@/config/site";
import useAuthedProfile from "@/hooks/use-auth";
import { loginResponse } from "@/pages/auth/login";
import { Tab, Tabs } from "@nextui-org/react";
import { createContext, ReactNode, useEffect } from "react";
import { GoHome } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext<loginResponse | null>(null);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const route = useLocation();
  const nav = useNavigate();
  const authedProfile = useAuthedProfile();
//   const [authedProfile] = useState<loginResponse | null>(() => {
//     if (window.sessionStorage.length > 0) {
//       const data = JSON.parse(`${window.sessionStorage.getItem("profile")}`);
//       return {
//         profileId: `${data["profileId"]}`,
//         email: `${data["email"]}`,
//         token: `${data["token"]}`,
//         role: Number(`${data["role"]}`),
//       };
//     }
//     return null;
//   });

  useEffect(()=>{
    if(!authedProfile){
        window.sessionStorage.clear();
        nav('/login');
    }
  },[authedProfile])
  return (
    <AuthContext.Provider value={authedProfile}>
      <div className="w-full flex flex-col justify-between cursor-default overflow-hidden relative">
        <div className="w-full px-10 py-5 flex justify-between border-b-1">
          <Link className="flex items-center gap-1" to={"/"}>
            Back Home <GoHome size={20} />
          </Link>
          <p className="font-semibold">Nav {route.pathname}</p>
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
              <Tab title={t.label} key={t.href} href={t.href}></Tab>
            ))}
          </Tabs>
          <main className="rounded-2xl bg-default-50 shadow">{children}</main>
        </div>

        {/* Dash Footer */}
        <div>
          <p>Footer</p>
        </div>
        {/* Dash Footer End */}
        {/* Content End */}
      </div>
    </AuthContext.Provider>
  );
}
