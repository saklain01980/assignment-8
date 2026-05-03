"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Avid Reader",
    quote: "BookNest has completely transformed my reading experience. I can browse and borrow books from anywhere, anytime. The collection is amazing!",
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Tech Enthusiast",
    quote: "The tech book collection here is outstanding. I've found resources that helped me level up my programming skills significantly.",
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Science Student",
    quote: "As a science student, having access to such a diverse collection of scientific literature is invaluable. BookNest makes learning effortless.",
    avatar: "ER",
  },
  {
    name: "David Kim",
    role: "Book Club Leader",
    quote: "Our book club relies on BookNest for all our reading selections. The platform is intuitive and the borrowing process is seamless.",
    avatar: "DK",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            What Readers Say
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join thousands of happy readers who have discovered their next favorite book on BookNest
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="pb-14"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="glass-card p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                    <p className="text-indigo-400 text-xs">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
