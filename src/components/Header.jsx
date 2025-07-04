"use client";

import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logOut } from "@/redux/user/userSlice";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.user);

  const { courses } = useSelector((state) => state.courses);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Logout
  const logout = async () => {
    try {
      await axios.get(`/api/logout`);

      router.push("/");
      dispatch(logOut());
      setMobileMenuOpen(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <header className="bg-white shadow-[0px_0.4px_8px_0px_#00000024] fixed w-full z-20">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8"
      >
        <div className="flex lg:flex-1 ">
          <Link href="/" className="-m-1.5 p-1.5">
            <img
              alt="desktop_logo"
              src="/newLogo.png"
              className="h-14 hidden lg:block w-auto"
            />
            <img
              alt="mobile_logo"
              src="/newLogo.png"
              className="h-[2.85rem] lg:hidden w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <div className="text-[#333] px-4 py-1 lg:py-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-2 text-[16px] font-medium text-[#333]">
              Certification courses
              <p className="text-[11px] font-semibold py-[2px] px-[6px] rounded bg-[#FFA333] text-white">
                OFFER
              </p>
              <ChevronDownIcon
                aria-hidden="true"
                className="h-7 w-7 flex-none text-[#333333d7]"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 border-t-2 mt-6 border-[#008bdc] top-full z-10 w-screen max-w-xs overflow-hidden rounded- bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-2">
                <h3 className="text-lg font-semibold px-4 py-2">
                  Most Popular
                </h3>

                {courses
                  ?.slice()
                  .reverse()
                  .map((item, index) => (
                    <Link
                      key={index}
                      href={`/categories/${item._id}`}
                      className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            </PopoverPanel>
          </Popover>
          <div className="text-[16px] font-medium text-[#333]">
            Placement Guarantee courses
          </div>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {currentUser ? (
            <div className="flex flex-row gap-5 items-center">
              <div className="text-[#333] ">
                <input
                  type="text"
                  placeholder="Search..."
                  className="lg:w-32 xl:w-40 border px-4 py-1 rounded-sm focus:border-[#0090DF] text-[#35A3E3] outline-none ease-in-out delay-100 transition-colors duration-200 sm:block hidden"
                />
              </div>
              {/* Profile dropdown  */}
              <Popover className="relative">
                <PopoverButton className="flex flex-row items-center">
                  <img
                    className={`w-7 h-7 rounded-full`}
                    height="100"
                    width="100"
                    src={currentUser?.photoUrl}
                    alt="profile"
                  />
                </PopoverButton>
                <PopoverPanel
                  transition
                  className="absolute md:right-0 lg:-right-7 top-full z-10 border-t-2 mt-6 border-[#008bdc] w-62 overflow-hidden  bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-3 px-2 text-sm/6 flex flex-col gap-2">
                    <div>
                      <h3 className="text-sm font-semibold px-2">
                        Sunny Patel
                      </h3>
                      <p className=" font-light text-gray-600  px-2 ">
                        sunnypatel.koder@gmail.com
                      </p>
                    </div>
                    <div>
                      <Link
                        href={"/dashboard"}
                        className="flex items-center gap-2 text-sm px-2 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <DashboardIcon /> Dashboard
                      </Link>
                      <div
                        onClick={logout}
                        className="flex items-center gap-2 text-sm px-2 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        <ArrowLeftIcon /> Logout
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Popover>
            </div>
          ) : (
            <>
              <Link
                href="/search_courses"
                className="text-[#333] px-4 py-1 lg:py-2 "
              >
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
              </Link>
              <Link
                href="/login"
                className="border px-4 py-1 lg:py-2 font-medium rounded-sm border-[#0090DF] text-[#35A3E3] hover:bg-[#35A3E3] hover:text-white ease-in-out delay-100 transition-colors duration-200 sm:block hidden"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      > */}
      {/* <div className="fixed inset-0 z-10" /> */}
      <div
        className={`lg:hidden fixed inset-y-0 -right-0 z-10 w-full overflow-y-auto bg-white  sm:ring-1 sm:ring-gray-900/10 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between  px-6 py-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-1.5 p-1.5"
          >
            <img
              alt="sidebar_logo"
              src="/newLogo.png"
              className="h-[2.85rem] w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className=" flow-root ">
          {/* if logged in  */}
          {currentUser && (
            <>
              <div className="flex items-center gap-3 py-6 px-5 border-y">
                <img
                  className={`w-10 h-10 rounded-full`}
                  height="100"
                  width="100"
                  src={currentUser?.photoUrl}
                  alt=""
                />
                <div className="flex flex-col gap-1 tracking-wide">
                  <h3 className="text-[0.82rem] font-semibold text-[#484848] v">
                    {currentUser?.name}
                  </h3>
                  <p className="text-[0.7rem] font-medium  text-[#585858] ">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
              <hr className="border-4 border-[#f8f8f8]" />
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-t px-5"
              >
                <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
                  {" "}
                  Go to Dashboard
                </h3>
                <ChevronRightIcon aria-hidden="true" className="h-4 w-5" />{" "}
              </Link>
              <div className="flex items-center justify-between border-y px-5">
                <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
                  {" "}
                  Refer & Earn
                </h3>
                <ChevronRightIcon aria-hidden="true" className="h-4 w-5" />{" "}
              </div>
              <hr className="border-4 border-[#f8f8f8]" />
            </>
          )}

          {/* ---------- */}

          <Disclosure as="div" className="">
            <DisclosureButton className="group flex w-full items-center justify-between px-5 border-t">
              <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
                {" "}
                Certification courses
              </h3>
              <ChevronDownIcon
                aria-hidden="true"
                className="h-5 w-5 flex-none group-data-[open]:rotate-180"
              />
            </DisclosureButton>
            <DisclosurePanel className="px-5">
              {courses?.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={`/categories/${item._id}`}
                  className="block tracking-wide  border-[#dfdcdc6c]  py-4 px-5  text-[0.8rem] font-medium text-[#5e5e5e]  hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {"- "}
                  {item.name}
                </DisclosureButton>
              ))}
            </DisclosurePanel>
          </Disclosure>
          <h3 className=" text-[0.8rem] font-semibold text-[#5e5e5e] tracking-wide border-y py-5 px-5 ">
            Placement Guarantee courses
          </h3>

          <hr className="border-4 border-[#f8f8f8]" />

          {currentUser ? (
            <div
              onClick={logout}
              className="flex items-center justify-between border-t px-5"
            >
              <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
                {" "}
                Logout
              </h3>
              <ChevronRightIcon aria-hidden="true" className="h-4 w-5" />{" "}
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-t px-5"
            >
              <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
                {" "}
                Login
              </h3>
              <ChevronRightIcon aria-hidden="true" className="h-4 w-5" />{" "}
            </Link>
          )}

          <div className="flex items-center justify-between border-y px-5">
            <h3 className="tracking-wide  py-5  text-[0.8rem] font-semibold text-[#5e5e5e]">
              {" "}
              Help Center
            </h3>
            <ChevronRightIcon aria-hidden="true" className="h-4 w-5" />{" "}
          </div>
        </div>
      </div>
      {/* </Dialog> */}
    </header>
  );
};

export default dynamic(() => Promise.resolve(Header), { ssr: false });
