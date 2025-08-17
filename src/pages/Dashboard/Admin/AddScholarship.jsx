import { useContext, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../context/AuthProvider";
import { uploadImageToImgbb } from "../../../utils/uploadImageToImgbb";

const AddScholarship = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");

  const handleImageUpload = async () => {
    if (!imageFile) return Swal.fire("⚠️ No image selected");
    setLoading(true);
    try {
      const url = await uploadImageToImgbb(imageFile);
      setImageURL(url);
      Swal.fire("✅ Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!imageURL) {
      return Swal.fire("❗ Please upload an image first");
    }

    const subjectCategory = form.subjectCategory.value;
    const scholarshipCategory = form.scholarshipCategory.value;
    const degree = form.degree.value;

    if (
      subjectCategory === "default" ||
      scholarshipCategory === "default" ||
      degree === "default"
    ) {
      return Swal.fire("⚠️ Please select all dropdown values properly");
    }

    const scholarship = {
      scholarshipName: form.scholarshipName.value,
      universityName: form.universityName.value,
      universityImage: imageURL,
      universityCountry: form.universityCountry.value,
      universityCity: form.universityCity.value,
      worldRank: form.worldRank.value,
      subjectCategory,
      scholarshipCategory,
      degree,
      tuitionFees: form.tuitionFees.value || "N/A",
      applicationFees: form.applicationFees.value,
      serviceCharge: form.serviceCharge.value,
      deadline: form.deadline.value,
      postDate: new Date().toISOString(),
      email: user?.email || "unknown",
    };

    try {
      const api = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${api}/scholarships`, scholarship);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("🎉 Scholarship added successfully!");
        form.reset();
        setImageFile(null);
        setImageURL("");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Failed to add scholarship");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Add Scholarship
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Text Inputs */}
        {[
          { name: "scholarshipName", placeholder: "Scholarship Name" },
          { name: "universityName", placeholder: "University Name" },
          { name: "universityCountry", placeholder: "Country" },
          { name: "universityCity", placeholder: "City" },
          { name: "worldRank", placeholder: "World Rank" },
          { name: "tuitionFees", placeholder: "Tuition Fees (optional)" },
          { name: "applicationFees", placeholder: "Application Fees" },
          { name: "serviceCharge", placeholder: "Service Charge" },
        ].map((input) => (
          <input
            key={input.name}
            name={input.name}
            placeholder={input.placeholder}
            required={input.name !== "tuitionFees"}
            className="input input-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl shadow-sm placeholder-gray-400 border-none"
          />
        ))}

        {/* Degree / Category Dropdowns */}
        <select
          name="subjectCategory"
          required
          defaultValue="default"
          className="select select-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl shadow-sm border-none"
        >
          <option value="default" disabled>
            Select Subject Category
          </option>
          <option>Agriculture</option>
          <option>Engineering</option>
          <option>Doctor</option>
        </select>

        <select
          name="scholarshipCategory"
          required
          defaultValue="default"
          className="select select-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl shadow-sm border-none"
        >
          <option value="default" disabled>
            Select Scholarship Type
          </option>
          <option>Full fund</option>
          <option>Partial</option>
          <option>Self-fund</option>
        </select>

        <select
          name="degree"
          required
          defaultValue="default"
          className="select select-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl shadow-sm border-none"
        >
          <option value="default" disabled>
            Select Degree
          </option>
          <option>Diploma</option>
          <option>Bachelor</option>
          <option>Masters</option>
        </select>

        {/* Deadline */}
        <input
          type="date"
          name="deadline"
          required
          className="input input-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl shadow-sm border-none"
        />

        {/* Image Upload */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={loading}
            className="btn btn-info w-full rounded-xl shadow-md hover:shadow-lg transition"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
          {imageURL && (
            <img
              src={imageURL}
              alt="Preview"
              className="w-32 mt-2 rounded-xl shadow-md border border-gray-200"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn btn-success w-full py-3 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Add Scholarship
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;
