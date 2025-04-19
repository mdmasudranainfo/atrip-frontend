// components/EmblaCarousel.tsx
"use client";

import React, { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

type Props = {
  slides: string[]; // array of image URLs
};

const MobilePhototSlider: React.FC<Props> = ({ slides }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  console.log("slides", slides);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slider: any, index) => (
            <div className="min-w-full relative aspect-video" key={index}>
              <Image
                src={slider.large}
                alt={`Slide ${index}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center mt-4 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full ${
              index === selectedIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobilePhototSlider;
