import React, { useState } from "react";

type Review = {
    id: number;
    name: string;
    comment: string;
    rating: number;
    category: string;
    reviewer: string;
    timeAgo: string;
};

type Comment = {
    id: number;
    user: string;
    isAuthor?: boolean;
    purchased?: boolean;
    timeAgo: string;
    message: string;
    replies?: Comment[];
};

const commentsDataInit: Comment[] = [
    {
        id: 1,
        user: "rcbandit",
        purchased: true,
        timeAgo: "cách đây 1 ngày",
        message: "Xin chào, tôi có thể report bug được không ?",
        replies: [
            {
                id: 2,
                user: "TemplateAdmin",
                isAuthor: true,
                timeAgo: "cách đây 1 ngày",
                message:
                    "Vâng,\n\nXin chào bạn , hãy liên hệ email templateteam@gmail.com để được hỗ trợ.\n\nCảm ơn bạn rất nhiều!",
            },
        ],
    },
    {
        id: 3,
        user: "soluency",
        timeAgo: "Gần 2 năm trước",
        message: "Bạn có hướng dẫn triển khai/cài đặt không?",
        replies: [
            {
                id: 4,
                user: "TemplateAdmin",
                isAuthor: true,
                timeAgo: "gần 2 năm trước",
                message:
                    "Vâng,\n\nCó, nó đã được đề cập trong tài liệu của chúng tôi. Nó sẽ có trong tệp đã tải xuống.\n\nCảm ơn ",
            },
        ],
    },
];

const initialReviews: Review[] = [
    {
        id: 1,
        name: "Nhân",
        comment: "Code thật tuyệt và chất lượng!",
        rating: 5,
        category: "Chất lượng",
        reviewer: "nhan2108",
        timeAgo: "cách đây 2 tháng trước",
    },
    {
        id: 2,
        name: "John",
        comment: "Sản phẩm rất hữu ích.",
        rating: 4,
        category: "Trải nghiệm người dùng",
        reviewer: "johnnycode",
        timeAgo: "1 tháng trước",
    },
    {
        id: 3,
        name: "Anna",
        comment: "Thiết kế hiện đại và tối ưu.",
        rating: 5,
        category: "Thiết kế",
        reviewer: "annaUI",
        timeAgo: "2 tuần trước",
    },
    {
        id: 4,
        name: "Tom",
        comment: "Còn vài lỗi nhỏ, nhưng tạm ổn.",
        rating: 3,
        category: "Chức năng",
        reviewer: "tomdev",
        timeAgo: "1 tuần trước",
    },
];

type ReviewFormProps = {
    formData: {
        name: string;
        comment: string;
        rating: number;
        category: string;
        reviewer: string;
    };
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    onSubmit: (e: React.FormEvent) => void;
};

const ReviewForm: React.FC<ReviewFormProps> = ({
                                                   formData,
                                                   onChange,
                                                   onSubmit,
                                               }) => (
    <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded border mb-6 flex flex-col gap-3"
    >
        <div className="flex gap-2">
            <input
                type="text"
                name="name"
                placeholder="Tên"
                value={formData.name}
                onChange={onChange}
                required
                className="border p-2 rounded text-sm w-full"
            />
            <input
                type="text"
                name="reviewer"
                placeholder="Username"
                value={formData.reviewer}
                onChange={onChange}
                required
                className="border p-2 rounded text-sm w-full"
            />
        </div>

        <div className="flex gap-2">
            <input
                type="text"
                name="category"
                placeholder="Thể loại"
                value={formData.category}
                onChange={onChange}
                required
                className="border p-2 rounded text-sm w-full"
            />
            <select
                name="rating"
                value={formData.rating}
                onChange={onChange}
                className="border p-2 rounded text-sm w-full"
            >
                {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>
                        {star} ★
                    </option>
                ))}
            </select>
        </div>

        <textarea
            name="comment"
            placeholder="Viết đánh giá của bạn..."
            value={formData.comment}
            onChange={onChange}
            required
            className="border p-2 rounded text-sm w-full"
        />

        <button
            type="submit"
            className="bg-[#2973B2] text-white px-4 py-2 rounded hover:bg-[#1f5c90] text-sm self-end transition"
        >
            Gửi đánh giá
        </button>
    </form>
);

