import React, {useState} from 'react';
import { FaHeart, FaDownload } from 'react-icons/fa';

const products = [
    {
        id: 1,
        name: 'Catalog template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/9b4c98e8-9154-4228-8529-98efd1ba56f5?w=710&cf_fit=scale-down&q=85&format=auto&s=55735dbfa3d863f0ed846f2827bd17e86654266ae60d592a59707335c490095c'
    },
    {
        id: 2,
        name: 'Carousel template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/6b08f161-9be0-4382-9281-529bff06d38a?w=710&cf_fit=scale-down&q=85&format=auto&s=ec91015e500daeb3f93bd440ff8eef869bf1bfce08712230335abfd75de371f5'
    },
    {
        id: 3,
        name: 'Maketing template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/465f7745-549b-404d-8c12-6ae844b1782b?w=710&cf_fit=scale-down&q=85&format=auto&s=449309aa23d6a281d8a58561de83fa3045bc12afee47b21954af7705722e3360'
    },
    {
        id: 4,
        name: 'Brand Guide template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/3afe0273-dd8c-4d61-a415-5db522f9dc14?w=710&cf_fit=scale-down&q=85&format=auto&s=199cc91ec8eb6c89bb726acaf711cec40b534afc8355b2c7f57335b581bc9667'
    },
    {
        id: 5,
        name: 'Catalog template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/9b4c98e8-9154-4228-8529-98efd1ba56f5?w=710&cf_fit=scale-down&q=85&format=auto&s=55735dbfa3d863f0ed846f2827bd17e86654266ae60d592a59707335c490095c'
    },
    {
        id: 6,
        name: 'Carousel template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/6b08f161-9be0-4382-9281-529bff06d38a?w=710&cf_fit=scale-down&q=85&format=auto&s=ec91015e500daeb3f93bd440ff8eef869bf1bfce08712230335abfd75de371f5'
    },
    {
        id: 7,
        name: 'Maketing template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/465f7745-549b-404d-8c12-6ae844b1782b?w=710&cf_fit=scale-down&q=85&format=auto&s=449309aa23d6a281d8a58561de83fa3045bc12afee47b21954af7705722e3360'
    },
    {
        id: 8,
        name: 'Brand Guide template',
        image: 'https://elements-resized.envatousercontent.com/elements-cover-images/3afe0273-dd8c-4d61-a415-5db522f9dc14?w=710&cf_fit=scale-down&q=85&format=auto&s=199cc91ec8eb6c89bb726acaf711cec40b534afc8355b2c7f57335b581bc9667'
    },
];

const ProductGrid: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIdx = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIdx, startIdx + productsPerPage);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    return (
        <div className="space-y-8">
            {/* Grid sản phẩm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg shadow hover:shadow-lg transition-all">
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="flex space-x-4">
                            <button className="text-white hover:text-red-400">
                                <FaHeart />
                            </button>
                            <button className="text-white hover:text-green-400">
                                <FaDownload />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-6">
                {/* Mũi tên trái */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded border text-sm font-medium transition duration-200 flex items-center justify-center
            ${currentPage === 1
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'text-[rgb(46,87,122)] border-[rgb(46,87,122)] hover:bg-[#2973B2] hover:text-white'}
        `}
                >
                    ‹
                </button>

                {/* Số trang */}
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded border text-base font-semibold transition duration-200 flex items-center justify-center
                ${page === currentPage
                            ? 'bg-[#2973B2] text-white'
                            : 'text-[rgb(46,87,122)] border-[rgb(46,87,122)] hover:bg-[#2973B2] hover:text-white'}
            `}
                    >
                        {page}
                    </button>
                ))}

                {/* Mũi tên phải */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded border text-sm font-medium transition duration-200 flex items-center justify-center
            ${currentPage === totalPages
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'text-[rgb(46,87,122)] border-[rgb(46,87,122)] hover:bg-[#2973B2] hover:text-white'}
        `}
                >
                    ›
                </button>
            </div>

        </div>
    );
};

export default ProductGrid;
