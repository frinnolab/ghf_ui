import { loginResponse } from "@/pages/auth/login";
import { useState } from "react";

export default function useAuthedProfile(){
    const [authedProfile] = useState<loginResponse | null>(() => {
        if (window.sessionStorage.length > 0) {
          const data = JSON.parse(`${window.sessionStorage.getItem("profile")}`);
          return {
            profileId: `${data["profileId"]}`,
            email: `${data["email"]}`,
            token: `${data["token"]}`,
            role: Number(`${data["role"]}`),
          };
        }
        return null;
      });

      return authedProfile;
}