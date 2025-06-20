import { useState } from "react";
import product from "../data/product.js";

interface Product {
    id: number;
    name: string;
    images: { url: string; alt: string }[];
    price: string;
}

function Cart() {
    // const [checkedIds, setCheckedIds] = useState<number[]>([]);

    // const handleCheck = (id: number) => {
    //     setCheckedIds((prev) =>
    //         prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    //     );
    // };
    //
    // const parsePrice = (priceStr: string): number => {
    //     return parseFloat(priceStr.replace(/[^\d.]/g, ""));
    // };
    //
    // const total = product
    //     .filter((item) => checkedIds.includes(item.id))
    //     .reduce((sum, item) => sum + parsePrice(item.price), 0);

    return (
        <div
            className="w-full min-h-screen py-6"
            style={{
                backgroundColor: "rgb(242, 239, 231)",
                color: "rgb(46 87 122)"
            }}
        >
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.05)] px-5 py-6">
                <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left - Cart Items */}
                    <div className="md:col-span-2 p-4 space-y-4">
                        {product.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <input
                                    type="checkbox"
                                    // checked={checkedIds.includes(item.id)}
                                    // onChange={() => handleCheck(item.id)}
                                    className="accent-blue-500 mt-2"
                                />
                                <img
                                    src={item.images[0]?.url}
                                    alt={item.images[0]?.alt || item.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h2 className="text-base font-semibold">{item.name}</h2>
                                    <span className="text-gray-900 font-bold mt-2 block">
                                    {item.price}
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right - Summary */}
                    <div className="border rounded-lg shadow-sm p-4 h-fit bg-[rgb(242,239,231)]">
                        <div className="flex justify-between items-center font-bold text-xl mb-4">
                            <span>Tổng tiền</span>
                            <span className="text-gray-900">500.000đ</span>
                        </div>
                        <button
                            className="w-full py-3 rounded-lg font-medium bg-[#2973B2] hover:bg-[rgb(48,139,216)] text-white transition duration-200"
                        >
                            Tiến hành thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Cart;
