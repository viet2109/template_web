// src/components/productsComponent/SuggestedProducts.tsx
import React from "react";
import { Link } from "react-router-dom";
import products from "../../data/product.js"; // Mảng sản phẩm

const SuggestedProducts: React.FC = () => {
    // Lấy 4 sản phẩm mới nhất (giả sử sản phẩm mới nhất nằm ở đầu mảng)
    const suggested = products.slice(0, 4);

    return (
        <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-[#2E577A]">Sản phẩm gợi ý</h3>
            <div className="grid grid-cols-1 gap-4">
                {suggested.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition"
                    >
                        <img
                            src={p.images?.[0]?.url || "https://via.placeholder.com/150"}
                            alt={p.name}
                            className="rounded w-full h-28 object-cover mb-2"
                        />
                        <h4 className="text-sm font-semibold line-clamp-2">{p.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                            {p.description.slice(0, 60)}...
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[#2973B2] font-semibold text-sm">{p.price}</span>
                            <Link to={`/detail/${p.id}`}>
                                <button className="text-xs text-blue-600 hover:underline">
                                    Xem chi tiết
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedProducts;
