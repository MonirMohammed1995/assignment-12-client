import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthProvider';
import { uploadImageToImgbb } from '../../../utils/uploadImageToImgbb';

const AddScholarship = () => {
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

    if (!imageURL) {
      return Swal.fire('❗ Please upload an image first');
    }

    // Check selects for placeholder value "default"
    const subjectCategory = form.subjectCategory.value;
    const scholarshipCategory = form.scholarshipCategory.value;
    const degree = form.degree.value;

    if (
      subjectCategory === 'default' ||
      scholarshipCategory === 'default' ||
      degree === 'default'
    ) {
      return Swal.fire('⚠️ Please select all dropdown values properly');
    }

    // You can add more validation here if needed (e.g. trimming strings, etc.)

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
      tuitionFees: form.tuitionFees.value || 'N/A',
      applicationFees: form.applicationFees.value,
      serviceCharge: form.serviceCharge.value,
      deadline: form.deadline.value,
      postDate: new Date().toISOString(),
      email: user?.email || 'unknown',
    };

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Add Scholarship</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="scholarshipName" placeholder="Scholarship Name" required className="input input-bordered" />
        <input name="universityName" placeholder="University Name" required className="input input-bordered" />

        {/* Image Upload Section */}
        <div className="md:col-span-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="file-input w-full"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={loading}
            className="btn btn-info mt-2"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          {imageURL && <img src={imageURL} alt="Preview" className="w-32 mt-2 rounded-md shadow" />}
        </div>

        <input name="universityCountry" placeholder="Country" required className="input input-bordered" />
        <input name="universityCity" placeholder="City" required className="input input-bordered" />
        <input name="worldRank" placeholder="World Rank" required className="input input-bordered" />

        <select name="subjectCategory" required defaultValue="default" className="select select-bordered">
          <option value="default" disabled>Select Subject Category</option>
          <option>Agriculture</option>
          <option>Engineering</option>
          <option>Doctor</option>
        </select>

        <select name="scholarshipCategory" required defaultValue="default" className="select select-bordered">
          <option value="default" disabled>Select Scholarship Type</option>
          <option>Full fund</option>
          <option>Partial</option>
          <option>Self-fund</option>
        </select>

        <select name="degree" required defaultValue="default" className="select select-bordered">
          <option value="default" disabled>Select Degree</option>
          <option>Diploma</option>
          <option>Bachelor</option>
          <option>Masters</option>
        </select>

        <input name="tuitionFees" placeholder="Tuition Fees (optional)" className="input input-bordered" />
        <input name="applicationFees" placeholder="Application Fees" required className="input input-bordered" />
        <input name="serviceCharge" placeholder="Service Charge" required className="input input-bordered" />
        <input type="date" name="deadline" required className="input input-bordered" />

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-success w-full mt-4">Add Scholarship</button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;
