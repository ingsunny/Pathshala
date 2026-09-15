"use client";

import {
  Bars3Icon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import ExternalImage from "@/components/ExternalImage";
import { logOut } from "@/redux/user/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser, sessionStatus } = useSelector((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  async function logout() {
    await axios.get("/api/logout");
    dispatch(logOut());
    setAccountOpen(false);
    setMobileOpen(false);
    router.push("/");
  }

  const nav = [
    ["Explore courses", "/search_courses"],
    ["How it works", "/#how-it-works"],
    ["Verify certificate", "/verifiy_certificate"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe6e1]/90 bg-[#fbfcf8]/90 backdrop-blur-xl">
      <nav
        className="northstar-shell flex h-[72px] items-center"
        aria-label="Global navigation"
      >
        <BrandLogo />
        <div className="ml-12 hidden items-center gap-8 lg:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-semibold text-[#637069] transition hover:text-[#15231c]"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            href="/search_courses"
            aria-label="Search courses"
            className="mr-2 rounded-full p-2.5 text-[#637069] hover:bg-[#eaf4ee] hover:text-[#176b4d]"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Link>
          {sessionStatus === "loading" ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-[#edf1ed]" />
          ) : currentUser ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((value) => !value)}
                className="flex items-center gap-2 rounded-xl border border-[#dfe6e1] bg-white px-2 py-1.5 text-sm font-semibold text-[#26362e]"
              >
                <ExternalImage
                  src={currentUser.photoUrl || "/default-user.png"}
                  alt=""
                  className="h-7 w-7 rounded-lg object-cover"
                />
                <span className="max-w-28 truncate">
                  {currentUser.name?.split(" ")[0]}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-[#839089]" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#dfe6e1] bg-white p-2 shadow-[0_18px_50px_rgba(26,57,44,.13)]">
                  <div className="border-b border-[#edf1ed] px-3 py-2">
                    <p className="truncate text-sm font-bold text-[#15231c]">
                      {currentUser.name}
                    </p>
                    <p className="truncate text-xs text-[#7b8881]">
                      {currentUser.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[#eaf4ee]"
                  >
                    Learning dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#8e3d3d] hover:bg-[#fff1ef]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#26362e] hover:bg-[#edf3ef]"
              >
                Sign in
              </Link>
              <Link
                href="/search_courses"
                className="rounded-xl bg-[#176b4d] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#10543b]"
              >
                Start learning
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="ml-auto rounded-xl border border-[#dfe6e1] bg-white p-2.5 text-[#26362e] lg:hidden"
          aria-label="Open navigation"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 min-h-screen bg-[#fbfcf8] px-5">
          <div className="flex h-[72px] items-center justify-between">
            <BrandLogo />
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-xl border border-[#dfe6e1] bg-white p-2.5"
              aria-label="Close navigation"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-8 space-y-2">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl px-4 py-4 text-lg font-bold text-[#26362e] hover:bg-[#eaf4ee]"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-8 border-t border-[#dfe6e1] pt-6">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-[#176b4d] px-5 py-3.5 text-center text-sm font-bold text-white"
                >
                  Open dashboard
                </Link>
                <button
                  onClick={logout}
                  className="mt-3 w-full px-5 py-3 text-sm font-bold text-[#8e3d3d]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl bg-[#176b4d] px-5 py-3.5 text-center text-sm font-bold text-white"
              >
                Sign in to Northstar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
