"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const { courses } = useSelector((state) => state.courses);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [filteredCourses, setFilteredCourses] = useState([]);

  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(keyword) ||
        course.category.toLowerCase().includes(keyword)
    );
    setFilteredCourses(filtered);
  };

  return (
    <div className="max-w-screen-md px-3 m-auto flex flex-col gap-5 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-md font-semibold">
          I am looking for online training in
        </h1>
        <Link href="/" className="text-md ">
          x
        </Link>
      </div>

      <div className="flex items-center">
        <input
          className="border-2 border-gray-100 p-[0.54rem] w-full text-sm outline-none"
          placeholder="Search trainings here"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="bg-[#00a5ec] text-white p-2" onClick={handleSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      <h3 className="text-md font-light">
        {filteredCourses.length > 0
          ? `Results (${filteredCourses.length})`
          : "Most Popular"}
      </h3>
      <div className="flex flex-row gap-5 flex-wrap">
        {(filteredCourses.length > 0 ? filteredCourses : courses).map(
          (course) => (
            <Link
              href={`/categories/${course._id}`}
              key={course._id}
              className="border-2 border-gray-200 rounded-2xl p-2 text-sm cursor-pointer"
            >
              {course.name}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Page;
