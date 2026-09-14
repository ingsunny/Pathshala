import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  return (
    <section className="bg-[#F0F8FF] px-5 xl:px-0 sm:py-14">
      <div className="max-w-screen-xl m-auto py-10">
        <div className="flex sm:flex-row flex-col gap-3">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M31.4081 17.8649C28.62 18.1673 25.9082 19.3903 23.7659 21.5326C21.7204 23.5781 20.513 26.1429 20.1448 28.7975C19.7838 26.1617 18.5929 23.6219 16.5709 21.5999C14.5277 19.5567 11.9558 18.3621 9.29033 18.0149L9.23863 17.9632C11.9165 17.606 14.5066 16.3955 16.5689 14.3332C18.6591 12.2431 19.8742 9.61082 20.2129 6.89448L20.2827 6.82476C20.6105 9.53036 21.8098 12.1461 23.8818 14.2181C25.9785 16.3148 28.6319 17.5179 31.3718 17.8286L31.4081 17.8649Z"
              fill="url(#paint0_linear_1904_41193)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.82865 6.8429C7.03163 7.63993 6.0358 8.11736 5 8.27539C6.03644 8.43573 7.03368 8.91554 7.83277 9.71463C8.62924 10.5111 9.10851 11.5044 9.27041 12.5372C9.42948 11.5038 9.90657 10.5106 10.7019 9.71525C11.4435 8.97365 12.3572 8.50874 13.3151 8.32036C12.3339 8.13792 11.3953 7.66683 10.6358 6.90726C9.87702 6.14851 9.40613 5.21111 9.22327 4.23113C9.03471 5.18849 8.56989 6.10166 7.82865 6.8429Z"
              fill="url(#paint1_linear_1904_41193)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.47136 24.823C8.05683 25.2375 7.53877 25.4856 7 25.5674C7.53864 25.6506 8.05693 25.8998 8.47221 26.3151C8.8868 26.7297 9.13594 27.247 9.21952 27.7847C9.30171 27.2468 9.54968 26.7298 9.96354 26.316C10.3494 25.9301 10.825 25.6884 11.3235 25.5909C10.8135 25.4962 10.3255 25.2515 9.93069 24.8566C9.53574 24.4617 9.29094 23.9736 9.19637 23.4634C9.09879 23.9617 8.85715 24.4372 8.47136 24.823Z"
              fill="url(#paint2_linear_1904_41193)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1904_41193"
                x1="14.7584"
                y1="12.3491"
                x2="25.8411"
                y2="23.4318"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#01BCF5" />
                <stop offset="1" stopColor="#038DFE" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1904_41193"
                x1="7.06752"
                y1="6.20787"
                x2="11.3336"
                y2="10.474"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#01BCF5" />
                <stop offset="1" stopColor="#038DFE" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1904_41193"
                x1="8.07509"
                y1="24.4923"
                x2="10.2935"
                y2="26.7107"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#01BCF5" />
                <stop offset="1" stopColor="#038DFE" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Our students, making us proud everyday!
          </h1>
        </div>
        <p className="text-[#343434d3] font-medium pt-4 pb-7 sm:px-2">
          Let our success stories do the talking
        </p>
        <Carousel className="relative inset-0 after:absolute after:inline-block after:content-'' after:w-0 sm:after:w-28 lg:after:w-72 after:z-5 after:h-full  after:bg-gradient-to-l after:from-[#ffffff] after:to-transparent flex flex-row-reverse">
          <CarouselContent className="px-5 flex gap-6 ">
            <CarouselItem className="flex sm:flex-row flex-col-reverse gap-10 rounded-xl items-center bg-white py-8 pr-5  max-w-screen-lg">
              <div className="flex flex-col gap-2">
                <img className="w-10" src="/quotes.png.webp" alt="quote" />
                <p className="text-wrap text-sm lg:text-[1rem] text-[#292929b9] font-medium">
                  I developed an interest in HR Management and came across
                  Pathshala Trainings, the courses were affordable with great
                  content. The best part was that they provided me with a lot of
                  practical projects to work on, which landed me my first
                  internship! I&apos;ll be forever grateful to Pathshala!
                </p>
                <span className="flex">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="font-semibold text-xl">Bhakti Karekar</h3>
                <h4 className="text-md text-[#292929dd]">
                  Weligkar Institute of Management
                </h4>
              </div>
              <div>
                <img
                  className="sm:w-[700px] h-[220px] object-cover rounded"
                  src="https://trainings.internshala.com/cached_uploads/homepage/media/reviews_section/bhakti_karekar.png"
                  alt="s"
                />
              </div>
            </CarouselItem>
            <CarouselItem className="flex sm:flex-row flex-col-reverse gap-10 rounded-xl items-center bg-white py-8 pr-5  max-w-screen-lg">
              <div className="flex flex-col gap-2">
                <img className="w-10" src="/quotes.png.webp" alt="quote" />
                <p className="text-wrap text-sm lg:text-[1rem] text-[#292929b9] font-medium">
                  I developed an interest in HR Management and came across
                  Pathshala Trainings, the courses were affordable with great
                  content. The best part was that they provided me with a lot of
                  practical projects to work on, which landed me my first
                  internship! I&apos;ll be forever grateful to Pathshala!
                </p>
                <span className="flex">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99984 2.66666L9.64784 5.95793L13.3332 6.48895L10.6665 9.04941L11.2958 12.6667L7.99984 10.9579L4.70384 12.6667L5.33317 9.04941L2.6665 6.48895L6.35184 5.95793L7.99984 2.66666Z"
                      fill="#FFAE00"
                      stroke="#FFAE00"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="font-semibold text-xl">Bhakti Karekar</h3>
                <h4 className="text-md text-[#292929dd]">
                  Weligkar Institute of Management
                </h4>
              </div>
              <div>
                <img
                  className="sm:w-[700px] h-[220px] object-cover rounded"
                  src="https://trainings.internshala.com/cached_uploads/homepage/media/reviews_section/bhakti_karekar.png"
                  alt="s"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden xl:flex" />
          <CarouselNext className="hidden xl:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
