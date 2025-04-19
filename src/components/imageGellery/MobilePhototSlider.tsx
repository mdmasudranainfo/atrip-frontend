// components/EmblaCarousel.tsx
"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface Props {
  slides: any;
  showGallery: boolean;
  setShowGallery: Dispatch<SetStateAction<boolean>>;
}

const MobilePhototSlider: React.FC<Props> = ({
  slides,
  showGallery,
  setShowGallery,
}: any) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          {slides.map((slider: any, index: number) => (
            <div className="min-w-full relative aspect-video" key={index}>
              <Image
                src={slider.large}
                alt={`Slide ${index}`}
                layout="fill"
                objectFit="cover"
                onClick={() => setShowGallery(true)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex justify-center mt-4 gap-2">
        {slides.map((_: any, index: number) => (
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
