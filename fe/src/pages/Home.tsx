interface Props {}

const categories = [
    { title: 'Chủ đề WordPress', image: 'src/assets/images/website-template-wordpress.jpg' },
    { title: 'Mẫu Thương mại điện tử', image: 'src/assets/images/website-template-tmdt.jpg' },
    { title: 'Mẫu Trang Web', image: 'src/assets/images/website-template-ui.jpg' },
    { title: 'Mẫu Marketing', image: 'src/assets/images/web-maket.jpg' },
    { title: 'Mẫu CMS', image: 'src/assets/images/web-cms.webp' },
    { title: 'Blog & Viết bài', image: 'src/assets/images/web-blog.webp' },
];

const featuredTemplates = [
    { name: 'Intro', price: '$29', image: '/assets/template1.jpg' },
    { name: 'Joule', price: '$49', image: '/assets/template2.jpg' },
    { name: 'Flock', price: '$39', image: '/assets/template3.jpg' },
    { name: 'MetaLab', price: '$59', image: '/assets/template4.jpg' },
];

function Home(props: Props) {
  const {} = props;

    return (
        <div className="bg-[#F2EFE7] text-gray-800 font-sans">
            {/* Hero */}
            <section className="py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Chủ đề & Mẫu website chuyên nghiệp cho mọi dự án
                </h1>
                <p className="text-gray-600 max-w-xl mx-auto mb-6">
                    Duyệt hàng nghìn mẫu dễ tùy chỉnh từ các nhà phát triển hàng đầu thế giới.
                </p>
                <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-6 py-2 rounded transition">
                    Xem tất cả mẫu
                </button>
            </section>

            {/* Danh mục */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-4 text-center hover:shadow-lg transition">
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-40 object-cover rounded mb-3"
                            />
                            <h3 className="font-semibold text-lg mb-1">{cat.title}</h3>
                            <p className="text-sm text-gray-500">Hàng ngàn mẫu có sẵn</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-5 py-2 rounded">
                        Xem tất cả danh mục
                    </button>
                </div>
            </section>

            {/* Gói đăng ký Envato */}
            <section className="bg-white py-16 text-center">
                <h2 className="text-2xl font-bold mb-3">Gói đăng ký sáng tạo duy nhất bạn cần</h2>
                <p className="text-gray-600 max-w-xl mx-auto mb-4">
                    Truy cập hàng triệu chủ đề, font, plugin, ảnh & hơn thế nữa với một gói duy nhất.
                </p>
                <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-6 py-2 rounded">
                    Dùng thử miễn phí
                </button>
            </section>

            {/* Mẫu nổi bật */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Mẫu nổi bật</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredTemplates.map((tpl, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-4 hover:shadow-lg transition">
                            <img src={tpl.image} alt={tpl.name} className="h-36 w-full object-cover rounded mb-3" />
                            <h4 className="font-medium mb-1">{tpl.name}</h4>
                            <p className="text-sm text-gray-500">Mẫu chuyên nghiệp</p>
                            <span className="text-sm font-semibold text-green-600">{tpl.price}</span>
                            <div className="mt-3">
                                <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-4 py-1 rounded">
                                    Xem trước
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tác giả nổi bật */}
            <section className="bg-[#F2EFE7] px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Tác giả nổi bật</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((_, idx) => (
                            <div key={idx} className="bg-white rounded shadow p-4 hover:shadow-lg transition">
                                <div className="h-40 bg-gray-200 rounded mb-3" />
                                <h4 className="font-medium mb-1">Dreamst-Solution #{idx + 1}</h4>
                                <p className="text-sm text-gray-500">Top tác giả trong tuần</p>
                                <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-4 py-1 rounded mt-2">
                                    Xem mẫu
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mẫu mới nhất */}
            <section className="px-4 py-12 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-6">Khám phá các mẫu mới nhất</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, idx) => (
                            <div key={idx} className="bg-white rounded shadow p-4 hover:shadow-lg transition">
                                <div className="h-32 bg-gray-200 rounded mb-3" />
                                <h4 className="font-medium mb-1">Mẫu mới #{idx + 1}</h4>
                                <p className="text-sm text-gray-500">Danh mục</p>
                                <span className="text-sm font-semibold text-green-600">$19</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-5 py-2 rounded">
                            Xem thêm mẫu
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA đăng ký cuối trang */}
            <section className="py-12 bg-[#F2EFE7] text-center px-4">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Tìm mẫu không giới hạn?</h2>
                <p className="text-gray-600 mb-6">
                    Truy cập hơn 2 triệu tài nguyên với gói đăng ký INFINITY Elements.
                </p>
                <button className="bg-[#2973B2] hover:bg-blue-600 text-white px-6 py-2 rounded transition">
                    Dùng thử miễn phí
                </button>
            </section>
        </div>
    );
}

export default Home;
