// PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    if (!session_id) return navigate('/');

    const verifyAndSubmit = async () => {
      try {
        const res = await axios.post('https://your-server.com/payment-success', { session_id });

        if (res.data.success) {
          Swal.fire('✅ Success!', 'Your application has been submitted.', 'success');
        } else {
          toast.error('Failed to complete application.');
        }
      } catch (error) {
        toast.error('Verification failed');
      }
    };

    verifyAndSubmit();
  }, [session_id, navigate]);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">🎉 Payment Successful!</h1>
      <p className="text-lg mt-2">Verifying your payment and submitting your application...</p>
    </div>
  );
};

export default PaymentSuccess;
