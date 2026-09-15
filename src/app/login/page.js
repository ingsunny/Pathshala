"use client";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import BrandLogo from "@/components/BrandLogo";
import OAuth from "@/components/OAuth";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "@/redux/user/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, sessionStatus } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  useEffect(() => {
    if (sessionStatus === "authenticated") router.replace("/dashboard");
  }, [router, sessionStatus]);
  async function submit(event) {
    event.preventDefault();
    dispatch(signInStart());
    try {
      const response = await axios.post("/api/login", formData);
      dispatch(signInSuccess(response.data.user));
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (error) {
      dispatch(signInFailure());
      toast.error(error.response?.data?.message || "Unable to sign in");
    }
  }
  return (
    <main className="min-h-screen bg-[#fbfcf8] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-[#153e2f] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-28 -top-32 h-96 w-96 rounded-full border-[70px] border-white/5" />
        <BrandLogo inverse />
        <div className="relative max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[.17em] text-[#a9d3bc]">
            Your learning space
          </p>
          <h1 className="mt-6 font-editorial text-6xl font-semibold leading-[1.04] tracking-[-.05em]">
            Continue building what comes next.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#c3d5cb]">
            Return to focused lessons, visible progress, and achievements you
            genuinely earned.
          </p>
          <div className="mt-9 grid gap-4 text-sm text-[#dbe7e0] sm:grid-cols-2">
            {[
              "Resume exactly where you stopped",
              "Read every lesson summary",
              "Take course-specific assessments",
              "Keep certificates in one place",
            ].map((item) => (
              <span key={item} className="flex items-start gap-2">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#8bc2a5]" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-[#8fa99b]">
          Northstar · Clarity over noise
        </p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center justify-between lg:hidden">
            <Link
              href="/"
              aria-label="Back home"
              className="rounded-xl border border-[#dce5df] bg-white p-2.5"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <BrandLogo />
            <span className="w-10" />
          </div>
          <p className="northstar-eyebrow">Welcome back</p>
          <h2 className="mt-3 font-editorial text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
            Sign in to keep learning.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#69766f]">
            Your courses, progress, and certificates are waiting.
          </p>
          <div className="mt-8">
            <OAuth />
          </div>
          <div className="my-7 flex items-center gap-4">
            <i className="h-px flex-1 bg-[#dfe6e1]" />
            <span className="text-xs font-bold text-[#8b9690]">
              OR USE EMAIL
            </span>
            <i className="h-px flex-1 bg-[#dfe6e1]" />
          </div>
          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#415048]">
                Email address
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
                required
                placeholder="you@example.com"
                className="northstar-input"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#415048]">
                Password
              </span>
              <span className="relative block">
                <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#87938c]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData({ ...formData, password: event.target.value })
                  }
                  required
                  placeholder="Enter your password"
                  className="northstar-input pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7f8b84] hover:bg-[#edf3ef]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="northstar-button-primary w-full disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-[#6f7c75]">
            New to Northstar?{" "}
            <Link href="/search_courses" className="font-bold text-[#176b4d]">
              Choose your first course
            </Link>
          </p>
        </div>
      </section>
      <Toaster position="bottom-right" />
    </main>
  );
}
