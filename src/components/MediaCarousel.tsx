"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
}

interface MediaCarouselProps {
  items: MediaItem[];
}

export default function MediaCarousel({ items }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === items.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!items || items.length === 0) {
    return (
      <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No hay contenido multimedia disponible.</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-96 group rounded-2xl overflow-hidden shadow-xl bg-black">
      {/* Media Content */}
      <div className="w-full h-full relative flex items-center justify-center">
        {currentItem.type === "video" ? (
          <video
            src={currentItem.src}
            className="w-full h-full object-contain"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={currentItem.src}
              alt={currentItem.alt || "Imagen de galería"}
              fill
              className="object-contain"
              priority={currentIndex === 0}
            />
          </div>
        )}
      </div>

      {/* Left Arrow */}
      <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all z-10" onClick={prevSlide}>
        <ChevronLeft size={30} />
      </div>

      {/* Right Arrow */}
      <div className="absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/50 transition-all z-10" onClick={nextSlide}>
        <ChevronRight size={30} />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-10">
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
