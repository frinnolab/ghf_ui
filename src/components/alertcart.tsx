import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { GoCheckCircleFill } from "react-icons/go";

export default function AlertCardWidget({ children }: { children: {message:string, type:number, delay:number } }) {
//   const message = children[0];
//   const message = children[0];
//   const responseType = children[1];
//   const delay = children[2];
  return (
    <Modal>
      <ModalBody>
        <ModalHeader></ModalHeader>
        <ModalContent>
          {Number(children.type) === 0 ? (
            <div className={` bg-green-500 rounded-full p-5`}>
                {/* Success */}
                <GoCheckCircleFill/>

            </div>
          ) : <></>}
          <p className=" text-default-50 texts, ">{children.message}</p>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
}
