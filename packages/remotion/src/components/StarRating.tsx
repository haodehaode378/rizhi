import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface StarRatingProps {
  rating: number;
  startFrame: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) return "full";
    if (i === fullStars && hasHalf) return "half";
    return "empty";
  });

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {stars.map((type, i) => {
        const starFrame = Math.max(0, frame - startFrame - i * 8);
        const scale = spring({
          frame: starFrame,
          fps,
          config: { damping: 8, stiffness: 120 },
        });
        const color =
          type === "full"
            ? "#f59e0b"
            : type === "half"
              ? "#f59e0b"
              : "#374151";

        return (
          <div
            key={i}
            style={{
              transform: `scale(${scale})`,
              fontSize: 56,
              lineHeight: 1,
            }}
          >
            {type === "half" ? (
              <span style={{ position: "relative", display: "inline-block" }}>
                <span style={{ color: "#374151" }}>★</span>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    overflow: "hidden",
                    width: "50%",
                    color: "#f59e0b",
                  }}
                >
                  ★
                </span>
              </span>
            ) : (
              <span style={{ color }}>★</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
