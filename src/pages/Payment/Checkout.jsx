import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadImageToImgbb } from "../../utils/uploadImageToImgbb"; // your image upload utility
import { AuthContext } from "../../context/AuthProvider";

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

  // ✅ Fetch scholarship info
  useEffect(() => {
    if (scholarshipId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/scholarships/${scholarshipId}`)
        .then((res) => setScholarship(res.data))
        .catch(() =>
          Swal.fire("Error", "Failed to load scholarship info", "error")
        );
    }
  }, [scholarshipId]);

  // ✅ Create Payment Intent
  useEffect(() => {
    if (scholarship?.applicationFees) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
          amount: scholarship.applicationFees,
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch(() =>
          Swal.fire("Error", "Payment initialization failed", "error")
        );
    }
  }, [scholarship]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setForm((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Handle Payment & Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);

    try {
      // Upload image
      const imageURL = await uploadImageToImgbb(form.photo);

      // Confirm Stripe payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.name,
              email: user?.email,
            },
          },
        }
      );

      if (error) throw new Error(error.message);

      if (paymentIntent.status === "succeeded") {
        const applicationData = {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          phone: form.phone,
          address: form.address,
          country: form.country,
          gender: form.gender,
          degree: form.degree,
          ssc: form.ssc,
          hsc: form.hsc,
          studyGap: form.gap || "None",
          photo: imageURL,
          scholarshipId,
          scholarshipInfo: {
            university: scholarship.university,
            category: scholarship.category,
            subject: scholarship.subject,
          },
          paymentStatus: paymentIntent.status,
          paymentIntentId: paymentIntent.id,
          createdAt: new Date(),
          status: "pending",
        };

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/applications`,
          applicationData
        );
        if (res.data.insertedId) {
          Swal.fire(
            "Success",
            "Application submitted successfully!",
            "success"
          );
          navigate(`/payment-success?paymentIntent=${paymentIntent.id}`);
        } else {
          Swal.fire("Error", "Application save failed", "error");
        }
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }

    setProcessing(false);
  };

  if (!scholarship) return <p>Loading scholarship info...</p>;

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Apply for: {scholarship.universityName}
      </h2>
      <p className="mb-4">
        Subject: {scholarship.subjectCategory} | Category:{" "}
        {scholarship.scholarshipCategory}
      </p>
      <p className="mb-4">Application Fee: ${scholarship.applicationFees}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Inputs */}
        <input
          name="phone"
          onChange={handleChange}
          required
          placeholder="Phone Number"
          className="input input-bordered w-full"
        />
        <input
          name="address"
          onChange={handleChange}
          required
          placeholder="Address (Village/District)"
          className="input input-bordered w-full"
        />
        <input
          name="country"
          onChange={handleChange}
          required
          placeholder="Country"
          className="input input-bordered w-full"
        />

        <select
          name="gender"
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <select
          name="degree"
          onChange={handleChange}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select Degree</option>
          <option>Diploma</option>
          <option>Bachelor</option>
          <option>Master</option>
        </select>

        <input
          name="ssc"
          onChange={handleChange}
          required
          placeholder="SSC Result"
          className="input input-bordered w-full"
        />
        <input
          name="hsc"
          onChange={handleChange}
          required
          placeholder="HSC Result"
          className="input input-bordered w-full"
        />

        <select
          name="gap"
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="">Study Gap (Optional)</option>
          <option>None</option>
          <option>1 Year</option>
          <option>2 Years</option>
          <option>More than 2</option>
        </select>

        <div>
          <label className="block font-semibold mb-1">Applicant Photo</label>
          <input
            type="file"
            accept="image/*"
            name="photo"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          {form.photoPreview && (
            <img
              src={form.photoPreview}
              alt="Preview"
              className="w-32 mt-2 rounded shadow"
            />
          )}
        </div>

        <div className="p-4 border rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0aec0" },
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? "Processing..." : "Pay & Submit"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
