import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Image } from "@nextui-org/react";
import axios, { AxiosResponse, HttpStatusCode, AxiosError } from "axios";
import { useRef } from "react";
import { GoHome } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

type registerRequest = {
  firstname?: string;
  email?: string;
  password?: string;
};

export default function RegisterPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  //Form Refs
  const fnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const copassRef = useRef<HTMLInputElement>(null);

  const onRegister = () => {
    alert(emailRef?.current?.value);

    if (emailRef?.current?.value === "") {
      alert(`Email is required!.`);
    }

    if (passRef?.current?.value === "") {
      alert(`Password is required!.`);
    }

    const data: registerRequest = {
      firstname: fnameRef?.current?.value,
      email: emailRef?.current?.value,
      password: passRef?.current?.value,
    };

    axios
    .post(`${api}/auth/register`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((res: AxiosResponse) => {
      if (res.status === HttpStatusCode.Ok) {
        console.log(res.data);

        setTimeout(() => {
          alert(`Registered in: ${res?.data?.email}, Login to continue.`);
        }, 3000);

        navigate("/login");
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
          Back Home <GoHome size={16} />
        </Button>
      </div>

      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 p-5 font-semibold">
        {/* Login Form */}
        <div className="w-full gap-5 flex flex-col px-10">
          <h1 className=" text-3xl ">Welcome!</h1>
          <h3 className=" text-medium">Register in to continue</h3>

          {/* Email */}

          <div className="w-full space-y-3">
            <label htmlFor="firstname">Firstname</label>
            <Input
              type="text"
              ref={fnameRef}
              placeholder="Enter your Firstname"
            />
          </div>
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

          <div className="w-full space-y-3">
            <label htmlFor="copassword">Confirm password</label>
            <Input
              type="password"
              ref={copassRef}
              placeholder="Confirm your password"
            />
          </div>

          {/* CTO */}

          <div className="w-full space-y-3">
            <label htmlFor=""></label>
            <Button
              className="w-full bg-orange-400"
              variant="flat"
              onClick={onRegister}
            >
              Register
            </Button>
          </div>

          <div className="w-full flex gap-3 justify-center items-center">
            <hr className="bg-orange-500 text-2xl w-full" />
            <label htmlFor="">Or</label>
            <hr className="bg-orange-500 text-2xl w-full" />
          </div>

          {/* CTO */}

          <div className="w-full flex gap-3 text-medium">
            <label htmlFor="login">Already have an Account?</label>
            <Link to={"/login"} className="underline">
              login here
            </Link>
          </div>
        </div>
        {/* Login Form End */}
        <Image
          isZoomed
          width={2000}
          src="/assets/images/auth/register_img.JPG"
        />
        {/* Login Image End */}
      </section>
    </div>
  );
}
