import DefaultLayout from "@/layouts/default";
import { gsap as fx } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

const SappyPage = () => {
  const tl = fx.timeline({
    defaults: {
      duration: 1,
    },
  });
  fx.registerPlugin(ScrollTrigger);

  //#region Sappy Refs
  //Texts
  const txtHeadSec1Ref = useRef<HTMLHeadingElement>(null);
  const txtHeadSec2Ref = useRef<HTMLHeadingElement>(null);
  const txtHeadSec3Ref = useRef<HTMLHeadingElement>(null);
  
  //Containers
  const cont1Ref = useRef<HTMLDivElement>(null);
  const cont2Ref = useRef<HTMLDivElement>(null);
  const cont3Ref = useRef<HTMLDivElement>(null);
  
  
  //Container Boxes
  const orBoxRef = useRef<HTMLDivElement>(null);
  const pinBoxRef = useRef<HTMLDivElement>(null);
  const slateBoxRef = useRef<HTMLDivElement>(null);

  const setupFx = () => {
    // fx.set(cont1Ref?.current,{
    //   "position":"relative",
    // })
  };

  //#endregion

  //Fx Setup
  useGSAP(() => {
    setupFx();
  }, []);

  //Fx Run
  useGSAP(() => {
  }, []);

  return (
    <DefaultLayout>
      {/* Cont1 */}
      <section ref={cont1Ref} className="min-h-screen bg-blue-500">
        <h1 ref={txtHeadSec1Ref}>Blue Section</h1>

        <div className="box w-20 h-20 bg-orange-500 text-center flex  justify-center items-center" ref={orBoxRef}>
            <h1>A</h1>
        </div>
      </section>

      {/* Cont2 */}
      <section ref={cont2Ref} className="h-screen bg-green-500">
        <h1 ref={txtHeadSec2Ref}>Green Section</h1>
        
        <div className="box w-20 h-20 bg-pink-500 text-center flex  justify-center items-center" ref={pinBoxRef}>
            <h1>B</h1>
        </div>
      </section>

      {/* Cont3 */}
      <section ref={cont3Ref} className="h-screen bg-yellow-500">
        <h1 ref={txtHeadSec3Ref}>Yellow Section</h1>
        
        <div className="box w-20 h-20  bg-slate-500 text-center flex  justify-center items-center" ref={slateBoxRef}>
            <h1>C</h1>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default SappyPage;
