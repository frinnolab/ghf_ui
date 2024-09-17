import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Donation } from "./dash-donations-list";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { GoArrowLeft } from "react-icons/go";
import axios, { AxiosResponse, AxiosError } from "axios";

export default function DashDonationView() {
  const api = `${import.meta.env.VITE_API_URL}`;
  const nav = useNavigate();
  const route = useLocation();
  const [isEdit] = useState<boolean>(false);
  const [donationId] = useState<string | null>(() => {
    if (route?.state !== null) {
      return route?.state;
    } else {
      return null;
    }
  });
  const [donation, setDonation] = useState<Donation | null>(null);

  const handleBack = () => nav("/dashboard/donations");

  useEffect(() => {
    if (donationId) {
      axios
        .get(`${api}/donations/${donationId}`)
        .then((res: AxiosResponse) => {
          alert(res?.data);
          if (res?.data) {
            const data: Donation = {
              amountPledged: res?.data?.amountPledged,
              company: res?.data?.company,
              description: res?.data?.description,
              donationId: res?.data?.donationId,
              email: res?.data?.email,
              firstname: res?.data?.firstname,
              lastname: res?.data?.lastname,
              mobile: res?.data?.mobile,
              donorCurrencyType: Number(res?.data?.donorCurrencyType),
              donorType: Number(res?.data?.donorType),
            };

            setDonation(data);
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }, [donationId]);

  return (
    <div className="w-full">
      <div className="w-full p-3 flex items-center gap-5">
        <Button variant="light" onClick={handleBack}>
          <GoArrowLeft size={20} />
        </Button>
        <h1 className=" text-2xl ">{`${route?.state === null ? "" : ` ${isEdit ? "" : "View"} Donation`}`}</h1>
      </div>

      <Divider />

      <div className="w-full flex flex-col p-5 gap-5">
        <div className={` flex justify-end items-center gap-5 `}>
          <p>{`Mode: ${isEdit ? "Edit" : "View"}`}</p>
          <p>{donation?.donationId}</p>

          {/* <Switch
            onClick={() => {
              if (!isEdit) {
                setIsEdit(true);
              } else {
                setIsEdit(false);
              }
            }}
            defaultSelected={isEdit}
            size="lg"
            startContent={<GoPencil />}
            endContent={<GoEye />}
            title={`${isEdit ? "Edit mode" : "View mode"}`}
          ></Switch> */}
        </div>

        <div className="w-full rounded-2xl bg-default-200 shadow flex p-5 justify-between">
          <h1>{donation?.email}</h1>
        </div>
      </div>
    </div>
  );
}
