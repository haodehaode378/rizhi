import React from "react";
import { interpolate, useCurrentFrame, Easing, spring, useVideoConfig } from "remotion";

interface BookCoverProps {
  src: string;
  title: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ src, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const translateX = interpolate(frame, [0, 40], [-300, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const shadowOpacity = interpolate(frame, [0, 40], [0, 0.5], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        transform: `translateX(${translateX}px) scale(${scale})`,
        width: 420,
        height: 600,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: `20px 20px 60px rgba(0,0,0,${shadowOpacity})`,
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
};
