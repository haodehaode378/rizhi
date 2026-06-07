import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { books, getBookBySlug, type Book } from "@daily-book/shared";
import { GradientBg } from "../components/GradientBg";
import { BookCover } from "../components/BookCover";
import { TypewriterText } from "../components/TypewriterText";
import { StarRating } from "../components/StarRating";

interface BookCardProps {
  slug: string;
}

export const BookCard: React.FC<BookCardProps> = ({ slug }) => {
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
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const summaryOpacity = fadeIn(195, 225);
  const genreOpacity = fadeIn(165, 185);

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
          padding: "80px 60px",
          opacity: fadeOut,
          gap: 48,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: fadeIn(15, 30),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#9ca3af",
              letterSpacing: 8,
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            每日一本好书
          </div>
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Book Cover */}
        <Sequence from={30}>
          <BookCover src={book.cover} title={book.title} />
        </Sequence>

        {/* Book Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            maxWidth: 900,
          }}
        >
          {/* Title */}
          <TypewriterText
            text={book.title}
            startFrame={90}
            speed={3}
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          />

          {/* Author */}
          <div
            style={{
              opacity: fadeIn(150, 165),
              fontSize: 32,
              color: "#d1d5db",
              fontFamily: "sans-serif",
            }}
          >
            {book.author}
          </div>

          {/* Genre Tag */}
          <div
            style={{
              opacity: genreOpacity,
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: 20,
              padding: "8px 24px",
              fontSize: 26,
              color: "#f59e0b",
              fontFamily: "sans-serif",
            }}
          >
            {book.genre}
          </div>

          {/* Star Rating */}
          <Sequence from={150}>
            <StarRating rating={book.rating} startFrame={0} />
          </Sequence>

          {/* Summary */}
          <div
            style={{
              opacity: summaryOpacity,
              fontSize: 34,
              color: "#e5e7eb",
              textAlign: "center",
              lineHeight: 1.6,
              fontFamily: "sans-serif",
            }}
          >
            {book.summary}
          </div>

          {/* Quote */}
          <Sequence from={240}>
            <div
              style={{
                opacity: fadeIn(0, 20),
                fontSize: 30,
                color: "#f59e0b",
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.6,
                padding: "24px 40px",
                borderLeft: "4px solid #f59e0b",
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: "0 12px 12px 0",
                fontFamily: "sans-serif",
              }}
            >
              「{book.quote}」
            </div>
          </Sequence>
        </div>

        {/* Footer */}
        <div
          style={{
            opacity: fadeIn(260, 280),
            fontSize: 24,
            color: "#6b7280",
            fontFamily: "sans-serif",
          }}
        >
          {book.date}
        </div>
      </div>
    </GradientBg>
  );
};
