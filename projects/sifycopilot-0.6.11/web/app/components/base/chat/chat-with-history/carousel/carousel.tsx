import React, { useEffect } from 'react'
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'
import './carousel.css'
import { CarouselImage } from '../../../features/types'
import { PUBLIC_API_PREFIX } from '@/config'

type CarouselProps = {
    onCardClick: (question: string) => void
    carouselImages: CarouselImage[]
}

const Carousel: React.FC<CarouselProps> = ({
    onCardClick,
    carouselImages


}) => {
    return (
        <div className="carousel-container">
            <SwiperComponent
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                // slidesPerView={3}
                slidesPerView={carouselImages.length < 3 ? carouselImages.length : 3}
                loop={true}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}

                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                initialSlide={1}
                modules={[EffectCoverflow, Pagination, Autoplay]}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    768: {
                        // slidesPerView: 3,
                        slidesPerView: carouselImages.length < 3 ? carouselImages.length : 3,
                    },
                    1024: {
                        // slidesPerView: 3,
                        slidesPerView: carouselImages.length < 3 ? carouselImages.length : 3,
                    },
                }}
                className="mySwiper"
            >
                {carouselImages.map((card) => (
                    <SwiperSlide key={card.imageId} onClick={() => onCardClick(card.question || '')}>
                        <div className='carousel-card'>
                            <img src={`${PUBLIC_API_PREFIX.replace('api', 'files')}/carousel-images/${card.imageId}/image-preview`} alt={`Slide ${card.imageId}`} />
                            <div className='carousel-question'>
                                {card.question || 'No question available'}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </SwiperComponent>
        </div>
    )
}

export default Carousel
