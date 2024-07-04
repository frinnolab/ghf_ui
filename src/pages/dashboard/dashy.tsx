import { useEffect } from "react";

export default function Dashy() {

  useEffect(()=>{
    alert("Dashboard!");;
  },[]);
  return (
    <div className="w-full flex justify-center">
      <p>Dashy</p>
    </div>
  );
}
