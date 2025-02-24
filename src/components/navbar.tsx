import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { useLocation, useNavigate } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import useAuthedProfile from "@/hooks/use-auth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Image,
  Divider,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Profile } from "@/pages/dashboard/profiles/dash-profiles-list";
import { AuthRole } from "@/types";
import axios, { AxiosResponse } from "axios";
import { motion } from "motion/react";

// import { Logo } from "@/components/icons";

export const Navbar = () => {
  const api = `${import.meta.env.VITE_API_URL}`;
  const authed = useAuthedProfile();
  const navigate = useNavigate();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const currentRoute = useLocation();

  useEffect(() => {
    if (currentProfile === null && authed?.profileId) {
      axios
        .get(`${api}/profiles/${authed?.profileId}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res: AxiosResponse) => {
          const data: Profile = {
            profileId: res.data?.profileId,
            firstname: res.data?.firstname ?? "",
            lastname: res.data?.lastname ?? "",
            email: res.data?.email ?? "",
            role: Number(res.data.roleType) ?? AuthRole.User,
            avatarUrl: res.data?.avatarUrl ?? "",
            position: res.data?.position ?? "",
          };
          setCurrentProfile(data);
        });
    }
  }, [currentProfile]);

  const roleName = (role: number) => {
    switch (role) {
      case AuthRole.Admin:
        return "Admin";
      case AuthRole.SuperAdmin:
        return "Super Admin";
      case AuthRole.Alumni:
        return "Alumni";
      default:
        return "User";
    }
  };

  return (
    <NextUINavbar className="bg-transparent" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            {/* <Logo /> */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              whileHover={{
                scale: 1.2,
                transition: {
                  ease: "easeInOut",
                },
              }}
              whileInView={{
                opacity: 1,
              }}
            >
              <Image
                alt="logo of ghf"
                src={`${siteConfig?.staticAssets?.staticLogoLine}`}
                width={150}
              />
            </motion.div>

            {/* <Image width = 50 height = 50 src/> */}

            {/* <p className="font-bold text-inherit">ACME</p> */}
          </Link>
        </NavbarBrand>

        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={`${item?.href === currentRoute?.pathname ? "text-orange-400" : " text-green-700 "}`}
                // color={
                //   item?.href === currentRoute?.pathname
                //     ? "primary"
                //     : "secondary"
                // }
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="flex gap-5">
          {authed?.profileId ? (
            <>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    src={`${currentProfile?.avatarUrl ?? siteConfig?.staticAssets?.staticLogo}`}
                  />
                </DropdownTrigger>

                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    href="/dashboard/profile"
                  >
                    <p className="font-semibold">Hello</p>
                    <p className="font-semibold">{currentProfile?.firstname}</p>
                  </DropdownItem>
                  <DropdownItem key="role" className="h-14 gap-2">
                    <p className="font-semibold text-default-400">Role</p>
                    <p className="font-semibold">
                      {roleName(Number(currentProfile?.role))}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="dashboard"
                    className="h-7 gap-2"
                    href="/dashboard"
                  >
                    <p className="font-semibold text-default-400">Dashboard</p>
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="h-7 gap-2"
                    onPress={() => {
                      if (authed) {
                        window.sessionStorage.clear();
                        navigate("/login");
                      }
                    }}
                  >
                    <p className="font-semibold text-danger-400">Logout</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <Button
                className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
                variant="flat"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login <GoArrowRight />
              </Button>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  item?.href === currentRoute?.pathname
                    ? "primary"
                    : "foreground"
                }
                href={`${item?.href}`}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}

          <Divider />
          <div className="flex flex-col gap-3">
            {currentProfile === null ? (
              <>
                <Link color={"danger"} href={`/login`} size="lg">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link color={"primary"} href={`/dashboard`} size="lg">
                  Dashboard
                </Link>

                <div>
                  <Button
                    className="text-sm font-normal text-default-600 bg-danger-300 border border-transparent hover:border-orange-500"
                    variant="flat"
                    onPress={() => {
                      if (authed) {
                        window.sessionStorage.clear();
                        navigate("/login");
                      }
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
