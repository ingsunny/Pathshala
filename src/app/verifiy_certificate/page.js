"use client";
import Header from "@/components/Header";
import axios from "axios";
import React, { useState } from "react";

const CertificateVerificationPage = () => {
  const [verificationId, setVerificationId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/verifiy_certificate`, {
        verificationId,
      });

      setErr(false);
      setCertificate(response.data.certificate);
    } catch (error) {
      setErr(true);
      setCertificate(null);
    }
  };

  return (
    <>
      <Header />
      <div className="py-28 sm:py-36 sm:px-0 px-5">
        <h1 className="text-xl sm:text-2xl font-semibold text-center">
          Certificate Verification
        </h1>
        <div className="max-w-[400px] m-auto mt-10 sm:mt-16 flex border p-2 flex-col gap-3">
          <form onSubmit={handleSubmit} className="flex flex-col  gap-3">
            <input
              onChange={(e) => setVerificationId(e.target.value)}
              type="text"
              className="border px-2 mx-2 py-1 sm:px-3 sm:py-2 outline-none border-zinc-300"
            />
            <button className="uppercase mx-2 bg-[#1295c9] hover:bg-[#108bbc] text-white outline-none px-2 py-1 sm:px-3 sm:py-2 ">
              Verify
            </button>
          </form>

          {err ? (
            <>
              {" "}
              <h4 className="text-xs px-2 text-red-500">
                Certificate id. is not valid
              </h4>
            </>
          ) : (
            ""
          )}

          {certificate !== null ? (
            <>
              <h4 className="text-xs px-2 text-teal-500">
                Certificate id. is valid
              </h4>
              <div className="text-xs font-light pb-2 flex flex-col gap-1">
                <table cellPadding="8">
                  <tbody>
                    <tr className="py-2">
                      <td className="">Name:</td>
                      <td className="">{certificate?.username}</td>
                    </tr>
                    <tr className="py-2">
                      <td className="">Course Name:</td>
                      <td className="">{certificate?.course_name}</td>
                    </tr>
                    <tr className="py-2">
                      <td className="">Date of Certification:</td>
                      <td className="">
                        {certificate?.date_of_completion?.substring(0, 10)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <a
                  href={certificate?.certificateDownloadUrl}
                  className="px-2 py-2 text-blue-500 font-normal"
                >
                  Download Certificate
                </a>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default CertificateVerificationPage;
