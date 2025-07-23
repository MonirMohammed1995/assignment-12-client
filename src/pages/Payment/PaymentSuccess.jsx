import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session_id = searchParams.get('session_id');
  const scholarshipId = searchParams.get('scholarshipId'); // passed from checkout redirect
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!session_id || !user?.email || !scholarshipId) {
      navigate('/');
      return;
    }

    const verifyAndSubmit = async () => {
      try {
        const api = import.meta.env.VITE_API_URL;

        const res = await axios.post(`${api}/payment-success`, {
          session_id,
          applicantEmail: user.email,
          scholarshipId,
          appliedAt: new Date(),
        });

        if (res.data.success) {
          Swal.fire('✅ Success!', 'Your application has been submitted.', 'success');
        } else {
          toast.error('Failed to complete application.');
        }
      } catch (error) {
        toast.error('Verification failed');
        console.error(error);
      }
    };

    verifyAndSubmit();
  }, [session_id, user?.email, scholarshipId, navigate]);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">🎉 Payment Successful!</h1>
      <p className="text-lg mt-2">Verifying your payment and submitting your application...</p>
    </div>
  );
};

export default PaymentSuccess;
