import { useEffect, useRef, useState } from "react";

const CACHE_NAME = "taskpilot-shell-v1";
const PAYLOAD_CACHE_KEY = "/__share-payload";

export interface SharePayload {
  text: string;
  title: string;
  url: string;
  hasFile: boolean;
  fileName: string | null;
  fileType: string | null;
  receivedAt: string;
}

export function useShareTarget(): SharePayload | null {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) {
      return;
    }
    hasChecked.current = true;

    const url = new URL(window.location.href);
    const wasShared = url.searchParams.get("shared") === "success";

    if (!wasShared) {
      return;
    }

    url.searchParams.delete("shared");
    window.history.replaceState({}, "", url.toString());

    (async () => {
      try {
        if (!("caches" in window)) {
          return;
        }

        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(PAYLOAD_CACHE_KEY);

        if (!cached) {
          return;
        }

        const data = (await cached.json()) as SharePayload;
        setPayload(data);

        await cache.delete(PAYLOAD_CACHE_KEY);
      } catch (error) {
        console.error("Failed to read shared payload:", error);
      }
    })();
  }, []);

  return payload;
}