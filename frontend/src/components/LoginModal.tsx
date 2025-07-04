// src/components/LoginModal.tsx
import React from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LoginModal: React.FC = () => {
  const { isOpen, closeModal } = useLoginModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-black text-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl animate-fadeIn">
        <button onClick={closeModal} className="absolute top-4 right-4 text-white">
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold mb-2 text-center">Welcome Back!</h2>
        <p className="text-sm text-gray-300 mb-6 text-center">Login to your account</p>

        <label className="text-left text-sm">Enter Your WhatsApp Number</label>
        <input
          type="text"
          placeholder="+91"
          disabled
          className="w-full mt-1 mb-4 p-2 bg-zinc-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[0_0_10px_rgba(255,255,255,0.2)] cursor-not-allowed opacity-50"
        />

        <button
          disabled
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full py-2 rounded-full mb-4 flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
        >
          Get OTP <img src="/whatsapp-icon.svg" alt="wa" className="h-5 w-5" />
        </button>

        <div className="text-center text-gray-400 mb-4">OR</div>

        <button
          onClick={() => {
            toast.loading('Redirecting to Google login...');
            window.location.href = import.meta.env.VITE_domainName + "/auth/google/login";
          }}
          className="w-full py-2 rounded-lg bg-white text-black mb-2 flex items-center justify-center gap-2"
        >
          <img src="/google-icon.svg" alt="g" className="h-5 w-5" /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
