import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Template {
    id: number;
    name: string;
    description: string;
    thumbnailFile: {
        path: string;
    };
    price: number;
    discountPrice: number;
}

const shuffleArray = (array: Template[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

const SuggestedProducts: React.FC = () => {
    const [suggested, setSuggested] = useState<Template[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get("http://localhost:8080/statistics/trending", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const shuffled = shuffleArray(res.data || []).slice(0, 4);
                setSuggested(shuffled);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm gợi ý:", err);
                setError("Không thể tải sản phẩm gợi ý. Vui lòng thử lại.");
            }
        };
        fetchData();
    }, []);

    return (
        <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-[#2E577A]">Sản phẩm gợi ý</h3>

            {error ? (
                <div className="text-red-600 text-sm">{error}</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {suggested.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition"
                        >
                            <img
                                src={p.thumbnailFile?.path || "https://via.placeholder.com/150"}
                                alt={p.name}
                                className="rounded w-full h-28 object-cover mb-2"
                            />
                            <h4 className="text-sm font-semibold line-clamp-2">{p.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {p.description.slice(0, 60)}...
                            </p>
                            <div className="flex justify-between items-center mt-2">
                <span className="text-[#2973B2] font-semibold text-sm">
                  {((p.discountPrice ?? p.price) / 1000).toLocaleString()}K
                </span>
                                <Link to={`/template/${p.id}`}>
                                    <button className="text-xs text-blue-600 hover:underline">
                                        Xem chi tiết
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SuggestedProducts;