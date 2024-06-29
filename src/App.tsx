import { Route, Routes } from "react-router-dom";

import Dashy from "./pages/dashboard/dashy";
import HomePage from "./pages/home";

// import DocsPage from "@/pages/docs";
// import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";

function App() {
  return (
    <Routes>
      {/* <Route element={<IndexPage />} path="/" /> */}
      <Route element={<HomePage />} path="/" />
      <Route element={<BlogPage />} path="/uwezo" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<BlogPage />} path="/careers" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<Dashy />} path="/dashy" />
      {/* <Route element={<DocsPage />} path="/docs" /> */}
      {/* <Route element={<PricingPage />} path="/pricing" /> */}
    </Routes>
  );
}

export default App;
