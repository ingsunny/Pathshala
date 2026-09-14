"use client";

import React, { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { loadingState, signInSuccess } from "@/redux/user/userSlice";
import { useDispatch } from "react-redux";
import OAuth from "@/components/OAuth";
import Aside from "@/components/Aside";
import Header from "@/components/Header";

const page = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { courses } = useSelector((state) => state.courses);
  const { currentUser, loading } = useSelector((state) => state.user);

  const course = useMemo(
    () => courses?.find((item) => item._id === params.courseId),
    [courses, params.courseId]
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    couponCode: "",
    chooseObjective: "",
    chooseBatch: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const signUpAndEnroll = async (e) => {
    e.preventDefault();
    dispatch(loadingState(true));
    try {
      const signUpResponse = await axios.post(`/api/signup`, formData);

      if (signUpResponse.status === 201) {
        toast.success("Signup Successful!");

        const enrollResponse = await axios.post(`/api/enroll_course`, {
          courseId: params.courseId,
        });

        if (enrollResponse.status === 200) {
          dispatch(signInSuccess(enrollResponse.data.user));
          toast.success(`Successfully Enrolled to ${course.name} Course !`);
          router.push("/dashboard");
        }
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        couponCode: "",
        chooseObjective: "",
        chooseBatch: "",
      });
    } catch (error) {
      toast.error("Internal Error!");
      setTimeout(() => {
        router.push("/");
      }, 2500);
      if (error.response?.status === 409) {
        toast.error("An account already exists. Please log in.");
        router.push("/login");
      }
    }
    dispatch(loadingState(false));
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingState(true));
    try {
      const enrollResponse = await axios.post(`/api/enroll_course`, {
        courseId: params.courseId,
      });

      if (enrollResponse.status === 200) {
        toast.success("Successfully Enrolled!");
        dispatch(signInSuccess(enrollResponse.data.user));
        setTimeout(() => {
          router.push("/dashboard");
        }, 2500);
      }

      setFormData({
        phone: "",
        couponCode: "",
        chooseObjective: "",
        chooseBatch: "",
      });
    } catch (error) {
      if (error.response.status === 409) {
        toast.success("You have already enrolled in this Course!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2500);
      } else {
        toast.error("Internal Error!");
        router.push("/");
      }

      setFormData({
        phone: "",
        couponCode: "",
        chooseObjective: "",
        chooseBatch: "",
      });
    }

    dispatch(loadingState(false));
  };

  return (
    <>
      <Header />
      <section className="xl:pt-28 max-w-screen-xl m-auto">
        <div
          style={{ backgroundImage: `url('${course?.img2}')` }}
          className=" bg-cover bg-no-repeat  xl:rounded-xl px-5 sm:px-6 pt-28 xl:pt-8 pb-8 flex lg:flex-row flex-col lg:justify-between justify-center items-center lg:items-start"
        >
          <div className="flex flex-col gap-5 py-1 lg:gap-7 max-w-screen-md lg:w-auto">
            <div className="bg-[#FFD907] text-[#1b6b52e9] w-fit py-1 px-4 rounded-md font-bold text-[0.85rem] sm:text-[0.96rem] lg:text-lg">
              Government-certified online training
            </div>
            <h1 className="text-white text-[2rem] leading-9 sm:text-4xl lg:text-5xl font-extrabold">
              {course?.name} <br /> Course
            </h1>
            <p className="font-bold text-lg text-white md:w-[75%]">
              {course?.description}
            </p>
            <div className="font-bold text-lg text-white flex items-center gap-2">
              <img className="w-8 md:w-10" src="/speaker.png" alt="ele" />
              English, हिन्दी
            </div>
            <div className="flex flex-wrap gap-3 text-[0.94rem] lg:text-[1.1rem] md:w-[75%]">
              <span className="bg-white text-[#4c4c4c] font-semibold  px-4 py-1 rounded-full flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                Cetificate of Training
              </span>
              <span className="bg-white text-[#4c4c4c] font-semibold  px-4 py-1 rounded-full  flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                  />
                </svg>
                Placement Assistance
              </span>
              <span className="bg-white text-[#4c4c4c] font-semibold  px-4 py-1 rounded-full flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>{" "}
                {course?.duration}, 1 hr/day (flexible schedule)
              </span>
            </div>
            <div className="hidden lg:flex items-center bg-white text-[#2e2e2e] text-sm w-fit p-3 gap-2 rounded-md ">
              <img src="/offer-1-1.png" alt="offer" className="w-10" />
              <p className="pr-4">
                <span className="text-[#000]">1+1 Offer: </span>Get Internship &
                Job Preparation training FREE on
                <br /> purchase of {course?.name} training!
              </p>
            </div>
          </div>

          {/* Form  */}
          <div
            className={`bg-white max-w-[360px] mt-10 lg:mt-0 h-fit rounded-lg ${
              currentUser ? "p-0" : "p-5"
            }`}
          >
            {currentUser ? (
              <form onSubmit={handleEnrollSubmit} className="p-4">
                <fieldset className=" flex flex-col gap-3">
                  <div className="flex flex-col ">
                    <label
                      className="text-[0.95rem] font-medium text-[#303030]"
                      htmlFor="phone"
                    >
                      Mobile number
                    </label>
                    <input
                      className="border  w-[100%] text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      name="phone"
                      placeholder="+91 8737363633"
                      required
                      pattern="\+\d{1,3}\d{9,12}"
                      title="Mobile number must start with a country code followed by 9 to 12 digits."
                    />
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex flex-col  ">
                        <label className="text-[0.95rem]" htmlFor="couponCode">
                          Coupon code
                        </label>
                        <input
                          className="border w-full text-[0.92rem] font-medium text-[#303030] outline-none px-3 py-1 rounded-sm "
                          type="text"
                          id="couponCode"
                          name="couponCode"
                          placeholder="CS5510"
                        />
                      </div>
                      <div className="flex flex-col  w-full">
                        <label className="text-[0.95rem]" htmlFor="chooseBatch">
                          Choose batch
                        </label>

                        <select
                          id="chooseBatch"
                          name="chooseBatch"
                          className="border w-full text-[0.92rem] bg-white outline-none px-3 py-2 rounded-sm  text-[#303030]"
                        >
                          <option value="">Choose a date</option>
                          {[0, 1, 2].map((offset) => {
                            const date = new Date();
                            date.setDate(date.getDate() + offset);
                            const formattedDate = `${date.getDate()} ${date.toLocaleString(
                              "default",
                              { month: "short" }
                            )}, ${date.getFullYear()}`;
                            return (
                              <option key={formattedDate} value={formattedDate}>
                                {formattedDate}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <p className="text-teal-500 text-[11.8px] font-medium py-1">
                      You saved an additional 150/-
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <label
                      className="text-[0.95rem] font-medium text-[#303030]"
                      htmlFor="phone"
                    >
                      I want to learn {course?.name}
                    </label>

                    <select
                      id="chooseBatch"
                      name="chooseBatch"
                      className="border w-full text-[0.92rem] bg-white outline-none px-3 py-2 h-full rounded-sm  text-[#303030]"
                    >
                      <option value="">Choose your objective</option>
                      <option value="gain_skill">Gain a new skill</option>
                      <option value="improve_career">
                        Improve career prospects
                      </option>
                      <option value="personal_interest">
                        Pursue a personal interest
                      </option>
                    </select>
                  </div>
                  <div className="flex  gap-3 items-center">
                    <span className="text-[#FF7A00] text-md sm:text-lg font-semibold">
                      ₹ 1349
                    </span>
                    <p className="line-through font-normal text-xs sm:text-sm text-[#303030]">
                      ₹ 4499
                    </p>
                    <p className="font-normal text-xs sm:text-sm text-[#303030]">
                      Valid till {new Date().getDate()}{" "}
                      {new Date().toLocaleString("default", {
                        month: "short",
                      })}
                    </p>
                  </div>
                  {loading ? (
                    <button
                      disabled
                      className="bg-[#008fcc]  flex items-center gap-2 justify-center py-2 rounded-sm text-white "
                    >
                      {" "}
                      Enroll Now
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        id="loading"
                        className="w-6 h-6 animate-spin "
                      >
                        <circle
                          cx="17.8"
                          cy="6.2"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".9"
                        ></circle>
                        <circle
                          cx="12"
                          cy="4"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".8"
                        ></circle>
                        <circle
                          cx="6.2"
                          cy="6.2"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".7"
                        ></circle>
                        <circle
                          cx="4"
                          cy="12"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".6"
                        ></circle>
                        <circle
                          cx="6.2"
                          cy="17.6"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".5"
                        ></circle>
                        <circle
                          cx="12"
                          cy="20"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".4"
                        ></circle>
                        <circle
                          cx="17.8"
                          cy="17.6"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".3"
                        ></circle>
                        <circle
                          cx="20"
                          cy="12"
                          r="2"
                          fill="#ffffff"
                          fill-opacity=".2"
                        ></circle>
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="bg-[#00A5EC] hover:bg-[#008fcc] py-2 transition-colors duration-200 rounded-sm text-white "
                      type="submit"
                    >
                      Enroll Now
                    </button>
                  )}
                </fieldset>
              </form>
            ) : (
              <>
                <OAuth />

                <form onSubmit={signUpAndEnroll} className="pt-4">
                  <fieldset className="border-t py-3 flex flex-col gap-3">
                    <legend className="text-center  text-[#676767] text-[0.78rem]">
                      OR
                    </legend>
                    <div className="flex flex-col ">
                      <label className="text-[0.95rem]" htmlFor="email">
                        Email Id:
                      </label>
                      <input
                        className="border  w-[100%] text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@gmail.com"
                        required
                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                        title="Please enter a valid email address"
                        minLength="5"
                        maxLength="50"
                      />
                    </div>
                    <div className="flex flex-col ">
                      <label className="text-[0.95rem]" htmlFor="password">
                        Create Password:
                      </label>
                      <input
                        className="border  w-[100%] text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Must be at least 6 characters"
                        required
                        minLength="8"
                        maxLength="50"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                        title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character."
                      />
                    </div>
                    <div className="flex flex-row gap-3">
                      <div className="flex flex-col">
                        <label className="text-[0.95rem]" htmlFor="firstName">
                          First Name
                        </label>
                        <input
                          className="border w-[100%] text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[0.95rem]" htmlFor="lastName">
                          Last Name
                        </label>
                        <input
                          className="border w-[100%]  text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          name="lastName"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col ">
                      <label className="text-[0.95rem]" htmlFor="phone">
                        Mobile number
                      </label>
                      <input
                        className="border  w-[100%] text-[0.92rem] outline-none px-3 py-1 rounded-sm text-gray-500"
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        name="phone"
                        placeholder="+91 8737363633"
                        required
                        pattern="\+\d{1,3}\d{9,12}"
                        title="Mobile number must start with a country code followed by 9 to 12 digits."
                      />
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex flex-col  ">
                          <label
                            className="text-[0.95rem]"
                            htmlFor="couponCode"
                          >
                            Coupon code
                          </label>
                          <input
                            className="border w-full text-[0.92rem] font-medium text-[#303030] outline-none px-3 py-1 rounded-sm "
                            type="text"
                            value={formData.couponCode}
                            onChange={handleChange}
                            id="couponCode"
                            name="couponCode"
                            placeholder="CS5510"
                          />
                        </div>
                        <div className="flex flex-col  w-full">
                          <label
                            className="text-[0.95rem]"
                            htmlFor="chooseBatch"
                          >
                            Choose batch
                          </label>

                          <select
                            id="chooseBatch"
                            name="chooseBatch"
                            value={formData.chooseBatch}
                            onChange={handleChange}
                            className="border w-full text-[0.92rem] bg-white outline-none px-3 py-2 rounded-sm  text-[#303030]"
                          >
                            <option value="">Choose a date</option>
                            {[0, 1, 2].map((offset) => {
                              const date = new Date();
                              date.setDate(date.getDate() + offset);
                              const formattedDate = `${date.getDate()} ${date.toLocaleString(
                                "default",
                                { month: "short" }
                              )}, ${date.getFullYear()}`;
                              return (
                                <option
                                  key={formattedDate}
                                  value={formattedDate}
                                >
                                  {formattedDate}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <p className="text-teal-500 text-[11.8px] font-medium py-1">
                        You saved an additional 150/-
                      </p>
                    </div>
                    <div className="flex flex-col ">
                      <label
                        className="text-[0.95rem] font-medium text-[#303030]"
                        htmlFor="phone"
                      >
                        I want to learn {course?.name}
                      </label>

                      <select
                        id="chooseObjective"
                        name="chooseObjective"
                        value={formData.chooseObjective}
                        onChange={handleChange}
                        className="border w-full text-[0.92rem] bg-white outline-none px-3 py-2 h-full rounded-sm  text-[#303030]"
                      >
                        <option value="">Choose your objective</option>
                        <option value="gain_skill">Gain a new skill</option>
                        <option value="improve_career">
                          Improve career prospects
                        </option>
                        <option value="personal_interest">
                          Pursue a personal interest
                        </option>
                      </select>
                    </div>
                    <div className="flex  gap-3 items-center">
                      <span className="text-[#FF7A00] text-md sm:text-lg font-semibold">
                        ₹ 1349
                      </span>
                      <p className="line-through font-normal text-xs sm:text-sm text-[#303030]">
                        ₹ 4499
                      </p>
                      <p className="font-normal text-xs sm:text-sm text-[#303030]">
                        Valid till {new Date().getDate()}{" "}
                        {new Date().toLocaleString("default", {
                          month: "short",
                        })}
                      </p>
                    </div>
                    {loading ? (
                      <button
                        disabled
                        className="bg-[#008fcc] flex items-center gap-2 justify-center py-2 rounded-sm text-white "
                      >
                        {" "}
                        Enroll Now
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          id="loading"
                          className="w-6 h-6 animate-spin "
                        >
                          <circle
                            cx="17.8"
                            cy="6.2"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".9"
                          ></circle>
                          <circle
                            cx="12"
                            cy="4"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".8"
                          ></circle>
                          <circle
                            cx="6.2"
                            cy="6.2"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".7"
                          ></circle>
                          <circle
                            cx="4"
                            cy="12"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".6"
                          ></circle>
                          <circle
                            cx="6.2"
                            cy="17.6"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".5"
                          ></circle>
                          <circle
                            cx="12"
                            cy="20"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".4"
                          ></circle>
                          <circle
                            cx="17.8"
                            cy="17.6"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".3"
                          ></circle>
                          <circle
                            cx="20"
                            cy="12"
                            r="2"
                            fill="#ffffff"
                            fill-opacity=".2"
                          ></circle>
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="bg-[#00A5EC] hover:bg-[#008fcc] py-2 transition-colors duration-200 rounded-sm text-white "
                        type="submit"
                      >
                        Enroll Now
                      </button>
                    )}
                  </fieldset>
                </form>
              </>
            )}
          </div>
        </div>
        {/* course highlight */}
        <div className="py-10">
          <h1 className="text-3xl font-bold text-center py-12">
            Course Highlights
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-10 gap-12">
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Learn online
                </h3>
                <p className="text-[#232323]">At your own schedule</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Mobile friendly
                </h3>
                <p className="text-[#232323]">No laptop? No problem</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Certificate of training
                </h3>
                <p className="text-[#232323]">from Pathshala Trainings</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Placement assistance
                </h3>
                <p className="text-[#232323]">To build your career</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Beginner friendly
                </h3>
                <p className="text-[#232323]">No prior knowledge required</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  {course?.duration} duration
                </h3>
                <p className="text-[#232323]">1 hr/day (flexible schedule)</p>
              </span>
            </div>
          </div>
        </div>
        {/* why learn  */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14 px-10 pt-7">
          <div className="">
            <h1 className="text-[1.8rem] font-bold pt-7 pb-5">
              Why Learn {course?.name}?
            </h1>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Build awesome websites
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                Mark Zuckerberg built Facebook. Sachin Bansal built Flipkart.
                What will you build?
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Be in demand
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                With 1.7 billion websites on the internet, it is one of the
                hottest career options with an average fresher salary of 6
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Eat-Sleep-Code-Repeat
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                Be it rain or sunshine, coding is always on your mind.
              </p>
            </div>
          </div>
          <div className="">
            <h1 className="text-[1.8rem] font-bold pt-7 pb-5">
              Placement assistance you&apos;ll receive?
            </h1>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Free Placement Prep Training
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                Learn how to build your resume, make great applications, and ace
                your interviews.
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Curated internships & jobs
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                Get internships and fresher jobs as per your preference in your
                inbox.
              </p>
            </div>
            <div className="py-2">
              <h3 className="text-lg text-[#232323] font-semibold ">
                Get highlighted on Internshala
              </h3>
              <p className="text-[1.1rem] text-[#444444]">
                Top performers will be highlighted in their internship &
              </p>
            </div>
          </div>
        </div>
        {/* course highlight */}
        <div className="py-10">
          <h1 className="text-3xl font-bold text-center py-12">
            How will your training work?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-10 gap-12">
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Learn online
                </h3>
                <p className="text-[#232323]">At your own schedule</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Mobile friendly
                </h3>
                <p className="text-[#232323]">No laptop? No problem</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Certificate of training
                </h3>
                <p className="text-[#232323]">from Pathshala Trainings</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Placement assistance
                </h3>
                <p className="text-[#232323]">To build your career</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  Beginner friendly
                </h3>
                <p className="text-[#232323]">No prior knowledge required</p>
              </span>
            </div>
            <div className="flex gap-5 items-center">
              <img
                className="w-14"
                src="/video_tutorials.png.webp"
                alt="video_tut"
              />
              <span>
                <h3 className="text-lg text-[#232323] font-semibold ">
                  8 weeks duration
                </h3>
                <p className="text-[#232323]">1 hr/day (flexible schedule)</p>
              </span>
            </div>
          </div>
        </div>

        <div className="px-5">
          <div className="flex flex-col gap-4 py-10 ">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              {course?.name} Training Syllabus
            </h1>
            <h2 className="text-md sm:text-lg text-[#2f2e2e] font-semibold text-center">
              After completing the training, you can also download videos for
              future reference
            </h2>
          </div>
          <Accordion
            className="pb-10 max-w-screen-sm m-auto "
            type="single"
            collapsible
          >
            {course?.syllabus?.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-slate-200 px-3 "
              >
                <AccordionTrigger className="text-lg sm:text-xl text-left">
                  {item.chapter}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc px-5 text-[0.96rem] sm:text-[1.1rem] flex flex-col gap-3">
                    {item.topics.map((item, index) => (
                      <li key={index}>
                        {index === 0 ? (
                          <a className="text-blue-700" href="#">
                            {item.topicName}
                          </a>
                        ) : (
                          item.topicName
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <Footer />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2400,
          style: {
            background: "#404040",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default page;
