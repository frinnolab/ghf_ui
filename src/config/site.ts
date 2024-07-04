import { ReactElement } from "react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "GHF Foundation",
  description: "",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    // {
    //   label: "Uwezo",
    //   href: "/uwezo",
    // },
    // {
    //   label: "Careers",
    //   href: "/careers",
    // },
    // {
    //   label: "Docs",
    //   href: "/docs",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
  ],
  dashNavMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Blogs",
      href: "/dashboard/blogs",
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
    },
    // {
    //   label: "Programs",
    //   href: "/dashboard/programs",
    // },
    {
      label: "Profiles",
      href: "/dashboard/profiles",
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
    },
    // {
    //   label: "Logout",
    //   href: "/dashboard/logout",
    // },
    // {
    //   label: "Calendar",
    //   href: "/calendar",
    // },
    // {
    //   label: "Help & Feedback",
    //   href: "/help-feedback",
    // },
  ],
  links: {
    email: "greathopefoundation@gmail.com",
    postoffice: "P.O.BOX 2466 DSM",
    contacts: "+255 764 977 365, +255 783 672 512",
    X: "Greathopetz",
    youtube: "GREAT HOPE FOUNDATION",
    linkedin: "Great Hope Foundation",
    instagram: "@greathopetz",
    facebook: "GREAT HOPE FOUNDATION – GHF",
  },
  
  footerTexts:{
    footerImage:'/assets/logos/GHFLOGO.jpg',
    address:{
      country:"Tanzania",
      city:"Dar es salaam",
      postoffice: "P.O.BOX 2466 DSM",
    },
    contact:{
      email: "greathopefoundation@gmail.com",
      contacts:["+255 764 977 365,","+255 783 672 512"]
    }
  }
};
