import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Image, Spinner } from "@nextui-org/react";
import axios, { AxiosResponse, HttpStatusCode, AxiosError } from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GoEye, GoEyeClosed, GoHome } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

type registerRequest = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export default function RegisterPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const navigate = useNavigate();
  //Form Refs
  const copassRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerRequest>();

  const onRegister = (d: registerRequest) => {
    if (`${d?.password}` !== `${copassRef?.current?.value}`) {
      alert("Passwords don't match!");
    } else {
      setIsloading(true);
      const data: registerRequest = {
        firstname: d?.firstname,
        lastname: d?.lastname,
        email: d?.email,
        password: d?.password,
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
              setIsloading(false);
            }, 3000);

            navigate("/login");
          }
        })
        .catch((e: AxiosError) => {
          alert(`${e.response?.data}`);
        });
    }
  };
  return (
    <div className="w-full flex flex-col items-center p-5">
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

      <section className="w-full flex items-center justify-between gap-5 font-semibold p-10">
        {isLoading ? (
          <>
            <Spinner
              className={` justify-center items-center `}
              label="Registering..."
            />
          </>
        ) : (
          <>
            {/* Login Form */}
            <form
              className="w-full gap-3 flex flex-col p-5"
              onSubmit={handleSubmit(onRegister)}
            >
              <h1 className=" text-3xl ">Welcome!</h1>
              <h3 className=" text-medium">Register in to continue</h3>

              {/* Email */}

              <div className="w-full flex gap-5">
                <div className="w-full space-y-3">
                  <label htmlFor="firstname">Firstname</label>
                  <Input
                    required
                    type="text"
                    {...register("firstname", { required: true })}
                    placeholder="Enter your firstname"
                  />

                  {errors.firstname && (
                    <span className="text-danger">
                      Firstname field is required
                    </span>
                  )}
                </div>

                <div className="w-full space-y-3">
                  <label htmlFor="lastname">Lastname</label>
                  <Input
                    required
                    type="text"
                    {...register("lastname", { required: true })}
                    placeholder="Enter your lastname"
                  />

                  {errors.lastname && (
                    <span className="text-danger">
                      Lastname field is required
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}

              <div className="w-full space-y-3">
                <label htmlFor="email">Email</label>
                <Input
                  required
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="text-danger">Email field is required</span>
                )}
              </div>

              <div className="w-full flex gap-5">
                {/* Password */}

                <div className="w-full space-y-3">
                  <label htmlFor="password">Password</label>
                  <Input
                    {...register("password", { required: true })}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="toggle password visibility"
                      >
                        {isVisible ? (
                          <GoEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <GoEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                </div>

                <div className="w-full space-y-3">
                  <label htmlFor="copassword">Confirm password</label>
                  <Input
                    required
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility2}
                        aria-label="toggle password visibility"
                      >
                        {isVisible2 ? (
                          <GoEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <GoEyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible2 ? "text" : "password"}
                    ref={copassRef}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* CTO */}

              <div className="w-full space-y-3">
                <label htmlFor=""></label>
                <Button
                  className="w-full bg-orange-400"
                  variant="flat"
                  type="submit"
                  // onClick={onRegister}
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
            </form>
            {/* Login Form End */}
          </>
        )}

        <Image width={2000} isZoomed src="/assets/images/auth/_MBX0174.jpg" />
        {/* <div className="w-full gap-5 flex flex-col justify-center p-5">
        </div> */}
        {/* Login Image End */}
      </section>
    </div>
  );
}
