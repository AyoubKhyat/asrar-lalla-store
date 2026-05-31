"use client";

import React from "react";

interface LogoProps {
  variant?: "full" | "icon" | "wordmark";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "pink" | "white" | "dark";
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, fullH: 28, fontSize: 8, spacing: 3 },
  md: { icon: 32, fullH: 36, fontSize: 10, spacing: 4 },
  lg: { icon: 40, fullH: 44, fontSize: 13, spacing: 5 },
  xl: { icon: 56, fullH: 60, fontSize: 18, spacing: 7 },
};

const colorMap = {
  pink: "#FF5FA2",
  white: "#FFFFFF",
  dark: "#1A1A2E",
};

function FlowerIcon({ size, fill }: { size: number; fill: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top petal */}
      <ellipse
        cx="32"
        cy="18"
        rx="10"
        ry="16"
        fill={fill}
        opacity="0.9"
      />
      {/* Right petal */}
      <ellipse
        cx="46"
        cy="32"
        rx="16"
        ry="10"
        fill={fill}
        opacity="0.85"
      />
      {/* Bottom petal */}
      <ellipse
        cx="32"
        cy="46"
        rx="10"
        ry="16"
        fill={fill}
        opacity="0.8"
      />
      {/* Left petal */}
      <ellipse
        cx="18"
        cy="32"
        rx="16"
        ry="10"
        fill={fill}
        opacity="0.85"
      />
      {/* Top-right petal (diagonal) */}
      <ellipse
        cx="42"
        cy="22"
        rx="8"
        ry="13"
        transform="rotate(45 42 22)"
        fill={fill}
        opacity="0.7"
      />
      {/* Bottom-right petal (diagonal) */}
      <ellipse
        cx="42"
        cy="42"
        rx="8"
        ry="13"
        transform="rotate(-45 42 42)"
        fill={fill}
        opacity="0.65"
      />
      {/* Bottom-left petal (diagonal) */}
      <ellipse
        cx="22"
        cy="42"
        rx="8"
        ry="13"
        transform="rotate(45 22 42)"
        fill={fill}
        opacity="0.65"
      />
      {/* Top-left petal (diagonal) */}
      <ellipse
        cx="22"
        cy="22"
        rx="8"
        ry="13"
        transform="rotate(-45 22 22)"
        fill={fill}
        opacity="0.7"
      />
      {/* Center circle */}
      <circle cx="32" cy="32" r="7" fill={fill} />
      {/* Inner highlight dot */}
      <circle
        cx="30"
        cy="30"
        r="3"
        fill="white"
        opacity="0.35"
      />
    </svg>
  );
}

function Wordmark({
  height,
  fontSize,
  spacing,
  fill,
}: {
  height: number;
  fontSize: number;
  spacing: number;
  fill: string;
}) {
  const textWidth = fontSize * 7.2;
  return (
    <svg
      width={textWidth}
      height={height}
      viewBox={`0 0 ${textWidth} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={fill}
        fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="300"
        fontSize={fontSize}
        letterSpacing={spacing}
      >
        ASRAR LALLA
      </text>
    </svg>
  );
}

export default function Logo({
  variant = "full",
  size = "md",
  color = "pink",
  className = "",
}: LogoProps) {
  const dims = sizeMap[size];
  const fill = colorMap[color];

  if (variant === "icon") {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <FlowerIcon size={dims.icon} fill={fill} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Wordmark
          height={dims.fullH}
          fontSize={dims.fontSize}
          spacing={dims.spacing}
          fill={fill}
        />
      </span>
    );
  }

  // Full variant: icon + wordmark
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <FlowerIcon size={dims.icon} fill={fill} />
      <Wordmark
        height={dims.fullH}
        fontSize={dims.fontSize}
        spacing={dims.spacing}
        fill={fill}
      />
    </span>
  );
}
