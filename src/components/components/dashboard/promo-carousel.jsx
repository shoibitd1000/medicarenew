
import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const promotions = [
  {
    src: "https://placehold.co/800x400.png",
    alt: "Free dental check-up camp this weekend.",
    hint: "dental checkup",
  },
  {
    src: "https://placehold.co/800x400.png",
    alt: "Advanced heart care services now available.",
    hint: "heart care",
  },
  {
    src: "https://placehold.co/800x400.png",
    alt: "Insurance partnership announcement",
    hint: "insurance document",
  },
  {
    src: "https://placehold.co/800x400.png",
    alt: "Monsoon health tips",
    hint: "healthy lifestyle",
  },
];

export default function PromoCarousel() {
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000, 
          stopOnMouseEnter: true,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent>
        {promotions.map((promo, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-[2/1] items-center justify-center p-0 overflow-hidden rounded-lg">
                  <img
                    src={promo.src}
                    alt={promo.alt}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint={promo.hint}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" /> */}
    </Carousel>
  );
}
