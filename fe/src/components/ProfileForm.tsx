import {useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import Header from './Header';
import { useNavigate } from "react-router-dom";



const AccountManagement = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        gender: 'Female',
        email: '',
        password: '',
        phone: '',
    });
    const navigate = useNavigate();
    const handleNavigate = () => {navigate('/reset-password');};

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        console.log('Saving data:', formData);
        // Gọi API PUT tại đây
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc muốn xóa tài khoản?')) {
            console.log('Deleting account...');
            // Gọi API DELETE tại đây
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div className="min-h-screen bg-[#f0eade] p-8 font-sans">
                <h1 className="text-gray-500 text-lg font-bold content-center">Welcome, User</h1>


                <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
                    <div className="bg-[#2973B2] h-20 flex justify-center items-center">
                        <div className="text-white text-3xl">Account Management</div>
                    </div>

                    <div className="flex items-center p-6 gap-4">
                        <img
                            src="https://i.pravatar.cc/100"
                            alt="User Avatar"
                            className="w-20 h-20 rounded-full border"
                        />
                        <div>
                            <div className="font-semibold text-lg">Username</div>
                            <div className="text-sm text-gray-600">username@gmail.com</div>
                        </div>
                    </div>

                    <div className="px-6 pb-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm">Full Name</label>
                            <div className="flex items-center border rounded px-2">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Your First Name"
                                    className="w-full p-2 outline-none"
                                />
                                <FaEdit className="text-gray-500"/>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm">Username</label>
                            <div className="flex items-center border rounded px-2">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="tina"
                                    className="w-full p-2 outline-none"
                                />
                                <FaEdit className="text-gray-500"/>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm">Email</label>
                            <div className="flex items-center border rounded px-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tina@gmail.com"
                                    className="w-full p-2 outline-none"
                                />
                                <FaEdit className="text-gray-500"/>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm">Phone number</label>
                            <div className="flex items-center border rounded px-2">
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Your phone number"
                                    className="w-full p-2 outline-none"
                                />
                                <FaEdit className="text-gray-500"/>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex justify-between">
                        <button
                            className="bg-[#2973B2] text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="bg-[#2973B2] text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleNavigate}
                        >
                            Change Password
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;
