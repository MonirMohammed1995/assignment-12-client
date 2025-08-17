import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImageToImgbb } from "../../utils/uploadImageToImgbb";
import { AuthContext } from "../../context/AuthProvider";
import { Helmet } from "react-helmet";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id: scholarshipId } = useParams();

  const [scholarship, setScholarship] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    address: "",
    country: "",
    gender: "",
    degree: "",
    ssc: "",
    hsc: "",
    gap: "",
    photo: null,
    photoPreview: "",
  });

  // Fetch scholarship info
  useEffect(() => {
    if (scholarshipId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/scholarships/${scholarshipId}`)
        .then(res => setScholarship(res.data))
        .catch(() => Swal.fire("Error", "Failed to load scholarship info", "error"));
    }
  }, [scholarshipId]);

  // Initialize Stripe Payment Intent
  useEffect(() => {
    if (scholarship?.applicationFees) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
          amount: scholarship.applicationFees,
        })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(() => Swal.fire("Error", "Payment initialization failed", "error"));
    }
  }, [scholarship]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setForm(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      Swal.fire("Error", "Stripe is not ready or payment intent missing", "error");
      return;
    }

    setProcessing(true);

    try {
      const imageURL = await uploadImageToImgbb(form.photo);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.name || "No Name", email: user?.email || "no@email.com" },
        },
      });

      if (result.error) throw new Error(result.error.message);

      if (result.paymentIntent.status === "succeeded") {
        const applicationData = {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          ...form,
          photo: imageURL,
          scholarshipId,
          scholarshipInfo: {
            university: scholarship.universityName,
            category: scholarship.scholarshipCategory,
            subject: scholarship.subjectCategory,
          },
          paymentStatus: result.paymentIntent.status,
          paymentIntentId: result.paymentIntent.id,
          applicationFees: scholarship.applicationFees,
          createdAt: new Date(),
          status: "pending",
        };

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/payment-success`, { applicationData });

        if (res.data.insertedId) {
          Swal.fire("Success", "Application submitted!", "success");
          navigate(`/payment-success?paymentIntent=${result.paymentIntent.id}`);
        } else Swal.fire("Error", "Failed to save application", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }

    setProcessing(false);
  };

  if (!scholarship) return <p className="text-center py-10 text-gray-500">Loading scholarship info...</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl">
      <Helmet><title>Checkout - {scholarship.universityName}</title></Helmet>
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Apply for Scholarship</h1>

      {/* Scholarship Info */}
      <div className="bg-indigo-50 p-4 rounded-md mb-6 border-l-4 border-indigo-500">
        <h2 className="font-semibold text-xl">{scholarship.universityName}</h2>
        <p className="text-gray-700">
          Subject: {scholarship.subjectCategory} | Category: {scholarship.scholarshipCategory}
        </p>
        <p className="text-gray-700">Application Fee: <span className="font-bold">${scholarship.applicationFees}</span></p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="phone" placeholder="Phone Number" className="input input-bordered w-full" required onChange={handleChange} />
          <input name="address" placeholder="Address (Village/District)" className="input input-bordered w-full" required onChange={handleChange} />
          <input name="country" placeholder="Country" className="input input-bordered w-full" required onChange={handleChange} />
          <select name="gender" className="select select-bordered w-full" required onChange={handleChange}>
            <option value="">Select Gender</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <select name="degree" className="select select-bordered w-full" required onChange={handleChange}>
            <option value="">Select Degree</option>
            <option>Diploma</option><option>Bachelor</option><option>Master</option>
          </select>
          <input name="ssc" placeholder="SSC Result" className="input input-bordered w-full" required onChange={handleChange} />
          <input name="hsc" placeholder="HSC Result" className="input input-bordered w-full" required onChange={handleChange} />
          <select name="gap" className="select select-bordered w-full" onChange={handleChange}>
            <option value="">Study Gap (Optional)</option>
            <option>None</option><option>1 Year</option><option>2 Years</option><option>More than 2</option>
          </select>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block font-semibold mb-2">Applicant Photo</label>
          <input type="file" accept="image/*" name="photo" onChange={handleChange} className="file-input file-input-bordered w-full" />
          {form.photoPreview && <img src={form.photoPreview} alt="Preview" className="w-32 mt-2 rounded shadow-md" />}
        </div>

        {/* Stripe Card */}
        <div className="p-4 border rounded-md bg-gray-50">
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#32325d", "::placeholder": { color: "#a0aec0" } },
              },
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg font-semibold"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? "Processing..." : `Pay $${scholarship.applicationFees} & Submit`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
