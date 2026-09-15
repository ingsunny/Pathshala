"use client";

import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CertificateVerificationPage() {
  const [verificationId, setVerificationId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [status, setStatus] = useState("idle");
  async function submit(event) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await axios.post("/api/verifiy_certificate", {
        verificationId,
      });
      setCertificate(response.data.certificate);
      setStatus("valid");
    } catch {
      setCertificate(null);
      setStatus("invalid");
    }
  }
  return (
    <div className="min-h-screen bg-[#fbfcf8]">
      <Header />
      <main>
        <section className="border-b border-[#dfe6e1] bg-[#eef5f0]">
          <div className="northstar-shell py-16 text-center sm:py-24">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#dcece3] text-[#176b4d]">
              <CheckBadgeIcon className="h-7 w-7" />
            </span>
            <p className="northstar-eyebrow mt-6">Credential verification</p>
            <h1 className="mt-3 font-editorial text-5xl font-semibold tracking-[-.05em]">
              Verify a Northstar certificate.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#637069]">
              Enter the certificate ID exactly as it appears on the document.
            </p>
          </div>
        </section>
        <section className="northstar-shell py-14 sm:py-20">
          <div className="mx-auto max-w-xl rounded-[24px] border border-[#dfe6e1] bg-white p-6 shadow-[0_20px_60px_rgba(26,57,44,.08)] sm:p-8">
            <form onSubmit={submit}>
              <label
                className="text-sm font-bold text-[#405048]"
                htmlFor="certificate-id"
              >
                Certificate ID
              </label>
              <div className="mt-2 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#88948d]" />
                  <input
                    id="certificate-id"
                    required
                    value={verificationId}
                    onChange={(event) =>
                      setVerificationId(event.target.value.toUpperCase())
                    }
                    placeholder="XXXXXXXX-NORTHSTAR"
                    className="northstar-input pl-11 uppercase"
                  />
                </div>
                <button
                  disabled={status === "loading"}
                  className="northstar-button-primary"
                >
                  {status === "loading" ? "Checking…" : "Verify"}
                </button>
              </div>
            </form>
            {status === "invalid" && (
              <div className="mt-6 flex gap-3 rounded-2xl bg-[#fff1ef] p-4 text-[#8e3d3d]">
                <XCircleIcon className="h-6 w-6 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Certificate not found</p>
                  <p className="mt-1 text-xs">Check the ID and try again.</p>
                </div>
              </div>
            )}
            {status === "valid" && certificate && (
              <div className="mt-7 rounded-2xl border border-[#cce1d5] bg-[#f0f7f3] p-5">
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className="h-7 w-7 text-[#176b4d]" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#176b4d]">
                      Verified credential
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      {certificate.course_name}
                    </h2>
                  </div>
                </div>
                <dl className="mt-5 grid gap-4 border-t border-[#d8e8df] pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-bold text-[#7a877f]">
                      Learner
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {certificate.username}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold text-[#7a877f]">Issued</dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {new Date(
                        certificate.date_of_completion,
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
                <a
                  href={certificate.certificateDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#176b4d]"
                >
                  Open certificate{" "}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
