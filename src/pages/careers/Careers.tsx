/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
import { Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Career, CareerType } from "../dashboard/careers/dash-careers";

import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function CareersPage() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();

  const [careers, setCareers] = useState<Career[] | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const careerTypeText = (cType: CareerType) => {
    switch (cType) {
      case CareerType.Employment:
        return "Employment";
      case CareerType.Volunteering:
        return "Volunteering";
    }
  };

  const fetchCareers = () => {
    axios
      .get(`${api}/careers?validity=1`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res?.data) {
          const careerData: Career[] = Array.from(res.data).map(
            (career: any) => ({
              careerId: career.careerId,
              position: career.position,
              description: career.description,
              requirements: career.requirements,
              careerType: Number(career.careerType),
              careerValidity: Number(career.careerValidity),
            })
          );

          setCareers(careerData);

          setIsloading(false);
        }
      });
  };

  useEffect(() => {
    if (careers === null) {
      setIsloading(true);

      fetchCareers();
    }
  }, [careers]);

  return (
    <DefaultLayout>
      <section className="w-full flex flex-col p-10 gap-5 cursor-default">
        {/* Main Actions */}
        <div className="w-full flex flex-col gap-5 space-y-5">
          <h1 className={title()} >Careers</h1>
          <p className={` text-2xl text-balance`}>
            Great Hope Foundation, yearly works with a pool of volunteers
            countrywide in implementing UWEZO PROGRAM, and some few succeed in
            joining Great Hope Foundation team as employees. Volunteers that are
            picked are normally form four/form six and University students.
            Write to us, with the intention of becoming a volunteer.
          </p>
        </div>
        {isLoading ? (
          <>
            <Spinner
              className=" flex justify-center "
              color="primary"
              label="Loading..."
              size="lg"
            />
          </>
        ) : (
          <div>
            {careers?.length === 0 ? (
              <>
              <div className="w-full flex justify-center">
                <p>No Careers open at the momment</p>
              </div>
              </>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {careers?.map((ca) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <div
                    key={`${ca?.careerId}`}
                    className="w-full p-5 border rounded-lg space-y-3 hover:border-transparent"
                    onClick={() => {
                      nav(`/careers/${ca?.careerId}`, {
                        state: `${ca?.careerId}`,
                      });
                    }}
                  >
                    <div className="w-full space-y-2">
                      <h2 className="text-xl font-semibold">{ca?.position}</h2>
                      <p className="text-sm text-gray-500">
                        {careerTypeText(Number(ca?.careerType))}
                      </p>
                    </div>
                    <div className="w-full space-y-2">
                      <p className="text-sm">{ca?.description}</p>
                    </div>
                    <div className="w-full flex justify-end">
                      <Button
                        color="primary"
                        variant="solid"
                        onClick={() => {
                          nav(`/careers/${ca?.careerId}`, {
                            state: `${ca?.careerId}`,
                          });
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
