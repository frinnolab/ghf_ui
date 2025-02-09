export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "GHF Foundation",
  description: "",
  navItems: [
    {
      label: "",
      href: "/",
    },
    {
      label: "About Us",
      href: "/about",
    },
    { 
      label: "What we do",
      href: "/whatwedo",
    },
    {
      label: "Impacts",
      href: "/impacts",
    },
    {
      label: "Publications",
      href: "/publications",
    },
    {
      label: "Donation",
      href: "/donation",
    },
    {
      label: "Alumni",
      href: "/alumni",
    },
    {
      label: "Blogs",
      href: "/blog",
    },
    {
      label: "Careers",
      href: "/careers",
    },
    // {
    //   label: "sappy",
    //   href: "/sappy",
    // },
    // {
    //   label: "sabby",
    //   href: "/sabby",
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
      label: "Profiles",
      href: "/dashboard/profiles",
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
    },
    {
      label: "Partners",
      href: "/dashboard/partners",
    },
    {
      label: "Impacts",
      href: "/dashboard/impacts",
    },
    {
      label: "Donations",
      href: "/dashboard/donations",
    },
    {
      label: "Publications",
      href: "/dashboard/publications",
    },
    {
      label: "Blogs",
      href: "/dashboard/blogs",
    },
    {
      label: "Teams",
      href: "/dashboard/teams",
    },
    {
      label: "Alumni",
      href: "/dashboard/alumni",
    },
    {
      label: "Careers",
      href: "/dashboard/careers",
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
  staticAssets:{
    staticLogo:'/assets/images/static/ghf_default.png',
    staticLogoLine:'/assets/logos/ghf_default_line.png',
    staticIntroVideo:'/assets/videos/sample_videoP.mp4'
  },
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

  socialLinks:{
    twitterX:{
      name:'X',
      link:'https://x.com/Greathopetz'
    },
    linkedin:{
      name:'Linkedin',
      link:'https://www.linkedin.com/company/28136797/admin/dashboard/'
    },
    facebook:{
      name:'facebook',
      link:'https://www.facebook.com/greathopetz'
    },
    instagram:{
      name:'instagram',
      link:'https://www.instagram.com/greathopetz/'
    },
  },
  
  footerTexts:{
    footerImage:'/assets/logos/GHF_LOGO.png',
    address:{
      country:"Tanzania",
      city:"Ubungo Riverside,Dar es salaam",
      postoffice: "P.O.BOX 2466 DSM",
    },
    contact:{
      email: "info@ghftz.org",
      contacts:["+255 764 977 365,","+255 783 672 512"]
    }
  }
};
