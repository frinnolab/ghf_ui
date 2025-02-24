/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable prettier/prettier */
import {
  Button,
  Spinner,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      <section className="w-full flex flex-col gap-5 cursor-default">
        <div className="sm:h-[50dvh] w-full flex flex-col justify-center">
          {/* Header Text */}
          <div className="w-full flex flex-col gap-5 z-30 absolute text-end p-5">
            <div className="w-full flex justify-end">
              <div className="text-primary flex flex-col shadow-2xl space-y-5 font-semibold border border-transparent p-5 rounded-2xl bg-default-50/70 absolute top-[100%] right-10">
                <h1 className=" text-2xl md:text-4xl font-semibold">CAREERS</h1>
              </div>
            </div>
          </div>
          {/* Header Text End*/}

          <div className="w-full absolute top-[-50%] filter saturate-[90%]">
            <Image
              alt="Careers Bg"
              className=" object-fill "
              radius="none"
              src="assets/images/static/Careers_BG.jpg"
              width={3000}
            />
          </div>
        </div>
        {/* Main Actions */}
        <div className="w-full bg-default-200 z-10 p-10 space-y-5">
          <div className="w-full flex flex-col gap-5 space-y-5">
            <h1 className={title()}>Join us</h1>
            <p className={` text-2xl text-balance`}>
              Great Hope Foundation, yearly works with a pool of volunteers
              countrywide in implementing UWEZO PROGRAM, and some few succeed in
              joining Great Hope Foundation team as employees. Volunteers that
              are picked are normally form four/form six and University
              students. Write to us, with the intention of becoming a volunteer.
            </p>
          </div>

          {/* Career Content */}
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
                    {/* <p>No Careers open at the momment</p> */}
                  </div>
                </>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {careers?.map((ca) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <div
                      key={`${ca?.careerId}`}
                      className="w-full p-5 bg-default-100 rounded-lg space-y-3 hover:border-transparent"
                      onClick={() => {
                        nav(`/careers/${ca?.careerId}`, {
                          state: `${ca?.careerId}`,
                        });
                      }}
                    >
                      <div className="w-full space-y-2">
                        <h2 className="text-xl font-semibold">
                          {ca?.position}
                        </h2>
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
          {/* Career Content End*/}

          {/* Career Constant form */}

          <div className="w-full flex justify-center">
            <Button color="primary" variant="solid" onPress={onOpen}>
              {" "}
              Apply as Volunteer
            </Button>

            {/* Career Form */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader>
                      <h1>Apply as a Volunteer</h1>
                    </ModalHeader>
                    <ModalBody>
                      <form>

                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                      <Button color="primary" variant="solid" onPress={()=>{
                        onClose();
                      }}>Submit</Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/* Career Form End */}
          </div>

          {/* Career Constant form End */}
        </div>
      </section>
    </DefaultLayout>
  );
}
