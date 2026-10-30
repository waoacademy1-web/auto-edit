// Lưu sẵn mọi file để mở không cần mạng; thêm 2 dòng đầu cô lập (COOP/COEP) để trình duyệt cho chạy nhiều luồng.
const V = "autoedit-81c4711dfe", FILES = ["./fonts/BeVietnamPro-Black.ttf", "./fonts/BeVietnamPro-Bold.ttf", "./fonts/BeVietnamPro-Medium.ttf", "./fonts/BeVietnamPro-SemiBold.ttf", "./fonts/Montserrat-VF.ttf", "./fonts/PlayfairDisplay-Italic-VF.ttf", "./fonts/baloo-2-latin-700-normal.woff2", "./fonts/baloo-2-latin-ext-700-normal.woff2", "./fonts/baloo-2-vietnamese-700-normal.woff2", "./fonts/charm-latin-700-normal.woff2", "./fonts/charm-latin-ext-700-normal.woff2", "./fonts/charm-vietnamese-700-normal.woff2", "./fonts/comfortaa-latin-700-normal.woff2", "./fonts/comfortaa-latin-ext-700-normal.woff2", "./fonts/comfortaa-vietnamese-700-normal.woff2", "./fonts/dancing-script-latin-700-normal.woff2", "./fonts/dancing-script-latin-ext-700-normal.woff2", "./fonts/dancing-script-vietnamese-700-normal.woff2", "./fonts/itim-latin-400-normal.woff2", "./fonts/itim-latin-ext-400-normal.woff2", "./fonts/itim-vietnamese-400-normal.woff2", "./fonts/lexend-latin-700-normal.woff2", "./fonts/lexend-latin-ext-700-normal.woff2", "./fonts/lexend-vietnamese-700-normal.woff2", "./fonts/lobster-latin-400-normal.woff2", "./fonts/lobster-latin-ext-400-normal.woff2", "./fonts/lobster-vietnamese-400-normal.woff2", "./fonts/nunito-latin-800-normal.woff2", "./fonts/nunito-latin-ext-800-normal.woff2", "./fonts/nunito-vietnamese-800-normal.woff2", "./fonts/pacifico-latin-400-normal.woff2", "./fonts/pacifico-latin-ext-400-normal.woff2", "./fonts/pacifico-vietnamese-400-normal.woff2", "./fonts/patrick-hand-latin-400-normal.woff2", "./fonts/patrick-hand-latin-ext-400-normal.woff2", "./fonts/patrick-hand-vietnamese-400-normal.woff2", "./fonts/quicksand-latin-700-normal.woff2", "./fonts/quicksand-latin-ext-700-normal.woff2", "./fonts/quicksand-vietnamese-700-normal.woff2", "./icon.png", "./index.html", "./lib/mp4-muxer.js", "./lib/ort-wasm-simd-threaded.mjs", "./lib/ort-wasm-simd-threaded.wasm", "./lib/ort.wasm.min.mjs", "./lib/rnnoise.mjs", "./manifest.json", "./mau/chua_lanh.jpg", "./mau/chua_lanh.mp4", "./mau/co_ban.jpg", "./mau/co_ban.mp4", "./mau/giat_tit.jpg", "./mau/giat_tit.mp4", "./mo_hinh/cfg.json", "./mo_hinh/voc.json", "./nghe_1_enc_00.bin", "./nghe_1_enc_01.bin", "./nghe_1_enc_02.bin", "./nghe_1_enc_03.bin", "./nghe_2_enc_04.bin", "./nghe_2_enc_05.bin", "./nghe_2_enc_06.bin", "./nghe_2_enc_07.bin", "./nghe_3_enc_08.bin", "./nghe_3_enc_09.bin", "./nghe_3_enc_10.bin", "./nghe_3_enc_11.bin", "./nghe_4_dec_00.bin", "./nghe_4_dec_01.bin", "./nghe_4_dec_02.bin", "./nghe_4_dec_03.bin", "./nghe_5_dec_04.bin", "./nghe_5_dec_05.bin", "./nghe_5_dec_06.bin", "./nghe_5_dec_07.bin", "./nghe_6_dec_08.bin", "./nghe_6_dec_09.bin", "./nghe_6_dec_10.bin", "./nghe_6_dec_11.bin", "./nghe_7_dec_12.bin", "./nghe_7_dec_13.bin", "./nghe_7_dec_14.bin", "./nhac/1A.mp3", "./nhac/1B.mp3", "./nhac/1C.mp3", "./nhac/2A.mp3", "./nhac/2B.mp3", "./nhac/2C.mp3", "./nhac/3A.mp3", "./nhac/3B.mp3", "./nhac/3C.mp3", "./nhac/4A.mp3", "./nhac/4B.mp3", "./nhac/4C.mp3", "./nhac/5A.mp3", "./nhac/5B.mp3", "./nhac/5C.mp3", "./nhac/6A.mp3", "./nhac/6B.mp3", "./nhac/6C.mp3"];
const iso = r => {
  if (!r || r.type === "opaque" || r.status === 0) return r;
  const h = new Headers(r.headers);
  h.set("Cross-Origin-Opener-Policy", "same-origin"); h.set("Cross-Origin-Embedder-Policy", "require-corp"); h.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
};
self.addEventListener("install", e => e.waitUntil((async () => {
  const c = await caches.open(V);
  // trang + thư viện trước (nhỏ), bộ nghe để trang tự tải khi dùng (có thanh tiến độ)
  for (const f of FILES.filter(f => !f.endsWith(".bin"))) { if (!(await c.match(f))) { try { const r = await fetch(f, { cache: "reload" }); if (r.ok) await c.put(f, r); } catch (err) { } } }
  self.skipWaiting();
})()));
self.addEventListener("activate", e => e.waitUntil((async () => {
  const c = await caches.open(V);
  for (const k of await caches.keys()) if (k.startsWith("autoedit-") && k !== V) {
    // chuyển phần bộ nghe đã tải ở bản cũ sang (không tải lại 300 MB khi chỉ sửa trang)
    const old = await caches.open(k);
    for (const req of await old.keys()) if (req.url.endsWith(".bin") && !(await c.match(req))) { const r = await old.match(req); if (r) await c.put(req, r); }
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
    // iPhone phát video cần trả từng đoạn (Range, 206), nhất là video mẫu lưu trong máy
    const rg = e.request.headers.get("range");
    if (hit && rg) {
      const buf = await hit.arrayBuffer(), m = /bytes=(\d+)-(\d*)/.exec(rg), a = m ? +m[1] : 0, b = m && m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
      const h = new Headers(hit.headers); h.set("Content-Range", `bytes ${a}-${b}/${buf.byteLength}`); h.set("Content-Length", String(b - a + 1)); h.set("Accept-Ranges", "bytes");
      h.set("Cross-Origin-Resource-Policy", "same-origin");
      return new Response(buf.slice(a, b + 1), { status: 206, statusText: "Partial Content", headers: h });
    }
    if (hit) return iso(hit);
    try { const r = await fetch(e.request); if (r.ok) c.put(p, r.clone()); return iso(r); }
    catch (err) { const h = await c.match("index.html"); return h ? iso(h) : Response.error(); }
  })());
});
