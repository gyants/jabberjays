"use client";

import { Scraper, Tweet } from "@the-convocation/twitter-scraper";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const scraper = useMemo(
    () =>
      new Scraper({
        transform: {
          request(input: RequestInfo | URL, init?: RequestInit) {
            if (input instanceof URL) {
              const proxy =
                "https://corsproxy.io/?" +
                encodeURIComponent(input.toString());
              return [proxy, init];
            } else if (typeof input === "string") {
              const proxy =
                "https://corsproxy.io/?" + encodeURIComponent(input);
              return [proxy, init];
            } else {
              throw new Error("Unexpected request input type");
            }
          },
        },
      }),
    [],
  );
  const [tweet, setTweet] = useState<Tweet | null>(null);

  useEffect(() => {
    async function getTweet() {
      const latestTweet = await scraper.getLatestTweet("elonmusk");
      if (latestTweet) {
        setTweet(latestTweet);
      }
    }

    getTweet();
  }, [scraper]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {tweet?.text}
    </main>
  );
}