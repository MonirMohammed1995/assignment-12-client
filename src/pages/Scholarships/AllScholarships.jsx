import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const scholarshipsPerPage = 6;

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/scholarships`)
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const matched = scholarships.filter((s) =>
      s.scholarshipName?.toLowerCase().includes(lowerTerm) ||
      s.universityName?.toLowerCase().includes(lowerTerm) ||
      s.degree?.toLowerCase().includes(lowerTerm)
    );
    setFiltered(matched);
    setCurrentPage(1); // reset to page 1 on search
  }, [searchTerm, scholarships]);

  const handleClear = () => setSearchTerm("");

  // 🔢 Pagination calculations
  const indexOfLast = currentPage * scholarshipsPerPage;
  const indexOfFirst = indexOfLast - scholarshipsPerPage;
  const currentScholarships = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / scholarshipsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="px-4 md:px-10 py-10">
      <Helmet><title>All Scholarships</title></Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">🎓 All Scholarships</h2>

      {/* 🔍 Search Input */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by Name, University, or Degree"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 🗃️ Scholarships */}
      {currentScholarships.length === 0 ? (
        <div className="text-center mt-10">
          <img
            src="https://i.ibb.co/LkNsXwD/no-data.png"
            alt="No Scholarships"
            className="mx-auto w-48"
          />
          <p className="mt-4 text-xl font-semibold">No Scholarships Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentScholarships.map((scholarship) => (
            <div
              key={scholarship._id}
              className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all"
            >
              <figure>
                <img
                  src={scholarship.universityImage}
                  alt={scholarship.scholarshipName}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{scholarship.scholarshipName}</h2>
                <p>
                  <span className="font-semibold">University:</span>{" "}
                  {scholarship.universityName}
                </p>
                <p>
                  <span className="font-semibold">Degree:</span>{" "}
                  {scholarship.degree}
                </p>
                <p>
                  <span className="font-semibold">Amount:</span>{" "}
                  {scholarship.tuitionFees || "Free"}
                </p>
                <p>
                  <span className="font-semibold">Deadline:</span>{" "}
                  {scholarship.deadline || "N/A"}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link to={`/scholarships/${scholarship._id}`} className="btn btn-sm btn-accent">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔄 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
          <button onClick={prevPage} disabled={currentPage === 1} className="btn btn-sm btn-outline">
            ◀ Prev
          </button>

          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => paginate(num + 1)}
              className={`btn btn-sm ${currentPage === num + 1 ? "btn-primary" : "btn-outline"}`}
            >
              {num + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-outline"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default AllScholarships;
