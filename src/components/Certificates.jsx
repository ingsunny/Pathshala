"use client";

import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
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
      <p className="northstar-eyebrow">Achievements</p>
      <h1 className="mt-2 font-editorial text-4xl font-semibold tracking-[-.04em]">
        Certificates
      </h1>
      <p className="mt-3 text-sm text-[#6b7871]">
        Proof of learning you completed and assessments you passed.
      </p>
      {status === "loading" && (
        <div className="mt-8 grid animate-pulse gap-5 md:grid-cols-2">
          <div className="h-56 rounded-[22px] bg-[#e7ede9]" />
          <div className="h-56 rounded-[22px] bg-[#e7ede9]" />
        </div>
      )}
      {status === "error" && (
        <div className="mt-8 rounded-2xl border border-[#f0ccc7] bg-[#fff1ef] p-5 text-sm text-[#8e3d3d]">
          Certificates could not be loaded. Refresh and try again.
        </div>
      )}
      {status === "ready" && certificates.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article
              key={certificate._id}
              className="rounded-[22px] border border-[#dfe6e1] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e4f0e9] text-[#176b4d]">
                  <TrophyIcon className="h-6 w-6" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#edf7f1] px-3 py-1 text-xs font-bold text-[#176b4d]">
                  <CheckBadgeIcon className="h-4 w-4" />
                  Verified
                </span>
              </div>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-[.15em] text-[#859189]">
                {certificate.course_category}
              </p>
              <h2 className="mt-2 text-lg font-bold">
                {certificate.course_name}
              </h2>
              <p className="mt-2 text-sm text-[#6d7a73]">
                Completed{" "}
                {new Date(certificate.date_of_completion).toLocaleDateString(
                  undefined,
                  { day: "numeric", month: "short", year: "numeric" },
                )}
              </p>
              {certificate.assessment_score != null && (
                <p className="mt-1 text-sm font-semibold text-[#526158]">
                  Assessment: {certificate.assessment_score}%
                </p>
              )}
              <a
                href={certificate.certificateDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#176b4d]"
              >
                View certificate{" "}
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      )}
      {status === "ready" && certificates.length === 0 && (
        <div className="mt-8 rounded-[22px] border border-dashed border-[#cbd8d0] bg-white px-6 py-16 text-center">
          <TrophyIcon className="mx-auto h-10 w-10 text-[#aeb9b2]" />
          <h2 className="mt-4 font-bold">Your first certificate is waiting</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#748179]">
            Complete every lesson and pass the final assessment to earn a
            verified certificate.
          </p>
        </div>
      )}
    </section>
  );
}
