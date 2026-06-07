import React from "react";
import { Composition } from "remotion";
import { BookCard } from "./compositions/BookCard";
import { QuoteCard } from "./compositions/QuoteCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BookCard"
        component={BookCard}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          slug: "the-alchemist",
        }}
      />
      <Composition
        id="QuoteCard"
        component={QuoteCard}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          slug: "the-alchemist",
        }}
      />
    </>
  );
};
