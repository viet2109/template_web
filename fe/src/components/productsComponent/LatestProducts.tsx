import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Template {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    thumbnailFile: {
        path: string;
    };
}

const LatestTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get("http://localhost:8080/statistics/trending", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setTemplates(res.data.slice(0, 6)); // lấy 6 template đầu tiên
            } catch (err: never) {
                console.error("Lỗi khi lấy template mới nhất:", err);
                setError("Không thể tải dữ liệu. Vui lòng đăng nhập hoặc thử lại sau.");
            }
        };
        fetchData();
    }, []);

    if (error) {
        return <div className="text-red-600 text-sm text-center mt-4">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
                <div key={tpl.id} className="shadow rounded-xl p-3 bg-white hover:shadow-md transition">
                    <img
                        src={tpl.thumbnailFile?.path || "https://via.placeholder.com/300"}
                        alt={tpl.name}
                        className="h-40 w-full object-cover rounded-md"
                    />
                    <h3 className="mt-2 font-bold text-sm">{tpl.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{tpl.description}</p>
                    <div className="flex justify-between items-center mt-2">
            <span className="text-blue-600 font-semibold text-sm">
              {(tpl.discountPrice ?? tpl.price) / 1000}K
            </span>
                        <Link
                            to={`/template/${tpl.id}`}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            Xem chi tiết
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LatestTemplates;