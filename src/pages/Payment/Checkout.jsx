import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { uploadImageToImgbb } from '../../utils/uploadImageToImgbb';

const Checkout = () => {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    gender: '',
    degree: '',
    sscResult: '',
    hscResult: '',
    studyGap: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const { scholarship } = location.state || {};

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) return toast.error('Please upload a photo');

    let loadingToast;
    try {
      loadingToast = toast.loading('Uploading photo...');
      const photoURL = await uploadImageToImgbb(photoFile);
      toast.dismiss(loadingToast);
      toast.success('Photo uploaded!');

      // Prepare application data to send to backend & embed in Stripe metadata
      const applicationData = {
        ...formData,
        photo: photoURL,
        userId: user?._id,
        userEmail: user?.email,
        userName: user?.name,
        scholarshipId: scholarship?._id,
        scholarshipCategory: scholarship?.category,
        subjectCategory: scholarship?.subjectCategory,
        universityName: scholarship?.universityName,
        appliedAt: new Date().toISOString(),
      };

      const api = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${api}/create-stripe-session`, {
        amount: scholarship?.fee || 50,
        applicationData,
      });

      if (res?.data?.url) {
        // Redirect to Stripe checkout page with scholarshipId as query param for confirmation page
        window.location.href = `${res.data.url}&scholarshipId=${scholarship?._id}`;
      } else {
        toast.error('Failed to redirect to payment gateway');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Submission failed');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-semibold text-blue-700 mb-6">
          Scholarship Application & Payment
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section */}
          <div className="space-y-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <select
              name="gender"
              required
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select
              name="degree"
              required
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="">Select Degree</option>
              <option>Diploma</option>
              <option>Bachelor</option>
              <option>Masters</option>
            </select>
          </div>

          {/* Right Section */}
          <div className="space-y-4">
            <input
              type="text"
              name="sscResult"
              placeholder="SSC Result"
              required
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="hscResult"
              placeholder="HSC Result"
              required
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <select
              name="studyGap"
              onChange={handleInputChange}
              className="select select-bordered w-full"
            >
              <option value="">Any Study Gap?</option>
              <option>Yes</option>
              <option>No</option>
            </select>

            <input
              value={scholarship?.universityName || ''}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
            <input
              value={scholarship?.subjectCategory || ''}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          {/* Submit Button (Full Width) */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300"
            >
              Submit & Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
