import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('paymentIntent');

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentIntentId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/applications/payment/${paymentIntentId}`)
        .then((res) => {
          setApplication(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [paymentIntentId]);

  if (loading) return <p className="text-center my-10">Loading your application details...</p>;
  if (!application) return <p className="text-center my-10">Application not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-green-600">🎉 Payment Successful!</h2>
      <p><strong>University:</strong> {application.university}</p>
      <p><strong>Scholarship Category:</strong> {application.category}</p>
      <p><strong>Subject:</strong> {application.subject}</p>
      <p><strong>Applicant:</strong> {application.userName} ({application.userEmail})</p>
      <p><strong>Status:</strong> {application.status}</p>
      <p><strong>Payment Intent:</strong> {application.paymentIntentId}</p>
      <p><strong>Date:</strong> {new Date(application.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default PaymentSuccess;
