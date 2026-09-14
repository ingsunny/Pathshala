"use client";
import Header from "@/components/Header";
import OAuth from "@/components/OAuth";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const signIn = async () => {
      try {
        dispatch(signInStart());

        const response = await axios.post(`/api/login`, formData);

        dispatch(signInSuccess(response.data.user));
        toast.success("Login successful");
        router.push("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Unable to log in");
        dispatch(signInFailure());
      }
    };

    signIn();
  };

  return (
    <>
      <Header />
      <section className="py-20 lg:py-28 grid place-content-center px-5">
        <div className="bg-white max-w-[370px] mt-10 lg:mt-0 h-fit p-5 rounded-lg border">
          <h2 className="text-lg font-semibold pb-3">Login to your account</h2>
          <OAuth />
          <form onSubmit={handleSubmit} className="pt-4">
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
                  placeholder="john@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  title="Please enter a valid email address"
                  minLength="5"
                  maxLength="50"
                />
              </div>
              <div className="flex flex-col ">
                <label className="text-[0.95rem]" htmlFor="password">
                  Password:
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
              <a className="text-right text-sm font-semibold text-[#4195c5]">
                Forgot password?
              </a>
              {loading ? (
                <button
                  disabled
                  className="bg-[#00a5ece7] flex items-center gap-2 justify-center py-2 rounded-sm text-white "
                  type="submit"
                >
                  {" "}
                  Login Now
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
                  className="bg-[#00A5EC] hover:bg-[#008fcc] py-2 rounded-sm text-white "
                  type="submit"
                >
                  Login Now
                </button>
              )}
              <p className="text-sm text-[#222]">
                Not registered yet? Select the skill that you want to learn and
                sign up.{" "}
                <a href="/" className="font-semibold text-[#4195c5]">
                  View all trainings
                </a>
              </p>
            </fieldset>
          </form>
        </div>
      </section>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
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
