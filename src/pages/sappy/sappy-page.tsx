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
  const txtHeadSec1Ref = useRef<HTMLHeadingElement>(null);
  const txtHeadSec2Ref = useRef<HTMLHeadingElement>(null);
  const txtHeadSec3Ref = useRef<HTMLHeadingElement>(null);

  const cont1Ref = useRef<HTMLDivElement>(null);
  const cont2Ref = useRef<HTMLDivElement>(null);
  const cont3Ref = useRef<HTMLDivElement>(null);
  
  
  const orBoxRef = useRef<HTMLDivElement>(null);
  const pinBoxRef = useRef<HTMLDivElement>(null);
  const slateBoxRef = useRef<HTMLDivElement>(null);

  const setupFx = () => {
    fx.set(cont1Ref.current, {
      y: "-8vh",
    });

    fx.set(txtHeadSec1Ref.current, {
      opacity: 0,
    });
  };

  const txtHdSec1Fx = () =>
    tl.to(txtHeadSec1Ref.current, {
        scrollTrigger: {
            trigger: cont1Ref.current,
            markers: true,
            start: "30% 40%",
            end: "+=50",
            endTrigger:cont1Ref.current,
            toggleActions:"play none none reverse",
            pinSpacing:false,
            scrub:1
          },
      opacity: 1,
      fontSize: "30px",
      color: "red",
      delay: "1.5",
      textAlign: "center",
      alignSelf: "center",
      y: "50vh",
      ease: "power2.in",
    });

  const sect1Fx = () =>
    tl.to(cont1Ref.current, {
    //   scrollTrigger: {
    //     trigger: cont1Ref.current,
    //     markers: true,
    //     start: "bottom center",
    //     end: "bottom 60%",
    //     toggleActions:"play none none reverse",
    //     pinSpacing:false
    //   },
    //   backgroundColor: "brown",
    });

  //#endregion

  //Fx Setup
  useGSAP(() => {
    setupFx();
  }, []);

  //Fx Run
  useGSAP(() => {
    txtHdSec1Fx();

    //sect1Fx();
  }, []);

  return (
    <DefaultLayout>
      {/* Cont1 */}
      <section ref={cont1Ref} className="h-screen bg-blue-500">
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
