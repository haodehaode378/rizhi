import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { books, getBookBySlug, type Book } from "@daily-book/shared";
import { GradientBg } from "../components/GradientBg";

interface QuoteCardProps {
  slug: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ slug }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const book = getBookBySlug(slug) ?? books[0];

  const fadeIn = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slideUp = (start: number, end: number) =>
    interpolate(frame, [start, end], [40, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  return (
    <GradientBg>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 80px",
          opacity: fadeOut,
          gap: 60,
        }}
      >
        {/* Brand */}
        <div
          style={{
            opacity: fadeIn(10, 25),
            fontSize: 24,
            color: "#6b7280",
            letterSpacing: 8,
            fontFamily: "sans-serif",
          }}
        >
          日知
        </div>

        {/* Quote */}
        <div
          style={{
            opacity: fadeIn(30, 60),
            transform: `translateY(${slideUp(30, 60)}px)`,
            fontSize: 52,
            color: "#f59e0b",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: 900,
            fontFamily: "sans-serif",
          }}
        >
          「{book.quote}」
        </div>

        {/* Divider */}
        <div
          style={{
            opacity: fadeIn(80, 100),
            width: 80,
            height: 2,
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />

        {/* Book Info */}
        <div
          style={{
            opacity: fadeIn(100, 130),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
            }}
          >
            《{book.title}》
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#9ca3af",
              fontFamily: "sans-serif",
            }}
          >
            {book.author}
          </div>
        </div>

        {/* One-liner */}
        {book.oneLiner && (
          <div
            style={{
              opacity: fadeIn(150, 180),
              fontSize: 30,
              color: "#d1d5db",
              textAlign: "center",
              maxWidth: 800,
              fontFamily: "sans-serif",
            }}
          >
            {book.oneLiner}
          </div>
        )}
      </div>
    </GradientBg>
  );
};
