"use client";
import { logOut, signInSuccess } from "@/redux/user/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Quiz from "react-quiz-component";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { quiz } from "./quiz";
import Header from "@/components/Header";

const COURSE_VIDEO_URL =
  "https://s3.toosio.com/t/pathshala/videoplayback.mp4";

const page = ({ params }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { currentUser } = useSelector((state) => state.user);

  const [filteredCourse, setFilteredCourse] = useState({});
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (currentUser != null) {
      const [filteredCourse] = currentUser.courses?.filter(
        (item) => item._id === params.courseId
      );

      setFilteredCourse(filteredCourse);

      if (filteredCourse.progress_status == 100) {
        router.push("/dashboard");
      }
    }
  }, [currentUser]);

  const { openSidebar } = useSelector((state) => state.user);

  const logout = async () => {
    try {
      await axios.get(`/api/logout`);

      dispatch(logOut());
      router.push("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSetTopic = (item) => {
    setTopic(item);
  };

  const handleVideoEnd = async (topicId) => {
    try {
      const response = await axios.post(`/api/course_progress/`, {
        courseId: params.courseId,
        topicId,
      });
      dispatch(signInSuccess(response.data.user));

      // Stop duplication of certificate here
    } catch (err) {
      console.log(err);
    }
  };

  const [totalTime, setTotalTime] = useState(null);
  const videoRef = useRef(null);

  const handleLoadedMetadata = () => {
    function formatTime(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      if (hours > 0) {
        return `${hours}h ${minutes < 10 ? "0" : ""}${minutes}m ${
          seconds < 10 ? "0" : ""
        }${seconds}`;
      } else {
        return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
      }
    }
    const totalTime = videoRef.current.duration;
    const formattedTime = formatTime(totalTime);
    setTotalTime(formattedTime);
  };

  //  Quiz section
  const questions = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the largest mammal?", answer: "Blue whale" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      setScore(score + 1);
    }
    setUserAnswer("");
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <>
      <Header />

      <aside
        className={`fixed  top-0 left-0 z-10 w-52 sm:w-72  border-r border-zinc-300 h-screen transition-transform lg:translate-x-0 ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pt-20  bg-white flex flex-col justify-between">
          <div className="h-[90%]  overflow-y-auto ">
            <Link
              href="/dashboard"
              className="flex items-center gap-2   text-[#35A3E3] font-semibold  rounded-lg  group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                id="bar"
                className="w-[0.8rem] h-[0.8rem]"
                fill="currentColor"
              >
                <path
                  stroke="currentColor"
                  d="M17 1h-2a1 1 0 0 0-1 1v16.992h4V2a1 1 0 0 0-1-1zm-6 6H9a1 1 0 0 0-1 1v10.992h4V8a1 1 0 0 0-1-1zm-6 6H3a1 1 0 0 0-1 1v4.992h4V14a1 1 0 0 0-1-1z"
                ></path>
              </svg>
              <span className=" text-[0.88rem] ">Visit Dashboard</span>
            </Link>

            <Accordion
              className="flex flex-col gap-3"
              type="single"
              collapsible
            >
              <h4 className="text-[0.83rem] pt-5 pb-2 font-semibold text-[#828181]">
                Module
              </h4>

              {filteredCourse.syllabus?.map((item, index) => (
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-[0.9rem] border py-2 font-semibold text-[#303030] px-2 text-left">
                    <div className="flex gap-1 items-center">
                      {item.topics.every((topic) => topic.topicProgress) ? (
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            enableBackground="new 0 0 24 24"
                            viewBox="0 0 24 24"
                            id="check-circle"
                            className="w-[1rem] h-[1rem]"
                          >
                            <path
                              fill="#30aa5f"
                              d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10C22,6.5,17.5,2,12,2z M16.2,10.3l-4.8,4.8c-0.4,0.4-1,0.4-1.4,0l0,0l-2.2-2.2c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0c0,0,0,0,0,0l1.5,1.5l4.1-4.1c0.4-0.4,1-0.4,1.4,0C16.6,9.3,16.6,9.9,16.2,10.3z"
                            ></path>
                          </svg>
                        </span>
                      ) : (
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-[0.75rem] h-[0.75rem] mt-[0.17rem] ml-[0.12rem]"
                            viewBox="0 0 22 22"
                            id="circle"
                          >
                            <g
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <g
                                stroke="#000"
                                strokeWidth="2"
                                transform="translate(-919 -1505)"
                              >
                                <g transform="translate(920 1506)">
                                  <circle cx="10" cy="10" r="10" />
                                </g>
                              </g>
                            </g>
                          </svg>
                        </span>
                      )}

                      <h4> {item.chapter}</h4>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    <h4 className="text-[0.83rem] pt-5  font-semibold text-[#828181]">
                      Topics
                    </h4>
                    <div className="flex flex-col gap-2">
                      {item.topics.map((item, index) => (
                        <div
                          className="text-[0.8rem] flex justify-between border py-2  cursor-pointer text-[#303030] px-2"
                          onClick={() => handleSetTopic(item)}
                        >
                          <div className="flex  gap-1">
                            {item.topicProgress === true ? (
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  className="w-4 h-4 mt-[0.07rem]"
                                >
                                  <path
                                    stroke="#30aa5f"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </span>
                            ) : (
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-[0.75rem] h-[0.75rem] mt-[0.17rem] ml-[0.12rem]"
                                  viewBox="0 0 22 22"
                                  id="circle"
                                >
                                  <g
                                    fill="none"
                                    fillRule="evenodd"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <g
                                      stroke="#000"
                                      strokeWidth="2"
                                      transform="translate(-919 -1505)"
                                    >
                                      <g transform="translate(920 1506)">
                                        <circle cx="10" cy="10" r="10" />
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            )}
                            <h4>{item.topicName}</h4>
                          </div>
                          {item.topicName !== topic?.topicName ? (
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 mt-[0.07rem]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </span>
                          ) : (
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-[1.1rem] h-[1.1rem]"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <h4 className="text-zinc-400 text-xs  py-2 sm:py-5">
            &copy; Copyright Pathshala 2024
          </h4>
        </div>
      </aside>

      <div className="px-4 pt-[4.2rem] pb-[4rem] lg:ml-72 relative">
        {topic ? (
          <>
            <div className="flex justify-center gap-1 py-4 sm:py-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
              <div className="flex items-center gap-1 sm:flex-row flex-col">
                <h1 className="text-sm font-medium">{topic.topicName}</h1>
                <span className="text-lg -mt-[0.6rem] sm:block hidden">.</span>
                <span className="text-xs flex text-[#363636]">
                  {" "}
                  {totalTime && <>{totalTime}</>}
                </span>
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {/* <Video
          type="video/mp4"
          className="max-w-[940px] m-auto"
          src="https://vod-progressive.akamaized.net/exp=1710769053~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2939%2F15%2F389695713%2F1646603860.mp4~hmac=0ed41aa89e31769814b75e99ca9b8d2b195b14b122ab8b4c55c3733105eefbec/vimeo-prod-skyfire-std-us/01/2939/15/389695713/1646603860.mp4?filename=file.mp4"
        /> */}
        {topic ? (
          <div className="max-w-screen-lg m-auto max-h-svh">
            <video
              key={topic._id}
              autoPlay
              controls
              onEnded={() => handleVideoEnd(topic._id)}
              ref={videoRef}
              onLoadedMetadata={handleLoadedMetadata}
              className="object-fit"
            >
              <source src={COURSE_VIDEO_URL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="w-fit m-auto">
            <Quiz quiz={quiz} timer={60} />
          </div>
        )}
      </div>
      {/* <div className="w-[99.9%] bg-white h-10 border fixed bottom-0">
        <div className="w-full flex justify-end items-center h-full px-7 gap-5">
          <button className="text-xs font-medium flex items-center hover:bg-gray-100 py-1 px-2 rounded-sm">
            <span className="text-[#35A3E3] px-1">
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
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            Prev
          </button>
          <button className="text-xs font-medium flex items-center hover:bg-gray-100 py-1 px-2 rounded-sm">
            Next
            <span className="text-[#35A3E3] px-1">
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </button>
        </div>
      </div> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(page), { ssr: false });
