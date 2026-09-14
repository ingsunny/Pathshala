"use client";

import { ArrowTopRightOnSquareIcon, TrophyIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    axios
      .get("/api/get_certificate")
      .then((response) => {
        if (active) {
          setCertificates(response.data.certificates || []);
          setStatus("ready");
        }
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <p className="text-sm font-semibold text-sky-600">Achievements</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Certificates</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your verified course completions, ready to share.
      </p>

      {status === "loading" && (
        <div className="mt-8 grid animate-pulse gap-5 md:grid-cols-2">
          <div className="h-52 rounded-3xl bg-slate-200" />
          <div className="h-52 rounded-3xl bg-slate-200" />
        </div>
      )}

      {status === "error" && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          Certificates could not be loaded. Please refresh and try again.
        </div>
      )}

      {status === "ready" && certificates.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                  <TrophyIcon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Verified
                </span>
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {certificate.course_category}
              </p>
              <h2 className="mt-2 text-lg font-bold text-slate-950">{certificate.course_name}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Completed {new Date(certificate.date_of_completion).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <a
                href={certificate.certificateDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
              >
                View certificate <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      )}

      {status === "ready" && certificates.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <TrophyIcon className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-4 font-bold text-slate-900">Your first certificate is waiting</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Complete every lesson and pass the final assessment to earn a verified certificate.
          </p>
        </div>
      )}
    </section>
  );
}
