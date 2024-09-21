import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alumni } from "./dash-alumni-list";

export default function DashAlumniView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const route = useLocation();
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  
  const [alumniId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const handleBack = () => nav("/dashboard/alumnis");

  return (
    <div className="w-full">
      <h1>{alumniId}</h1>
    </div>
  );
}
