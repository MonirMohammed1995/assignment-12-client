import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { CheckCircle2 } from 'lucide-react';

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
        .then(res => {
          setApplication(res.data);
          setLoading(false);
        })
        .catch(err => {
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
      <div className="flex flex-col items-center justify-center py-16">
        <span className="loading loading-bars loading-lg text-green-500"></span>
        <p className="mt-4 text-gray-600">Loading your application details...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-500 font-semibold text-lg">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl border border-green-200">
      <Helmet><title>Payment Success</title></Helmet>

      {/* Success Header */}
      <div className="flex flex-col items-center mb-8">
        <CheckCircle2 size={60} className="text-green-500 mb-2" />
        <h1 className="text-3xl font-bold text-green-600 text-center">
        Payment Successful!
        </h1>
        <p className="text-gray-600 mt-1">Your scholarship application has been submitted successfully.</p>
      </div>

      {/* Application Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <div className="space-y-2 p-4 border rounded-lg shadow-sm bg-gray-50">
          <p><span className="font-semibold">University:</span> {application.scholarshipInfo?.university || 'N/A'}</p>
          <p><span className="font-semibold">Category:</span> {application.scholarshipInfo?.category || 'N/A'}</p>
          <p><span className="font-semibold">Subject:</span> {application.scholarshipInfo?.subject || 'N/A'}</p>
          <p><span className="font-semibold">Degree:</span> {application.degree || 'N/A'}</p>
        </div>

        <div className="space-y-2 p-4 border rounded-lg shadow-sm bg-gray-50">
          <p><span className="font-semibold">Applicant Name:</span> {application.userName}</p>
          <p><span className="font-semibold">Email:</span> {application.userEmail}</p>
          <p><span className="font-semibold">Payment Status:</span> {application.paymentStatus || 'Pending'}</p>
          <p><span className="font-semibold">Payment ID:</span> {application.paymentIntentId}</p>
          <p><span className="font-semibold">Applied On:</span> {format(new Date(application.createdAt), 'PPpp')}</p>
        </div>
      </div>

      {/* Optional Notes / Actions */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">You can track your application status from your dashboard.</p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="mt-4 btn btn-primary px-6 py-2 rounded-full"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
