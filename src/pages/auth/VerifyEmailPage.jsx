import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, verifyEmail, login } = useAuth(); // Tambah login function
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Coba ambil email dari berbagai sumber
    const storedEmail = localStorage.getItem('verification_email');
    const userEmail = user?.email;
    
    // Atau dari URL params
    const queryParams = new URLSearchParams(location.search);
    const urlEmail = queryParams.get('email');
    
    // Juga cek dari register_email
    const registerEmail = localStorage.getItem('register_email');
    
    const finalEmail = storedEmail || userEmail || urlEmail || registerEmail;
    
    if (!finalEmail) {
      console.warn('No email found for verification');
      navigate('/register');
      return;
    }
    
    console.log('Email for verification:', finalEmail);
    setEmail(finalEmail);
    
    // Simpan email di localStorage untuk consistency
    if (finalEmail && finalEmail !== storedEmail) {
      localStorage.setItem('verification_email', finalEmail);
    }
    
  }, [navigate, user, location]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter complete OTP code');
      return;
    }

    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Verifying OTP:', { email, otpString });
      
      // OTP HARUS dikirim sebagai INTEGER ke backend
      const otpNumber = parseInt(otpString, 10);
      
      const response = await fetch('http://localhost:8000/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          otp: otpNumber  
        })
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (!response.ok) {
        // Coba extract error dari Laravel validation
        let errorMessage = data.message;
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(', ');
        }
        throw new Error(errorMessage || `Verification failed (Status: ${response.status})`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Verification failed');
      }

      console.log('Verification successful:', data);
      
      // HAPUS verification data
      localStorage.removeItem('verification_email');
      localStorage.removeItem('verify_token');
      localStorage.removeItem('register_email');
      
      // Simpan FULL ACCESS token
      if (data.data && data.data.access_token && data.data.user) {
        localStorage.setItem('token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('email_verified', 'true');
        
        // Update auth context dengan login (bukan hanya verifyEmail)
        if (login && typeof login === 'function') {
          login(data.data.user, data.data.access_token, true);
        }
        
        // Juga panggil verifyEmail untuk update state
        if (verifyEmail && typeof verifyEmail === 'function') {
          verifyEmail();
        }
      } else {
        console.warn('No access token or user data in response');
      }

      // Redirect berdasarkan role
      if (data.data && data.data.user) {
        if (data.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Verification error:', err);
      
      // Tampilkan error yang lebih spesifik
      let errorMessage = err.message;
      if (errorMessage.includes('422')) {
        errorMessage = 'Invalid OTP format. Please check and try again.';
      } else if (errorMessage.includes('incorrect', 'expired', 'Incorrect', 'Expired')) {
        // Backend mengirim "Incorrect or Expired OTP Code!"
        errorMessage = 'Incorrect or expired OTP code. Please request a new OTP.';
      }
      
      setError(errorMessage || 'Verification failed. Please try again.');
      
      // Reset OTP jika error
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Resending OTP to:', email);
      
      const response = await fetch('http://localhost:8000/api/resend-verification-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email 
        })
      });

      const data = await response.json();
      console.log('Resend response:', data);

      if (!response.ok || !data.success) {
        let errorMessage = data.message;
        if (data.errors) {
          errorMessage = Object.values(data.errors).flat().join(', ');
        }
        throw new Error(errorMessage || 'Failed to resend OTP');
      }

      setCountdown(60);
      setCanResend(false);
      setError('');
      setOtp(['', '', '', '', '', '']); // Reset OTP fields
      
      alert('OTP has been resent to your email. Please check your inbox.');

    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            We've sent a 6-digit OTP to your email: <br />
            <strong className="text-blue-600 break-all">{email || user?.email || 'Loading...'}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleVerify}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter 6-digit OTP Code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={e => handleOtpChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onFocus={e => e.target.select()}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : 'Verify Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOtp}
              disabled={!canResend || loading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed underline"
            >
              {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('verification_email');
              localStorage.removeItem('register_email');
              navigate('/register');
            }}
            className="text-gray-600 hover:text-gray-700 font-medium"
          >
            Use different email
          </button>
        </div>
      </div>
    </div>
  );
}