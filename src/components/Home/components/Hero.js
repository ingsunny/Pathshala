"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger the animation after a short delay to allow the component to render
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 200);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="bg-[#EEFBFF] px-5 xl:px-0 pt-36 md:pt-48 lg:pb-0 pb-10">
      <section className="max-w-screen-xl m-auto">
        <div className="text-center">
          <h1 className="text-[2.6rem] sm:text-[3rem] font-bold">
            Give the{" "}
            <div className="relative inline-block">
              Best Start
              <div className="absolute overflow-hidden w-full -bottom-[0.4rem]">
                <Image
                  style={{ transitionDuration: "1.5s", width: "100%", height: "auto" }}
                  className={`-bottom-[0.2rem] left-1 transition-all ease-in-out ${
                    animate ? "opacity-100" : "opacity-0"
                  }`}
                  src="/blue-line.png"
                  height={100}
                  width={200}
                  alt="blueline"
                />
              </div>
            </div>{" "}
            to Your Career
          </h1>
          <p className="text-[1.375rem] text-[#484848] py-[1.6rem]">
            Learn, practice, and get hired!
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-16  sm:px-5">
          <a href="#categories">
            {" "}
            <div className=" rounded-xl overflow-hidden  bg-white flex  justify-between md:h-[240px] relative cursor-pointer  transform scale-100 hover:scale-[101.6%] transition-transform duration-300 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="p-7 flex flex-col justify-between">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <h3 className="text-xl text-[#333333] font-semibold">
                      Certification courses
                    </h3>{" "}
                    <span className="text-xs text-[#333333] border border-[#eeeeee] bg-[#f8f8f8] rounded-sm py-1 px-2 font-semibold w-fit">
                      4-8 weeks
                    </span>
                  </div>
                  <p className="text-[#33338f] text-[1.12rem]">
                    Learn in-demand skills and get certified
                  </p>
                </div>
                <button className="text-[#008bdc] mt-7 font-semibold flex items-center gap-1">
                  Explore now
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-6 h-6 -rotate-45"
                    >
                      <path
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <Image
                className="h-full object-cover w-[250px] right-0 absolute md:block hidden "
                height={300}
                width={300}
                src="/boy.png"
                alt="boy"
              />
            </div>
          </a>
          <a href="#categories">
            <div className=" rounded-xl overflow-hidden bg-white flex  justify-between md:h-[240px] relative cursor-pointer  transform scale-100 hover:scale-[101.6%] transition-transform duration-300 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="p-7 flex flex-col justify-between">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <h3 className="text-xl text-[#333333] font-semibold">
                      Placement Guarantee courses
                    </h3>{" "}
                    <span className="text-xs text-[#333333] border border-[#eeeeee] bg-[#f8f8f8] rounded-sm py-1 px-2 font-semibold w-fit">
                      4-12 months
                    </span>
                  </div>
                  <p className="text-[#33338f] text-[1.12rem]">
                    Upskill and get a guaranteed placement
                  </p>
                </div>
                <button className="text-[#008bdc] mt-7 font-semibold flex items-center gap-1">
                  Explore now
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-6 h-6 -rotate-45"
                    >
                      <path
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <Image
                className="h-full object-cover w-[250px] right-0 absolute md:block hidden "
                height={300}
                width={300}
                src="/girl.png"
                alt="boy"
              />
            </div>
          </a>
        </div>
      </section>

      {/* <section className="flex lg:items-center lg:flex-row flex-col justify-between max-w-screen-xl m-auto ">
        <div className="flex flex-col gap-5 sm:gap-7 ">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl lg:leading-[55px] text-[#1d1d1d] font-bold">
            Instant Doubt <br className="lg:block hidden" /> Support,
            Mentorship, <br />
            Internship & For Free
          </h1>
          <p className="text-lg sm:text-xl text-[#303030]">
            Learn, Practice, and get hired!
          </p>
          <a
            href="#categories"
            className="bg-[#9168f9] rounded text-lg sm:text-xl w-fit hover:bg-[#6E4DFE] text-white px-4 py-2"
          >
            Explore Now!
          </a>
        </div>
        <Image
          src="/student.png"
          className="lg:block hidden lg:w-[400px] "
          height={100}
          width={500}
          alt="student"
        />
      </section> */}

      <section className="flex flex-col items-center gap-10 py-16 sm:py-20 mt-8 sm:mt-10">
        <p className="text-[1.3rem] sm:text-[1.5rem] text-center text-[#484848] font-semibold ">
          Top companies hiring from us
        </p>
        <div className="sm:mb-3 overflow-hidden w-full sm:w-[85%] xl:max-w-screen-xl">
          <div className="flex gap-14 py-1 h-[70px] w-full animate-marquee opacity-55 text-zinc-600/30 text-4xl sm:text-5xl font-extrabold">
            <Image
              src="/byju.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/ey.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/bosch.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/birla.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />

            <Image
              src="/bombay-shaving-company.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/mi.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/redbus.png.webp"
              className="grayscale h-auto w-auto"
              width={130}
              height={160}
              alt="company"
            />
            <Image
              src="/nestle.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />

            <Image
              src="/hcl.png.webp"
              className="grayscale h-auto w-auto"
              width={170}
              height={160}
              alt="company"
            />
            <Image
              src="/zomato.png.webp"
              className="grayscale h-auto w-auto"
              width={130}
              height={160}
              alt="company"
            />

            <Image
              src="/disney.png.webp"
              className="grayscale h-auto w-auto"
              width={130}
              height={160}
              alt="company"
            />
            <Image
              src="/justdial.png.webp"
              className="grayscale h-auto w-auto"
              width={130}
              height={160}
              alt="company"
            />
            <Image
              src="/make-my-trip.png.webp"
              className="grayscale w-auto h-auto"
              width={130}
              height={160}
              alt="company"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
