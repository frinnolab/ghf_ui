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
      label: "Uwezo",
      href: "/uwezo",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "sappy",
      href: "/sappy",
    },
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
    {
      label: "Impacts",
      href: "/dashboard/impacts",
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
      label: "Donors/Partners",
      href: "/dashboard/partners",
    },
    {
      label: "Teams",
      href: "/dashboard/teams",
    },
    {
      label: "My Profile",
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
    footerImage:'/assets/logos/GHF_LOGO.png',
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
