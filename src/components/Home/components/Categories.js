"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Categories = ({ loadingSkeleton }) => {
  const { courses } = useSelector((state) => state.courses);

  const allCourses = courses;

  const uniqueCategories = [
    ...new Set(allCourses?.map((item) => item.category)),
  ];

  const [selectedFilter, setSelectedFilter] = useState("All Courses");

  const handleFilter = (event) => {
    const selectedValue = event.target.value || event.target.innerText;
    setSelectedFilter(selectedValue);
  };

  const filteredItems = useMemo(() => {
    if (selectedFilter === "All Courses") {
      return allCourses;
    } else {
      return allCourses.filter((item) => item.category === selectedFilter);
    }
  }, [selectedFilter, allCourses]);

  // know more button
  const [clickedIndex, setClickedIndex] = useState(null);

  return (
    <section className="pb-20">
      <div className="max-w-screen-xl m-auto px-5 xl:px-0">
        <h1 className="text-xl text-[#1d1d1d] sm:text-2xl lg:text-3xl font-bold ">
          Categories
        </h1>

        <select
          onChange={handleFilter}
          value={selectedFilter}
          className="block xl:hidden bg-[#a07bff] text-white rounded w-52 px-3 py-2 outline-none border-none my-10"
        >
          <option value="All Courses">All Courses</option>
          {uniqueCategories.map((category, index) => (
            <option value={category} key={index}>
              {category}
            </option>
          ))}
        </select>

        <ul className="hidden xl:flex gap-4 py-6">
          <li
            onClick={handleFilter}
            className={` rounded-md py-2 px-2 cursor-pointer ${
              selectedFilter === "All Courses"
                ? "bg-[#35a3e3] text-white"
                : "bg-[#F3F8FF] text-black"
            }`}
          >
            All Courses
          </li>

          {uniqueCategories.map((category, index) => (
            <li
              key={index}
              onClick={handleFilter}
              className={`rounded-md py-2 px-2 cursor-pointer ${
                selectedFilter === category
                  ? "bg-[#35a3e3] text-white"
                  : "bg-[#F3F8FF] text-black"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
        <div className="flex gap-10 flex-wrap ">
          {filteredItems?.map((item) => (
            <Link key={item._id} href={`/categories/${item._id}`}>
              <div className="bg-white rounded-xl overflow-hidden transition-all duration-100 shadow-[rgba(13,_38,_76,_0.13)_0px_9px_20px] hover:shadow-[rgba(13,_38,_76,_0.18)_0px_9px_20px]">
                <img
                  className="w-[300px] h-[130px] object-cover"
                  src={item.img1}
                  alt={item.category}
                />
                <div className="px-4 pt-2 pb-6">
                  <div className="flex items-center gap-2 py-1">
                    <h4 className="text-[13px] text-[#4c4c4c] font-medium">
                      {item.duration}
                    </h4>
                    <Image
                      height={10}
                      width={60}
                      className="h-auto w-auto mt-[0.15rem] object-cover"
                      src="/language-card.png"
                      alt="language-taught"
                    />
                  </div>
                  <h2 className="text-[1.2rem] pt-2 pb-3 font-semibold">
                    {item.name}
                  </h2>
                  <div className="flex gap-2">
                    <span className="flex text-[14px] text-[#4c4c4c] font-medium items-center">
                      <svg
                        width="16"
                        height="16"
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
                      <span>4.1</span>
                    </span>
                    <span className="text-[14px] border-l border-[#9a9a9a] pl-2 text-[#4c4c4c]  font-medium">
                      109,125 learners
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setClickedIndex(item._id)}
                  className={`bg-[#F3F8FF] outline-none ${
                    clickedIndex === item._id ? "animate-pulse" : ""
                  }  w-full flex text-left px-4 text-[#1D98E0] font-semibold text-[1rem] py-3`}
                >
                  Know more{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enableBackground="new 0 0 24 24"
                    viewBox="0 0 24 24"
                    id="angle-double-right"
                    className="w-7 h-7 -mt-[0.088rem]"
                  >
                    <path
                      fill="currentColor"
                      d="M8.5,8.3c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4L9.3,12L7,14.3c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l3-3c0,0,0,0,0,0c0.4-0.4,0.4-1,0-1.4L8.5,8.3z M17,11.3l-3-3c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4l2.3,2.3l-2.3,2.3c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l3-3C17.3,12.3,17.3,11.7,17,11.3z"
                    ></path>
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
