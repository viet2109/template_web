import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather'; // Hoặc dùng FaArrowLeft từ react-icons/fa

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gửi mã xác minh tới email và chuyển sang trang verify
        navigate('/verify-code', { state: { email } });
    };

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4 relative">
                {/* Nút quay lại */}
                <button
                    onClick={handleGoBack}
                    className="absolute left-4 top-4 text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={20} />
                </button>

                <h2 className="text-xl font-bold text-center text-[#2973B2]">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full border px-3 py-2 rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2973B2] text-white py-2 rounded hover:bg-blue-700"
                    >
                        Send Verification Code
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
