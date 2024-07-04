import { Route, Routes } from "react-router-dom";

import Dashy from "./pages/dashboard/dashy";
import HomePage from "./pages/home";

// import DocsPage from "@/pages/docs";
// import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
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

function App() {
  return (
    <Routes>
      {/* <Route element={<IndexPage />} path="/" /> */}
      <Route element={<HomePage />} path="/" />
      <Route element={<BlogPage />} path="/uwezo" />
      <Route element={<BlogPage />} path="/careers" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<DashSummaryPage />} path="/dashboard"/>
      {/* <Route element={<DashProgramsListPage />} path="/dashboard/programs"/> */}
      <Route element={<DashProfilesListPage />} path="/dashboard/profiles"/>
      <Route element={<DashProjectsListPage />} path="/dashboard/projects"/>
      <Route element={<DashBlogsListPage />} path="/dashboard/blogs"/>
      <Route element={<DashBlogCreate />} path="/dashboard/blogs/create"/>
      <Route element={<DashBlogCreate />} path="/dashboard/blogs/:id"/>
      <Route element={<DashProfilePage />} path="/dashboard/profile"/>
      <Route element={<DashSettingsPage />} path="/dashboard/settings"/>
      <Route element={<Dashy />} path="/dashy" />
    </Routes>
  );
}

export default App;
