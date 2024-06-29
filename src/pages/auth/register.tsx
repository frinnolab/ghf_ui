import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  //Form Refs
  const fnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const copassRef = useRef<HTMLInputElement>(null);

  const onRegister = ()=>{
    alert(emailRef?.current?.value);
  }
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
        <div className="w-full gap-5 flex flex-col px-5">
          <h1 className=" text-2xl ">Welcome!</h1>
          <h3 className=" text-medium">Register in to continue</h3>

          {/* Email */}

          <div className="w-full space-y-3">
            <label htmlFor="firstname">Firstname</label>
            <Input type="text" ref={fnameRef} placeholder="Enter your Firstname" />
          </div>
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

          <div className="w-full space-y-3">
            <label htmlFor="copassword">Confirm password</label>
            <Input type="password" ref={copassRef} placeholder="Confirm your password" />
          </div>

          {/* CTO */}

          <div className="w-full space-y-3">
            <label htmlFor=""></label>
            <Button className="w-full bg-orange-400" variant="flat" onClick={onRegister}>
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

        <img width={900}  
          src="/assets/images/auth/register_img.JPG"
          className="rounded-lg shadow-2xl"
        />
        {/* Login Image End */}
      </section>
    </div>
  );
}
