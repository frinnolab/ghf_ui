import useAuthedProfile from "@/hooks/use-auth";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Image } from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import { GoHome } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

type loginRequest = {
  email?: string;
  password?: string;
};

export type ResponseInfo = {
  message?:string; 
  status?:string;
  delay?:number;
}

export type ErrorInfo = {
  message?:string; 
}

export type loginResponse = {
  profileId?: string;
  email?: string;
  role?: number;
  token?: string;
};
export default function LoginPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  const [, setResData] = useState<loginResponse | null>(null);
  const [responseInfo, setResponseInfo] = useState<ResponseInfo|null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo|null>(null);
  const storage = window.sessionStorage;

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const authed = useAuthedProfile();

  useEffect(() => {
    if(authed){
      navigate('/dashboard');
    }
  }, []);

  const handleLogin = () => {
    if (emailRef?.current?.value === "") {
      alert(`Email is required!.`);
    }

    if (passRef?.current?.value === "") {
      alert(`Password is required!.`);
    }

    //
    const data: loginRequest = {
      email: emailRef?.current?.value,
      password: passRef?.current?.value,
    };


    axios
      .post(`${api}/auth/login`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res: AxiosResponse) => {
        if (res.status === HttpStatusCode.Ok) {
          console.log(res.data);

          const data = {
            profileId: `${res?.data["profileId"]}`,
            email: `${res?.data["email"]}`,
            token: `${res?.data["token"]}`,
            role: Number(`${res?.data["roleType"]}`) ?? 0, // ,
          };

          setResData(data);

          if (storage.getItem("profile")) {
            storage.clear();
          }

          storage.setItem("profile", JSON.stringify(data));

          setTimeout(() => {
            alert(`Logged in: ${res?.data?.email}`);
          }, 3000);

          navigate("/dashboard");
        }
      })
      .catch((e: AxiosError) => {
        alert(`${e.response?.data}`);
      });
  };
  return (
    <div className="w-full flex flex-col md:gap-10 items-center bg-slate-0 h-screen p-5">
      <div className="w-full">
        <Button
          className="text-sm font-normal text-default-600 bg-default-100 border border-transparent hover:border-orange-500"
          variant="flat"
          onClick={() => {
            navigate("/");
          }}
        >
          Back Home{" "}
          <span>
            <GoHome size={16} />
          </span>
        </Button>
      </div>

      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 p-5">
        {/* Login Form */}
        <div className="w-full gap-5 flex flex-col px-10 space-y-5 font-semibold">
          <h1 className=" text-3xl ">Welcome Back!</h1>
          <h3 className=" text-medium">Sign in to continue</h3>

          {/* Email */}

          <div className="w-full space-y-3">
            <label htmlFor="email">Email</label>
            <Input type="email" ref={emailRef} placeholder="Enter your email" />
          </div>

          {/* Password */}

          <div className="w-full space-y-3">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              ref={passRef}
              placeholder="Enter your password"
            />
          </div>

          {/* CTO */}

          <div className="w-full space-y-3">
            <label htmlFor=""></label>
            <Button
              className="w-full bg-orange-400"
              variant="flat"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>

          <div className="w-full flex gap-3 justify-center items-center">
            <hr className="text-2xl w-full" />
            <label htmlFor="">Or</label>
            <hr className="text-2xl w-full" />
          </div>

          {/* CTO */}

          <div className="w-full flex gap-3 text-medium">
            <label htmlFor="register">No Account?</label>
            <Link to={"/register"} className="underline">
              register here
            </Link>
          </div>
        </div>
        {/* Login Form End */}

        {/* Login Image */}
        {/* <div className="w-full bg-yellow-0 p-3">
        </div> */}
        {/* <p>image</p> */}
        <Image isZoomed width={2000} src="/assets/images/auth/login_img.jpg" />
        {/* <img
          width={900}
          src="/assets/images/auth/login_img.jpg"
          className="rounded-lg shadow-2xl"
        /> */}
        {/* Login Image End */}
      </section>
    </div>
  );
}
