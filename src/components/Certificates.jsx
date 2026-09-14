import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Certificates = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const handleCertificate = async () => {
      try {
        const response = await axios.get(`/api/get_certificate/`);
        setCertificates(response.data.certificates);
      } catch (err) {
        console.log(err);
      }
    };

    handleCertificate();
  }, [currentUser?._id]);

  return (
    <div className="pb-6 pt-5 md:pb-6 md:pt-6">
      <h1 className="text-[1.3rem] sm:text-2xl font-bold text-[#494949]">
        Certificates
      </h1>

      <div className="relative overflow-x-auto shadow-md  mt-10  z-10">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Enrolled Courses
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Completion
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                View Certificate
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates?.map((item, index) => (
              <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.course_name}
                </th>
                <td className="px-6 py-4">{item.course_category}</td>
                <td className="px-6 py-4">
                  {item.date_of_completion.substring(0, 10)}
                </td>
                <td className="px-6 py-4 text-green-500">Completed</td>
                <td className="px-6 py-4 text-blue-500">
                  <Link href={item.certificateDownloadUrl}>Link</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {certificates.length == 0 && (
        <>
          {" "}
          <div className="pt-10">
            <hr />
            <h1 className="py-20 text-center">No certificate Available</h1>
            <hr />
          </div>
        </>
      )}
    </div>
  );
};

export default Certificates;
