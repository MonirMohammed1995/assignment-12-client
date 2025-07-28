import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('paymentIntent');

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
          setErrorMsg(
            err?.response?.status === 404
              ? 'No application found with this payment ID.'
              : 'Something went wrong while fetching your application.'
          );
          setLoading(false);
        });
    } else {
      setErrorMsg('No payment ID found in the URL.');
      setLoading(false);
    }
  }, [paymentIntentId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center">
        <span className="loading loading-bars loading-lg text-green-500"></span>
        <p className="mt-4 text-gray-600">Loading your application details...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center">
        <p className="text-red-500 font-semibold">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg border border-green-200">
      <Helmet><title>Payment Success</title></Helmet>
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">🎉 Payment Successful!</h2>
      <div className="space-y-3 text-gray-700">
        <p><strong>🏛️ University:</strong> {application.scholarshipInfo?.university || 'N/A'}</p>
        <p><strong>🎓 Scholarship Category:</strong> {application.scholarshipInfo?.category || 'N/A'}</p>
        <p><strong>📚 Subject:</strong> {application.scholarshipInfo?.subject || 'N/A'}</p>
        <p><strong>👤 Applicant:</strong> {application.userName} ({application.userEmail})</p>
        <p><strong>📌 Status:</strong> {application.status || 'pending'}</p>
        <p><strong>💳 Payment Intent:</strong> {application.paymentIntentId}</p>
        <p><strong>🗓️ Applied On:</strong> {format(new Date(application.createdAt), 'PPpp')}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
