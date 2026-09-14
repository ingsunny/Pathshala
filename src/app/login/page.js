"use client";

import {
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "@/components/OAuth";
import { signInFailure, signInStart, signInSuccess } from "@/redux/user/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, sessionStatus } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (sessionStatus === "authenticated") router.replace("/dashboard");
  }, [router, sessionStatus]);

  function handleChange(event) {
    setFormData((value) => ({ ...value, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    dispatch(signInStart());

    try {
      const response = await axios.post("/api/login", formData);
      dispatch(signInSuccess(response.data.user));
      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch (error) {
      dispatch(signInFailure());
      toast.error(error.response?.data?.message || "Unable to log in");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <Link href="/" className="relative z-10 w-fit rounded-xl bg-white px-4 py-2">
          <Image src="/newLogo.png" alt="Pathshala" width={951} height={262} style={{ width: 150, height: "auto" }} priority />
        </Link>

        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200">
            <AcademicCapIcon className="h-5 w-5" /> Learn without limits
          </span>
          <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
            Continue building the career you want.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Practical lessons, visible progress, and certificates that help you move forward.
          </p>
          <div className="mt-9 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
            {["Learn at your own pace", "Track every completed lesson", "Resume exactly where you stopped", "Earn verified certificates"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-emerald-400" /> {item}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-500">© {new Date().getFullYear()} Pathshala Learning</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/" aria-label="Back home" className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <Image src="/newLogo.png" alt="Pathshala" width={951} height={262} style={{ width: 140, height: "auto" }} priority />
            <span className="w-10" />
          </div>

          <div>
            <p className="text-sm font-bold text-sky-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Sign in to keep learning</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Enter your details to return to your courses and progress.</p>
          </div>

          <div className="mt-8">
            <OAuth />
          </div>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or use email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <span className="relative block">
                <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? (
                <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in…</>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            New to Pathshala?{" "}
            <Link href="/search_courses" className="font-bold text-sky-700 hover:text-sky-900">Choose a course to get started</Link>
          </p>
        </div>
      </section>
      <Toaster position="bottom-right" toastOptions={{ duration: 2500 }} />
    </main>
  );
}
