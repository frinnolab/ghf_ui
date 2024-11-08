import DefaultLayout from "@/layouts/default";
import { Button, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Career, CareerType } from "../dashboard/careers/dash-careers";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      .get(`${api}/careers`, {
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
      <section className="w-full flex flex-col p-10 gap-3 cursor-default">
        {/* Main Actions */}
        <div className="w-full flex flex-col">
          <h1 className="text-2xl">Careers</h1>
          <p>Join our ever growing community</p>
        </div>
        {isLoading ? (
          <>
            <Spinner
              size="lg"
              className=" flex justify-center "
              label="Loading..."
              color="primary"
            />
          </>
        ) : (
          <div>
            {careers?.length === 0 ? (
              <></>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {careers?.map((ca) => (
                  <div className="w-full p-5 border rounded-lg space-y-3 hover:border-transparent" onClick={()=>{
                    nav(`/careers/${ca?.careerId}`,{
                        state:`${ca?.careerId}`
                    })
                  }}>
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
                            nav(`/careers/${ca?.careerId}`,
                                {
                                    state:`${ca?.careerId}`
                                }
                            );
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
