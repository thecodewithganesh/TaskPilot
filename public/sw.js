const CACHE_NAME = "taskpilot-shell-v1";

self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  const isShareTargetPost =
    event.request.method === "POST" && url.pathname === "/share-target/";

  if (!isShareTargetPost) {
    return;
  }

  event.respondWith(
    (async () => {
      const formData = await event.request.formData();

      const sharedText = formData.get("text") || "";
      const sharedTitle = formData.get("title") || "";
      const sharedUrl = formData.get("link") || "";
      const sharedFile = formData.get("media");

      const payload = {
        text: sharedText,
        title: sharedTitle,
        url: sharedUrl,
        hasFile: Boolean(sharedFile),
        fileName: sharedFile && sharedFile.name ? sharedFile.name : null,
        fileType: sharedFile && sharedFile.type ? sharedFile.type : null,
        receivedAt: new Date().toISOString(),
      };

      const allClients = await self.clients.matchAll({ type: "window" });
      for (const client of allClients) {
        client.postMessage({ type: "SHARE_TARGET_RECEIVED", payload });
      }

      const cache = await caches.open(CACHE_NAME);
      await cache.put(
        "/__share-payload",
        new Response(JSON.stringify(payload), {
          headers: { "Content-Type": "application/json" },
        }),
      );

      return Response.redirect("/?shared=success", 303);
    })(),
  );
});