type ReviewItemProps = {
    review: Review;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => (
    <div className="bg-white p-4 rounded border mb-4">
        <div className="mb-3">
            <p className="font-semibold mb-1">{review.name}</p>
            <p className="mb-3">{review.comment}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="text-yellow-500">
                {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
            </div>
            <div>
                <span className="font-semibold">về </span>
                <span className="font-semibold">{review.category}</span>
            </div>
            <div className="text-gray-500 text-right">
                bởi {review.reviewer} {review.timeAgo}
            </div>
        </div>
    </div>
);

const ProductReviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState<"reviews" | "comments">("reviews");
    const [formData, setFormData] = useState({
        name: "",
        comment: "",
        rating: 5,
        category: "",
        reviewer: "",
    });
    const [comments, setComments] = useState<Comment[]>(commentsDataInit);
    const [replyBoxes, setReplyBoxes] = useState<{ [key: number]: string }>({});

    const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = {
            ...formData,
            id: Date.now(),
            timeAgo: "vừa xong",
        };
        setReviews([newReview, ...reviews]);
        setFormData({
            name: "",
            comment: "",
            rating: 5,
            category: "",
            reviewer: "",
        });
    };

    const toggleReply = (commentId: number) => {
        setReplyBoxes((prev) => ({
            ...prev,
            [commentId]: prev[commentId] ? "" : "",
        }));
    };

    const handleReplyChange = (id: number, value: string) => {
        setReplyBoxes((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleReplySubmit = (id: number) => {
        const text = replyBoxes[id];
        if (!text.trim()) return;

        setComments((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        replies: [
                            ...(c.replies || []),
                            {
                                id: Date.now(),
                                user: "you",
                                message: text,
                                timeAgo: "vừa xong",
                            },
                        ],
                    }
                    : c
            )
        );

        setReplyBoxes((prev) => ({ ...prev, [id]: "" }));
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full">
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex items-center px-4 py-2 border-r ${
                        activeTab === "reviews" ? "text-[#2973B2] font-bold" : "text-gray-700"
                    }`}
                >
                    Đánh giá
                    <span className="ml-1 bg-[#2973B2] text-white text-xs font-bold px-2 py-1 rounded-full">
    {reviews.length}
</span>
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center px-4 py-2 ${
                        activeTab === "comments" ? "text-[#2973B2] font-bold" : "text-gray-700"
                    }`}
                >
                    Bình luận
                    <span className="ml-1 bg-[#2973B2] text-white text-xs font-bold px-2 py-1 rounded-full">
    {comments.length}
</span>
                </button>
            </div>

            {/* Reviews tab */}
            {activeTab === "reviews" && (
                <>
                <h2 className="text-lg font-semibold mb-2 text-blue-900">
                        {reviews.length} Lượt đánh giá
                    </h2>
                    <ReviewForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                    {visibleReviews.map((review) => (
                        <ReviewItem key={review.id} review={review}/>
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

            {/* Comments tab */}
            {activeTab === "comments" && (
                <div className="bg-white p-4 rounded border text-sm text-gray-800 space-y-6">
                    <h2 className="text-base font-semibold mb-2">
                        {comments.length} bình luận.
                    </h2>

                    {/* Comment Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const message = replyBoxes[0];
                            if (!message?.trim()) return;
                            const newComment: Comment = {
                                id: Date.now(),
                                user: "you",
                                message: message,
                                timeAgo: "vừa xong",
                            };
                            setComments([newComment, ...comments]);
                            setReplyBoxes((prev) => ({...prev, 0: ""}));
                        }}
                        className="flex flex-col gap-2 mb-6"
                    >
      <textarea
          placeholder="Viết bình luận của bạn..."
          className="border rounded p-2 text-sm"
          value={replyBoxes[0] || ""}
          onChange={(e) => handleReplyChange(0, e.target.value)}
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

                    {/* Comment List */}
                    {comments.map((comment) => (
                        <div key={comment.id} className="border-b pb-4">
                            <div className="mb-1">
                                <span className="font-bold">{comment.user}</span>
                                {comment.purchased && (
                                    <span className="ml-2 text-xs font-semibold" style={{color: "#48A6A7"}}>
              Đã mua hàng
            </span>
                                )}
                                {comment.isAuthor && (
                                    <span className="ml-2 text-blue-600 text-xs font-semibold">
              Tác giả
            </span>
                                )}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{comment.timeAgo}</div>
                            <p className="whitespace-pre-line">{comment.message}</p>

                            {/* Reply box toggle + reply list */}
                            <div className="mt-2">
                                <button
                                    className="text-xs hover:underline"
                                    style={{ color: "#2973B2" }}
                                    onClick={() => toggleReply(comment.id)}
                                >
                                    Trả lời
                                </button>

                                {replyBoxes[comment.id] !== undefined && (
                                    <div className="mt-2">
              <textarea
                  className="border rounded p-2 text-sm w-full"
                  placeholder="Nhập trả lời..."
                  value={replyBoxes[comment.id]}
                  onChange={(e) => handleReplyChange(comment.id, e.target.value)}
              />
                                        <div className="text-right">
                                            <button
                                                onClick={() => handleReplySubmit(comment.id)}
                                                className="bg-[#2973B2] text-white px-3 py-1 mt-2 rounded text-xs hover:bg-[#1f5c90] transition"
                                            >
                                                Gửi trả lời
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {comment.replies?.map((reply) => (
                                    <div
                                        key={reply.id}
                                        className="mt-4 ml-4 pl-4 border-l border-gray-200"
                                    >
                                        <div className="mb-1">
                                            <span className="font-bold">{reply.user}</span>
                                            <span className="ml-2 text-xs text-gray-500">
                  {reply.timeAgo}
                </span>
                                        </div>
                                        <p className="whitespace-pre-line">{reply.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProductReviews;
