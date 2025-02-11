/* eslint-disable jsx-a11y/label-has-associated-control */
import useAuthedProfile from "@/hooks/use-auth";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Image, Spinner } from "@nextui-org/react";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GoEye, GoEyeClosed, GoHome } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

type loginRequest = {
  email?: string;
  password?: string;
};

export type ResponseInfo = {
  message?: string;
  status?: string;
  delay?: number;
};

export type ErrorInfo = {
  message?: string;
};

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
  const [] = useState<ResponseInfo | null>(null);
  const [] = useState<ErrorInfo | null>(null);
  const storage = window.sessionStorage;

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const authed = useAuthedProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginRequest>();

  useEffect(() => {
    if (authed) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = (log: loginRequest) => {
    const data: loginRequest = {
      email: log?.email,
      password: log?.password,
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
            setIsloading(false);
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
        <div className="w-full gap-5 flex flex-col px-10 space-y-3 font-semibold">
          <h1 className=" text-3xl ">Welcome Back!</h1>
          <h3 className=" text-medium">Sign in to continue</h3>

          {isLoading ? (
            <>
              <Spinner
                className={` justify-center items-center `}
                label="Signing in..."
              />
            </>
          ) : (
            <>
              <form
                className="w-full flex flex-col gap-3 p-5 space-y-2"
                onSubmit={handleSubmit(handleLogin)}
              >
                {/* Email */}

                <div className="w-full space-y-3">
                  <label htmlFor="email">Email</label>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", { required: true })}
                  />

                  {errors.email && (
                    <span className="text-danger">Email field is required</span>
                  )}
                </div>

                {/* Password */}

                <div className="w-full space-y-3">
                  <label htmlFor="password">Password</label>
                  <Input
                    {...register("password", { required: true })}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <GoEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <GoEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                  />

                  {errors.password && (
                    <span className="text-danger">
                      Password field is required
                    </span>
                  )}
                </div>

                {/* CTO */}

                <div className="w-full space-y-3">
                  <label htmlFor="loginBtn" />
                  <Button
                    className="w-full bg-orange-400"
                    type="submit"
                    variant="flat"
                  >
                    Login
                  </Button>
                </div>

                <div className="w-full hidden gap-3 text-center">
                  <p>Forgot password?</p>{" "}
                  <a href="forgot" className="text-primary">
                    Click here
                  </a>
                </div>
              </form>
            </>
          )}

          <div className="w-full flex gap-3 justify-center items-center">
            <hr className="text-2xl w-full" />
            <label htmlFor="Or">Or</label>
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
