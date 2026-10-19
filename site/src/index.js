// Videi idu iz R2 jer static assets ne podržavaju Range, a Safari/iOS bez
// 206 odgovora ne puštaju <video>. Sve ostalo poslužuju asseti iz public/.
// (Isti obrazac kao odds.domovina.ai.)
const PREFIX = "/video/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith(PREFIX) || !url.pathname.endsWith(".mp4")) {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }

    const obj = await env.BUCKET.get(url.pathname.slice(1), {
      range: request.headers,
      onlyIf: request.headers,
    });
    if (!obj) return new Response("Not Found", { status: 404 });

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set("etag", obj.httpEtag);
    headers.set("accept-ranges", "bytes");
    headers.set("x-robots-tag", "noindex");

    if (!("body" in obj)) return new Response(null, { status: 304, headers });

    let status = 200;
    if (obj.range && request.headers.has("range")) {
      const offset = obj.range.offset ?? obj.size - obj.range.suffix;
      const length = obj.range.length ?? obj.size - offset;
      headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${obj.size}`);
      headers.set("content-length", String(length));
      status = 206;
    } else {
      headers.set("content-length", String(obj.size));
    }
    return new Response(request.method === "HEAD" ? null : obj.body, { status, headers });
  },
};
