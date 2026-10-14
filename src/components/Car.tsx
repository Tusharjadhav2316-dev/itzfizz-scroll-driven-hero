"use client";

import React from "react";
import Image from "next/image";
import { CarProps } from "@/types";

export const Car: React.FC<CarProps> = ({
  id = "car",
  className = "",
  variant = "mclaren",
}) => {
  const isMcLaren = variant === "mclaren";
  const imageSrc = isMcLaren
    ? "/images/mclaren-720s.png"
    : "/images/sports-car-side.svg";

  return (
    <div
      id={id}
      className={`car relative z-20 flex items-center justify-center select-none pointer-events-none will-change-transform ${className}`}
      style={{ filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.6))" }}
    >
      <div className="relative w-[180px] h-[90px] sm:w-[220px] sm:h-[110px] md:w-[280px] md:h-[140px] lg:w-[320px] lg:h-[155px]">
        <Image
          src={imageSrc}
          alt={isMcLaren ? "McLaren 720S Sports Car" : "Supercar Side Silhouette"}
          fill
          priority
          sizes="(max-width: 640px) 180px, (max-width: 768px) 220px, 320px"
          className="object-contain object-center drop-shadow-md"
        />
      </div>
    </div>
  );
};

export default Car;
