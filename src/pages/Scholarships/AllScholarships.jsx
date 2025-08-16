import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { X, Search } from "lucide-react";

// Reusable Scholarship Card
const ScholarshipCard = ({ scholarship }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 flex flex-col overflow-hidden">
    <figure className="h-48 w-full overflow-hidden rounded-t-2xl">
      <img
        src={scholarship.universityImage}
        alt={scholarship.scholarshipName}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </figure>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{scholarship.scholarshipName}</h3>
      <p className="text-sm text-gray-600"><span className="font-semibold">University:</span> {scholarship.universityName}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Degree:</span> {scholarship.degree}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Amount:</span> {scholarship.tuitionFees || "Free"}</p>
      <p className="text-sm text-gray-600"><span className="font-semibold">Deadline:</span> {scholarship.deadline || "N/A"}</p>
      <div className="mt-4 flex justify-end">
        <Link
          to={`/scholarships/${scholarship._id}`}
          className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
        >
          Details
        </Link>
      </div>
    </div>
  </div>
);

// Pagination Button Component
const PaginationButton = ({ onClick, active, children, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      active
        ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
    } disabled:opacity-50`}
  >
    {children}
  </button>
);

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
    setCurrentPage(1);
  }, [searchTerm, scholarships]);

  const handleClear = () => setSearchTerm("");

  // Pagination
  const indexOfLast = currentPage * scholarshipsPerPage;
  const indexOfFirst = indexOfLast - scholarshipsPerPage;
  const currentScholarships = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / scholarshipsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="px-4 md:px-10 py-12">
      <Helmet><title>All Scholarships</title></Helmet>
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
        Explore Scholarships
      </h2>

      {/* Search Input */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Name, University, or Degree"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Scholarships Grid */}
      {currentScholarships.length === 0 ? (
        <div className="text-center mt-16">
          <img
            src="https://i.ibb.co/LkNsXwD/no-data.png"
            alt="No Scholarships"
            className="mx-auto w-52 md:w-64"
          />
          <p className="mt-6 text-xl font-semibold text-gray-600">
            No Scholarships Found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-12">
          <PaginationButton onClick={prevPage} disabled={currentPage === 1}>◀ Prev</PaginationButton>
          {[...Array(totalPages).keys()].map((num) => (
            <PaginationButton
              key={num}
              onClick={() => paginate(num + 1)}
              active={currentPage === num + 1}
            >
              {num + 1}
            </PaginationButton>
          ))}
          <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>Next ▶</PaginationButton>
        </div>
      )}
    </div>
  );
};

export default AllScholarships;
