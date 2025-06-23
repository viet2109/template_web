import {
    Facebook,
    Twitter,
    YouTube,
    Instagram,
    Pinterest,
} from '@mui/icons-material';
interface Props {}

function Footer(props: Props) {
    const {} = props;

    return (
        <footer className="bg-[#2973B2] text-white text-sm pt-10">
            <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
                <div>
                    <h3 className="font-semibold mb-3">INFINITY MARKET</h3>
                    <ul className="space-y-2 text-[rgb(242,239,231)]">
                        <li><a href="#">Điều khoản</a></li>
                        <li><a href="#">Bản quyền</a></li>
                        <li><a href="#">API thị trường</a></li>
                        <li><a href="#">Trở thành đối tác</a></li>
                        <li><a href="#">Cookies</a></li>
                        <li><a href="#">Cài đặt cookie</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">HỖ TRỢ</h3>
                    <ul className="space-y-2 text-[rgb(242,239,231)]">
                        <li><a href="#">Trung tâm trợ giúp</a></li>
                        <li><a href="#">Tác giả</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">CỘNG ĐỒNG</h3>
                    <ul className="space-y-2 text-[rgb(242,239,231)]">
                        <li><a href="#">Cộng đồng</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Diễn đàn</a></li>
                        <li><a href="#">Gặp mặt</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">GIỚI THIỆU INFINITY</h3>
                    <ul className="space-y-2 text-[rgb(242,239,231)]">
                        <li><a href="#">Về INFINITY</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                        <li><a href="#">Không bán hoặc chia sẻ thông tin cá nhân</a></li>
                        <li><a href="#">Sơ đồ website</a></li>
                    </ul>
                </div>

                <div className="text-white text-right">
                    <div className="font-bold text-xl">INFINITY TEMPLATE</div>
                    <div className="text-[rgb(242,239,231)] mt-2">
                        <div>76.947.838 sản phẩm đã bán</div>
                        <div>$1.203.989.253 doanh thu cộng đồng</div>
                    </div>
                    <div className="mt-4 flex flex-col items-end gap-4">
                        <img src="/logo.png" alt="INFINITY Logo" className="w-12"/>
                        <div className="flex gap-2">
                            <a href="#"
                               className="bg-[rgb(242,239,231)] rounded-full w-8 h-8 flex items-center justify-center">
                                <Twitter fontSize="small" sx={{color: '#2973B2'}}/>
                            </a>
                            <a href="#"
                               className="bg-[rgb(242,239,231)] rounded-full w-8 h-8 flex items-center justify-center">
                                <Facebook fontSize="small" sx={{color: '#2973B2'}}/>
                            </a>
                            <a href="#"
                               className="bg-[rgb(242,239,231)] rounded-full w-8 h-8 flex items-center justify-center">
                                <YouTube fontSize="small" sx={{color: '#2973B2'}}/>
                            </a>
                            <a href="#"
                               className="bg-[rgb(242,239,231)] rounded-full w-8 h-8 flex items-center justify-center">
                                <Instagram fontSize="small" sx={{color: '#2973B2'}}/>
                            </a>
                            <a href="#"
                               className="bg-[rgb(242,239,231)] rounded-full w-8 h-8 flex items-center justify-center">
                                <Pinterest fontSize="small" sx={{color: '#2973B2'}}/>
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <div className="border-t border-white/30 mt-10 pt-6 pb-4 text-[rgb(242,239,231)] text-xs text-center">
                <div className="flex flex-wrap justify-center gap-4 mb-3">
                    <a href="#">Infinity.com</a>
                    <a href="#">Infinity Elements</a>
                    <a href="#">Placed by Infinity</a>
                    <a href="#">Infinity Tuts+</a>
                    <a href="#">Tất cả sản phẩm</a>
                    <a href="#">Sơ đồ website</a>
                </div>
                <p>Giá tính theo USD và chưa bao gồm thuế và phí.</p>
                <p className="mt-1">© 2025 INFINITY. Thương hiệu và bản quyền thuộc về chủ sở hữu tương ứng.</p>
                <div className="flex justify-center gap-4 mt-4 text-white">
                    <i className="fab fa-facebook-f"></i>
                    <i className="fab fa-twitter"></i>
                    <i className="fab fa-youtube"></i>
                    <i className="fab fa-instagram"></i>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
