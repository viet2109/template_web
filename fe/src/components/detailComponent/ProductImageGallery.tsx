import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import SwiperCore from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import products from "../../data/product.js";
const ProductImageGallery = ({ productId }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

    const product = products.find((p) => p.id === productId);
    const images = product?.images || [];

    return (
        <div className="w-full">
            <div className="w-full aspect-video bg-black overflow-hidden mb-4">
                <Swiper
                    style={{
                        '--swiper-navigation-color': 'rgb(46 87 122)',
                        '--swiper-pagination-color': 'rgb(46 87 122)',
                    } as React.CSSProperties}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="h-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={image.url}
                                alt={image.alt || `Image ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="w-full">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="border rounded overflow-hidden w-full aspect-square">
                                <img
                                    src={image.url}
                                    alt={image.alt || `Thumb ${index}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductImageGallery;
