import React from "react";
import products from "../data/product.js";
import ProductImageGallery from "../components/detailComponent/ProductImageGallery";
import ProductReviews from "../components/ProductReviews.tsx";
import LatestProducts from "../components/LatestProducts.tsx";

function ProductDetails() {
    const productId = 1;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-10" style={{ backgroundColor: 'rgb(242, 239, 231)', color: 'rgb(41, 115, 178)' }}>
                <h1 className="text-2xl font-bold">Không tìm thấy sản phẩm</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10" style={{ color: 'rgb(15 25 33)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cột trái */}
                <div className="lg:col-span-8">
                    <ProductImageGallery productId={productId}/>

                    {/* Mô tả */}
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-4" style={{color: 'rgb(46 87 122)'}}>Mô tả</h2>
                        <p className="mb-6 whitespace-pre-line">{product.description}</p>

                        <h3 className="text-xl font-semibold mb-2" style={{color: 'rgb(46 87 122)'}}>Tệp đi kèm</h3>
                        <ul className="list-disc list-inside mb-6">
                            {product.filesIncluded.map((file, i) => (
                                <li key={i}>{file}</li>
                            ))}
                        </ul>

                        <h3 className="text-xl font-semibold mb-2" style={{color: 'rgb(46 87 122)'}}>Tính năng nổi
                            bật</h3>
                        <ul className="list-disc list-inside mb-6">
                            {product.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>

                        {product.note && (
                            <p className="text-sm italic mb-6">* {product.note}</p>
                        )}

                        <h3 className="text-xl font-semibold mb-2" style={{color: 'rgb(46 87 122)'}}>Đánh giá sản
                            phẩm</h3>
                        <div className="mb-6">
                            <ProductReviews />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{color: 'rgb(46 87 122)'}}>Thẻ sản phẩm</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm"
                                    style={{backgroundColor: 'rgb(46 87 122)', color: 'rgb(255 255 255)'}}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>


                    </div>
                </div>
                {/* Cột phải */}
                <div className="lg:col-span-4">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                    <div className="p-6 rounded-lg mb-6" style={{
                        backgroundColor: 'rgb(242, 239, 231)',
                        color: 'rgb(41, 115, 178)',
                        border: '1px solid rgb(72, 166, 167)'
                    }}>
                        <p className="text-sm mb-4">
                            Tải không giới hạn với <strong>{product.price} đ</strong>
                        </p>
                        <ul className="text-sm mb-4 list-disc list-inside" style={{color: 'rgb(46 87 122)'}}>
                            <li>Hơn 22 triệu tài nguyên cao cấp</li>
                            <li>Trọn bộ công cụ AI: video, hình ảnh, âm thanh</li>
                            <li>Bản quyền thương mại trọn đời</li>
                            <li>Hủy bất kỳ lúc nào</li>
                        </ul>
                        <button
                            className="w-full py-3 rounded-lg font-medium mb-3 bg-[#2973B2] hover:bg-[rgb(48,139,216)] cursor-pointer transition duration-200"
                            style={{color: 'white'}}>
                            Mua ngay
                        </button>
                        <button
                            className="w-full py-3 rounded-lg font-medium bg-[#48A6A7] hover:bg-[#56cdce] cursor-pointer transition duration-200"
                            style={{color: 'white'}}>
                            Thêm vào giỏ
                        </button>
                    </div>

                    {/* Thông tin thêm */}
                    <div className="text-sm space-y-4">
                        <div>
                            <h4 className="font-semibold mb-1" style={{color: 'rgb(46 87 122)'}}>Hỗ trợ phần mềm</h4>
                            <p>{product.applicationsSupported.join(", ")}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-1" style={{color: 'rgb(46 87 122)'}}>Định dạng tệp</h4>
                            <p>{product.fileTypes.join(", ")}</p>
                        </div>

                        {product.note && (
                            <div>
                                <h4 className="font-semibold mb-1" style={{color: 'rgb(46 87 122)'}}>Ghi chú</h4>
                                <p>{product.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
