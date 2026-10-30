// Lưu sẵn mọi file để mở không cần mạng; thêm 2 dòng đầu cô lập (COOP/COEP) để trình duyệt cho chạy nhiều luồng.
const V = "autoedit-a7a98b4d28", FILES = ["./fonts/BeVietnamPro-Black.ttf", "./fonts/BeVietnamPro-Bold.ttf", "./fonts/BeVietnamPro-Medium.ttf", "./fonts/BeVietnamPro-SemiBold.ttf", "./fonts/Montserrat-VF.ttf", "./fonts/PlayfairDisplay-Italic-VF.ttf", "./fonts/baloo-2-latin-700-normal.woff2", "./fonts/baloo-2-latin-ext-700-normal.woff2", "./fonts/baloo-2-vietnamese-700-normal.woff2", "./fonts/charm-latin-700-normal.woff2", "./fonts/charm-latin-ext-700-normal.woff2", "./fonts/charm-vietnamese-700-normal.woff2", "./fonts/comfortaa-latin-700-normal.woff2", "./fonts/comfortaa-latin-ext-700-normal.woff2", "./fonts/comfortaa-vietnamese-700-normal.woff2", "./fonts/dancing-script-latin-700-normal.woff2", "./fonts/dancing-script-latin-ext-700-normal.woff2", "./fonts/dancing-script-vietnamese-700-normal.woff2", "./fonts/itim-latin-400-normal.woff2", "./fonts/itim-latin-ext-400-normal.woff2", "./fonts/itim-vietnamese-400-normal.woff2", "./fonts/lexend-latin-700-normal.woff2", "./fonts/lexend-latin-ext-700-normal.woff2", "./fonts/lexend-vietnamese-700-normal.woff2", "./fonts/lobster-latin-400-normal.woff2", "./fonts/lobster-latin-ext-400-normal.woff2", "./fonts/lobster-vietnamese-400-normal.woff2", "./fonts/nunito-latin-800-normal.woff2", "./fonts/nunito-latin-ext-800-normal.woff2", "./fonts/nunito-vietnamese-800-normal.woff2", "./fonts/pacifico-latin-400-normal.woff2", "./fonts/pacifico-latin-ext-400-normal.woff2", "./fonts/pacifico-vietnamese-400-normal.woff2", "./fonts/patrick-hand-latin-400-normal.woff2", "./fonts/patrick-hand-latin-ext-400-normal.woff2", "./fonts/patrick-hand-vietnamese-400-normal.woff2", "./fonts/quicksand-latin-700-normal.woff2", "./fonts/quicksand-latin-ext-700-normal.woff2", "./fonts/quicksand-vietnamese-700-normal.woff2", "./icon.png", "./index.html", "./lib/mp4-muxer.js", "./lib/ort-wasm-simd-threaded.mjs", "./lib/ort-wasm-simd-threaded.wasm", "./lib/ort.wasm.min.mjs", "./lib/rnnoise.mjs", "./manifest.json", "./mo_hinh/cfg.json", "./mo_hinh/voc.json", "./nhac/1A.mp3", "./nhac/1B.mp3", "./nhac/1C.mp3", "./nhac/2A.mp3", "./nhac/2B.mp3", "./nhac/2C.mp3", "./nhac/3A.mp3", "./nhac/3B.mp3", "./nhac/3C.mp3", "./nhac/4A.mp3", "./nhac/4B.mp3", "./nhac/4C.mp3", "./nhac/5A.mp3", "./nhac/5B.mp3", "./nhac/5C.mp3", "./nhac/6A.mp3", "./nhac/6B.mp3", "./nhac/6C.mp3", "./phan_1/mo_hinh/enc_0.bin", "./phan_1/mo_hinh/enc_1.bin", "./phan_1/mo_hinh/enc_2.bin", "./phan_1/mo_hinh/enc_3.bin", "./phan_2/mo_hinh/enc_4.bin", "./phan_2/mo_hinh/enc_5.bin", "./phan_2/mo_hinh/enc_6.bin", "./phan_2/mo_hinh/enc_7.bin", "./phan_3/mo_hinh/enc_10.bin", "./phan_3/mo_hinh/enc_11.bin", "./phan_3/mo_hinh/enc_8.bin", "./phan_3/mo_hinh/enc_9.bin", "./phan_4/mo_hinh/dec_0.bin", "./phan_4/mo_hinh/dec_1.bin", "./phan_4/mo_hinh/dec_2.bin", "./phan_4/mo_hinh/dec_3.bin", "./phan_5/mo_hinh/dec_4.bin", "./phan_5/mo_hinh/dec_5.bin", "./phan_5/mo_hinh/dec_6.bin", "./phan_5/mo_hinh/dec_7.bin", "./phan_6/mo_hinh/dec_10.bin", "./phan_6/mo_hinh/dec_11.bin", "./phan_6/mo_hinh/dec_8.bin", "./phan_6/mo_hinh/dec_9.bin", "./phan_7/mo_hinh/dec_12.bin", "./phan_7/mo_hinh/dec_13.bin", "./phan_7/mo_hinh/dec_14.bin"];
const iso = r => {
  if (!r || r.type === "opaque" || r.status === 0) return r;
  const h = new Headers(r.headers);
  h.set("Cross-Origin-Opener-Policy", "same-origin"); h.set("Cross-Origin-Embedder-Policy", "require-corp"); h.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
};
self.addEventListener("install", e => e.waitUntil((async () => {
  const c = await caches.open(V);
  // trang + thư viện trước (nhỏ), bộ nghe để trang tự tải khi dùng (có thanh tiến độ)
  for (const f of FILES.filter(f => !f.includes("/mo_hinh/") || f.endsWith(".json"))) { if (!(await c.match(f))) { try { await c.add(f); } catch (err) { } } }
  self.skipWaiting();
})()));
self.addEventListener("activate", e => e.waitUntil((async () => {
  const c = await caches.open(V);
  for (const k of await caches.keys()) if (k.startsWith("autoedit-") && k !== V) {
    // chuyển phần bộ nghe đã tải ở bản cũ sang (không tải lại 300 MB khi chỉ sửa trang)
    const old = await caches.open(k);
    for (const req of await old.keys()) if (req.url.includes("/mo_hinh/") && req.url.endsWith(".bin") && !(await c.match(req))) { const r = await old.match(req); if (r) await c.put(req, r); }
    await caches.delete(k);
  }
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(V), p = u.pathname.endsWith("/") ? u.pathname + "index.html" : u.pathname;
    const hit = await c.match(p, { ignoreSearch: true });
    if (hit) return iso(hit);
    try { const r = await fetch(e.request); if (r.ok) c.put(p, r.clone()); return iso(r); }
    catch (err) { const h = await c.match("index.html"); return h ? iso(h) : Response.error(); }
  })());
});
