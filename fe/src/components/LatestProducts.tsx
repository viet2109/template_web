import React from "react";
import { Link } from 'react-router-dom';
import product from "../data/product.js"; // Đảm bảo import không có dấu ngoặc nhọn
const LatestProducts: React.FC = () => {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Khám phá các giao diện và mẫu mới nhất của chúng tôi</h2>
                <p className="text-gray-600 mt-2 text-sm">
                    Chúng tôi xem xét kỹ lưỡng các mục mới từ cộng đồng để đảm bảo chúng đáp ứng các tiêu chuẩn và thiết kế chất lượng cao.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {["Tất cả", "WordPress", "CMS", "eCommerce", "Marketing", "UI Templates"].map((cat, idx) => (
                    <button
                        key={idx}
                        className="px-3 py-1 bg-white border rounded-full text-sm hover:bg-blue-100"
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.isArray(product) &&
                    product.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-3 cursor-pointer"
                        >
                            <img
                                src={p.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                                alt={p.images?.[0]?.alt || p.name}
                                className="rounded w-full h-40 object-cover mb-3"
                            />
                            <h3 className="text-base font-semibold">{p.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {p.description.slice(0, 100)}...
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-black-600 font-semibold">{p.price}</span>
                                <div className="flex gap-2">
                                    <button className="text-sm border border-[#CCCCCC] text-[#CCCCCC] bg-white px-3 py-1 rounded hover:bg-[#f5f5f5] transition cursor-pointer">
                                        🛒
                                    </button>
                                    <Link to="/detail">
                                        <button className="text-sm border border-[#087096] text-[#087096] bg-white px-3 py-1 rounded hover:bg-[#087096] hover:text-white transition cursor-pointer">
                                            Xem trước trực tiếp
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>


            <div className="mt-8 text-center">
                <button className="bg-[#2973B2] border border-[#2973B2] text-white px-6 py-2 rounded hover:bg-[#225c90] transition cursor-pointer">
                    Xem thêm sản phẩm mới
                </button>
            </div>
        </div>
    );
};

export default LatestProducts;
