import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthProvider';
import { uploadImageToImgbb } from '../../../utils/uploadImageToImgbb';

const AddScholarships = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const handleImageUpload = async () => {
    if (!imageFile) return Swal.fire('⚠️ No image selected');

    setLoading(true);
    try {
      const url = await uploadImageToImgbb(imageFile);
      setImageURL(url);
      Swal.fire('✅ Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!imageURL) return Swal.fire('❗ Please upload an image first');

    const scholarship = {
      scholarshipName: form.scholarshipName.value.trim(),
      universityName: form.universityName.value.trim(),
      universityImage: imageURL,
      universityCountry: form.universityCountry.value.trim(),
      universityCity: form.universityCity.value.trim(),
      worldRank: form.worldRank.value.trim(),
      subjectCategory: form.subjectCategory.value,
      scholarshipCategory: form.scholarshipCategory.value,
      degree: form.degree.value,
      tuitionFees: form.tuitionFees.value.trim() || 'N/A',
      applicationFees: form.applicationFees.value.trim(),
      serviceCharge: form.serviceCharge.value.trim(),
      deadline: form.deadline.value,
      postDate: new Date().toISOString(),
      email: user?.email || 'unknown',
    };

    // Validate required selects
    if ([scholarship.subjectCategory, scholarship.scholarshipCategory, scholarship.degree].includes('default')) {
      return Swal.fire('⚠️ Please select all dropdown values properly');
    }

    // Validate required inputs
    if (!scholarship.scholarshipName || !scholarship.universityName || !scholarship.universityCountry ||
        !scholarship.universityCity || !scholarship.worldRank || !scholarship.applicationFees ||
        !scholarship.serviceCharge || !scholarship.deadline) {
      return Swal.fire('⚠️ Please fill in all required fields');
    }

    try {
      const api = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${api}/scholarships`, scholarship);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire('🎉 Scholarship added successfully!');
        form.reset();
        setImageFile(null);
        setImageURL('');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('❌ Failed to add scholarship');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl mt-10 transition-all">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Add Scholarship</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input name="scholarshipName" placeholder="Scholarship Name" required
               className="input input-bordered w-full focus:ring-2 focus:ring-indigo-500 transition" />
        <input name="universityName" placeholder="University Name" required
               className="input input-bordered w-full focus:ring-2 focus:ring-indigo-500 transition" />

        {/* Image Upload Section */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                 className="file-input w-full" required />
          <button type="button" onClick={handleImageUpload} disabled={loading}
                  className="btn btn-info w-40 mt-2 hover:scale-105 transition-transform">
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          {imageURL && <img src={imageURL} alt="Preview" className="w-40 mt-2 rounded-lg shadow-md" />}
        </div>

        <input name="universityCountry" placeholder="Country" required className="input input-bordered w-full" />
        <input name="universityCity" placeholder="City" required className="input input-bordered w-full" />
        <input name="worldRank" placeholder="World Rank" required className="input input-bordered w-full" />

        <select name="subjectCategory" required defaultValue="default" className="select select-bordered w-full">
          <option value="default" disabled>Select Subject Category</option>
          <option>Agriculture</option>
          <option>Engineering</option>
          <option>Doctor</option>
        </select>

        <select name="scholarshipCategory" required defaultValue="default" className="select select-bordered w-full">
          <option value="default" disabled>Select Scholarship Type</option>
          <option>Full fund</option>
          <option>Partial</option>
          <option>Self-fund</option>
        </select>

        <select name="degree" required defaultValue="default" className="select select-bordered w-full">
          <option value="default" disabled>Select Degree</option>
          <option>Diploma</option>
          <option>Bachelor</option>
          <option>Masters</option>
        </select>

        <input name="tuitionFees" placeholder="Tuition Fees (optional)" className="input input-bordered w-full" />
        <input name="applicationFees" placeholder="Application Fees" required className="input input-bordered w-full" />
        <input name="serviceCharge" placeholder="Service Charge" required className="input input-bordered w-full" />
        <input type="date" name="deadline" required className="input input-bordered w-full" />

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-success w-full mt-4 hover:scale-105 transition-transform">
            Add Scholarship
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarships;
