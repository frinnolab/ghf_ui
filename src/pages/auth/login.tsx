import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const onLogin = ()=>{}
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
          Back Home
        </Button>
      </div>

      <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 p-5">
        {/* Login Form */}
        <div className="w-full gap-5 flex flex-col px-5 space-y-5">
          <h1 className=" text-2xl ">Welcome Back!</h1>
          <h3 className=" text-medium">Sign in to continue</h3>

          {/* Email */}

          <div className="w-full space-y-3">
            <label htmlFor="email">Email</label>
            <Input type="email" ref={emailRef} placeholder="Enter your email" />
          </div>

          {/* Password */}

          <div className="w-full space-y-3">
            <label htmlFor="password">Password</label>
            <Input type="password" ref={passRef} placeholder="Enter your password" />
          </div>

          {/* CTO */}

          <div className="w-full space-y-3">
            <label htmlFor=""></label>
            <Button className="w-full bg-orange-400" variant="flat" onClick={onLogin}>
              Login
            </Button>
          </div>

          <div className="w-full flex gap-3 justify-center items-center">
            <hr className="bg-orange-500 text-2xl w-full" />
            <label htmlFor="">Or</label>
            <hr className="bg-orange-500 text-2xl w-full" />
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
        <img width={900} 
          src="/assets/images/auth/login_img.jpg"
          className="rounded-lg shadow-2xl"
        />
        {/* Login Image End */}
      </section>
    </div>
  );
}
