import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type Review = {
    id: number;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: string;
};

type Comment = {
    id: number;
    content: string;
    userName: string;
    createdAt: string;
};

const ProductReviews: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const parsedId = parseInt(templateId || "0");

    const [reviews, setReviews] = useState<Review[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState<"reviews" | "comments">("reviews");

    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [commentText, setCommentText] = useState("");

    const token = localStorage.getItem("accessToken");
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        if (!parsedId) return;
        axios
            .get("http://localhost:8080/reviews", { params: { templateId: parsedId } })
            .then((res) => setReviews(res.data || []));
        axios
            .get("http://localhost:8080/comments", { params: { templateId: parsedId } })
            .then((res) => setComments(res.data || []));
    }, [parsedId]);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:8080/reviews",
                { templateId: parsedId, ...reviewForm },
                { headers: authHeader }
            );
            setReviewForm({ rating: 5, comment: "" });
            const res = await axios.get("http://localhost:8080/reviews", {
                params: { templateId: parsedId },
            });
            setReviews(res.data || []);
        } catch (err) {
            console.error("Gửi đánh giá thất bại:", err);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:8080/comments",
                { templateId: parsedId, content: commentText },
                { headers: authHeader }
            );
            setCommentText("");
            const res = await axios.get("http://localhost:8080/comments", {
                params: { templateId: parsedId },
            });
            setComments(res.data || []);
        } catch (err) {
            console.error("Gửi bình luận thất bại:", err);
        }
    };

    const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

    if (!parsedId) return <div className="text-red-500">Không tìm thấy sản phẩm.</div>;

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full">
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center px-4 py-2 border-r ${activeTab === "reviews" ? "text-[#2973B2] font-bold" : "text-gray-700"}`}
                >
                    Đánh giá
                    <span className="ml-1 bg-[#2973B2] text-white text-xs font-bold px-2 py-1 rounded-full">{reviews.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center px-4 py-2 ${activeTab === "comments" ? "text-[#2973B2] font-bold" : "text-gray-700"}`}
                >
                    Bình luận
                    <span className="ml-1 bg-[#2973B2] text-white text-xs font-bold px-2 py-1 rounded-full">{comments.length}</span>
                </button>
            </div>

            {/* Review Section */}
            {activeTab === "reviews" && (
                <>
                    <h2 className="text-lg font-semibold mb-2 text-blue-900">
                        {reviews.length} Lượt đánh giá
                    </h2>
                    <form
                        onSubmit={handleReviewSubmit}
                        className="bg-white p-4 rounded border mb-6 flex flex-col gap-3"
                    >
                        <textarea
                            name="comment"
                            placeholder="Viết đánh giá..."
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            className="border p-2 rounded text-sm w-full"
                            required
                        />
                        <select
                            value={reviewForm.rating}
                            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                            className="border p-2 rounded text-sm w-full"
                        >
                            {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>{star} ★</option>
                            ))}
                        </select>
                        <button type="submit" className="bg-[#2973B2] text-white px-4 py-2 rounded hover:bg-[#1f5c90] text-sm self-end transition">
                            Gửi đánh giá
                        </button>
                    </form>
                    {visibleReviews.map((r) => (
                        <div key={r.id} className="bg-white p-4 rounded border mb-4">
                            <p className="mb-2 text-sm">{r.comment}</p>
                            <div className="flex items-center justify-between text-sm text-gray-700">
                                <div className="text-yellow-500">
                                    {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                                </div>
                                <div className="text-gray-500 text-right">
                                    bởi {r.reviewerName} lúc {new Date(r.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                    {reviews.length > 3 && (
                        <div className="text-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-blue-600 hover:underline text-sm mt-2"
                            >
                                {showAll ? "Ẩn bớt" : "Xem thêm"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Comment Section */}
            {activeTab === "comments" && (
                <div className="bg-white p-4 rounded border text-sm text-gray-800 space-y-6">
                    <h2 className="text-base font-semibold mb-2">
                        {comments.length} bình luận.
                    </h2>
                    <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 mb-6">
                        <textarea
                            placeholder="Viết bình luận..."
                            className="border rounded p-2 text-sm"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            required
                        />
                        <div className="text-right">
                            <button
                                type="submit"
                                className="bg-[#2973B2] text-white px-4 py-2 rounded hover:bg-[#1f5c90] text-sm transition"
                            >
                                Gửi bình luận
                            </button>
                        </div>
                    </form>
                    {comments.map((c) => (
                        <div key={c.id} className="border-b pb-4">
                            <div className="font-bold mb-1">{c.userName}</div>
                            <div className="text-xs text-gray-500 mb-1">{new Date(c.createdAt).toLocaleString()}</div>
                            <p className="whitespace-pre-line">{c.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
