import { Route, Routes } from "react-router-dom";

// import Dashy from "./pages/dashboard/dashy";
import HomePage from "./pages/home";

// import DocsPage from "@/pages/docs";
// import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blogs/blog";
import AboutPage from "@/pages/about";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashSummaryPage from "./pages/dashboard/summary/dash-summary";
import DashProfilesListPage from "./pages/dashboard/profiles/dash-profiles-list";
import DashProfilePage from "./pages/dashboard/profile/dash-profile";
import DashSettingsPage from "./pages/dashboard/settings/dash-settings";
import DashBlogsListPage from "./pages/dashboard/blog/dash-blogs";
import DashProjectsListPage from "./pages/dashboard/projects/dash-projects";
import DashBlogCreate from "./pages/dashboard/blog/dash-blog-create";
import DashProjectPage from "./pages/dashboard/projects/dash-project-view";
import UwezoPage from "./pages/uwezo/uwezo_page";
import UwezoDetailPage from "./pages/uwezo/uwezo_detail_page";
import BlogDetailPage from "./pages/blogs/blog_detail";
import DashboardPartnersPage from "./pages/dashboard/partners/dash-partners";
import DashboardPartnerPage from "./pages/dashboard/partners/dash-partner";
import DashboardTeamsPage from "./pages/dashboard/teams/dash-teams";
import DashboardTeamPage from "./pages/dashboard/teams/dash-team-view";
// import SappyPage from "./pages/sappy/sappy-page";
import DashImpactsListPage from "./pages/dashboard/impacts/dash-impacts-list";
import DashImpactView from "./pages/dashboard/impacts/dash-impact";
import ImpactList from "./pages/impacts/impacts";
import ImpactView from "./pages/impacts/impact_view";
import SappyPage from "./pages/sappy/sappy-page";
import SabbyPage from "./pages/sappy/sabby-page";
import DashPublications from "./pages/dashboard/publications/dash-publications";
import DashPublicationsView from "./pages/dashboard/publications/dash-publication-view";
import Publications from "./pages/publications/publications";
import PublicationsView from "./pages/publications/publication-view";
import DashDonations from "./pages/dashboard/donations/dash-donations-list";
import DashDonationView from "./pages/dashboard/donations/dash-donation-view";
import AlumniList from "./pages/alumnis/alumni-list";
import AlumniView from "./pages/alumnis/alumni-view";
import DashAlumniList from "./pages/dashboard/alumnis/dash-alumni-list";
import DashAlumniView from "./pages/dashboard/alumnis/dash-alumni-view";
import DashboardProfilePage from "./pages/dashboard/profiles/dash-profile-view";
import DonationPage from "./pages/donations/donation";
import CareersPage from "./pages/careers/Careers";
import DashCareersList from "./pages/dashboard/careers/dash-careers";
import DashCareerView from "./pages/dashboard/careers/dash-career-view";
import CareerView from "./pages/careers/CareerView";

function App() {
  return (
    <Routes>
      {/* <Route element={<IndexPage />} path="/" /> */}
      <Route element={<HomePage />} path="/" />
      <Route element={<UwezoPage />} path="/whatwedo" />
      <Route element={<DonationPage />} path="/donation" />
      <Route element={<UwezoDetailPage />} path="/whatwedo/:id" />
      <Route element={<CareersPage />} path="/careers" />
      <Route element={<CareerView />} path="/careers/:id" />
      <Route element={<SappyPage />} path="/sappy" />
      <Route element={<SabbyPage />} path="/sabby" />
      <Route element={<ImpactList />} path="/impacts" />
      <Route element={<ImpactView />} path="/impacts/:id" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<BlogDetailPage />} path="/blog/:id" />
      {/* <Route element={<BlogPage />} path="/careers" /> */}
      <Route element={<Publications />} path="/publications" />
      <Route element={<PublicationsView />} path="/publications/:id" />
      <Route element={<AlumniList />} path="/alumni" />
      <Route element={<AlumniView />} path="/alumni/:id" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />

      {/* Dashboard Routes */}
      <Route element={<DashSummaryPage />} path="/dashboard" />
      {/* <Route element={<DashProgramsListPage />} path="/dashboard/programs"/> */}
      <Route element={<DashProfilesListPage />} path="/dashboard/profiles" />
      <Route element={<DashboardProfilePage />} path="/dashboard/profiles/:id" />
      <Route element={<DashImpactsListPage />} path="/dashboard/impacts" />
      <Route element={<DashImpactView />} path="/dashboard/impacts/create" />
      <Route element={<DashImpactView />} path="/dashboard/impacts/:id" />
      <Route element={<DashCareersList />} path="/dashboard/careers" />
      <Route element={<DashCareerView />} path="/dashboard/careers/create" />
      <Route element={<DashCareerView />} path="/dashboard/careers/:id" />
      <Route element={<DashProjectsListPage />} path="/dashboard/projects" />
      <Route element={<DashDonations />} path="/dashboard/donations" />
      <Route element={<DashDonationView />} path="/dashboard/donations/:id" />
      <Route element={<DashProjectPage />} path="/dashboard/projects/:id" />
      <Route element={<DashProjectPage />} path="/dashboard/projects/create" />
      <Route element={<DashAlumniList />} path="/dashboard/alumni" />
      <Route element={<DashAlumniView />} path="/dashboard/alumni/:id" />
      <Route element={<DashboardPartnersPage />} path="/dashboard/partners" />
      <Route
        element={<DashboardPartnerPage />}
        path="/dashboard/partners/:id"
      />
      <Route
        element={<DashboardPartnerPage />}
        path="/dashboard/partners/create"
      />
      <Route element={<DashboardTeamsPage />} path="/dashboard/teams" />
      <Route element={<DashboardTeamPage />} path="/dashboard/teams/:id" />
      <Route element={<DashboardTeamPage />} path="/dashboard/teams/create" />
      <Route element={<DashBlogsListPage />} path="/dashboard/blogs" />
      <Route element={<DashBlogCreate />} path="/dashboard/blogs/create" />
      <Route element={<DashBlogCreate />} path="/dashboard/blogs/:id" />
      <Route element={<DashProfilePage />} path="/dashboard/profile" />
      <Route element={<DashSettingsPage />} path="/dashboard/settings" />
      <Route element={<DashPublications />} path="/dashboard/publications" />
      <Route
        element={<DashPublicationsView />}
        path="/dashboard/publications/:id"
      />
      <Route
        element={<DashPublicationsView />}
        path="/dashboard/publications/create"
      />
    </Routes>
  );
}

export default App;
