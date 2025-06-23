
import { useState } from 'react';
import { Eye, EyeOff } from 'react-feather';

export default function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        console.log('New password:', password);
        // TODO: Call API to reset password
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f1e8] p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center space-y-6">
                <h2 className="text-[#2973B2] font-semibold">Reset Password</h2>
                <h1 className="text-2xl font-bold text-[#2973B2]">Create a New Password</h1>

                <div className="text-left space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded-full py-2 px-4 pr-10 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border rounded-full py-2 px-4 pr-10 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-[#2973B2] text-white px-6 py-2 rounded-full hover:bg-[#215e90] transition mt-4"
                >
                    Reset password
                </button>
            </div>
        </div>
    );
}
