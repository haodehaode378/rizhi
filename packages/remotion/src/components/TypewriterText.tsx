import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  speed?: number;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  speed = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.floor(elapsed / speed);
  const visibleText = text.slice(0, charCount);

  const cursorOpacity =
    charCount < text.length ? (frame % 20 < 10 ? 1 : 0) : 0;

  return (
    <div style={{ ...style, minHeight: "1em" }}>
      {visibleText}
      <span
        style={{
          opacity: cursorOpacity,
          color: style?.color || "#f59e0b",
          fontWeight: 300,
        }}
      >
        |
      </span>
    </div>
  );
};
