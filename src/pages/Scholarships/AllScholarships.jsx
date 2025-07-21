import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    fetch(`${api}/scholarships`)
      .then((res) => res.json())
      .then((data) => {
        setScholarships(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFiltered(scholarships);
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const matched = scholarships.filter((s) =>
      s.scholarshipName?.toLowerCase().includes(lowerTerm) ||
      s.universityName?.toLowerCase().includes(lowerTerm) ||
      s.degree?.toLowerCase().includes(lowerTerm)
    );

    setFiltered(matched);
  };

  return (
    <div className="px-4 md:px-10 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">🎓 All Scholarships</h2>

      {/* 🔍 Search */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by Name, University, or Degree"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* 🗃️ Scholarship Cards */}
      {filtered.length === 0 ? (
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
          {filtered.map((scholarship) => (
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
                  <Link
                    to={`/scholarship-details/${scholarship._id}`} // ✅ Correct route
                    className="btn btn-sm btn-accent"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllScholarships;
