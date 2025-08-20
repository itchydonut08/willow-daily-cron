// Calls your Pages endpoint once per day so the shared set is ready for everyone.
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(run(env));
  },

  // Optional manual trigger: open https://<worker-subdomain>.workers.dev/run
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/run") {
      const { status, text } = await run(env);
      return new Response(text, { status, headers: { "Content-Type": "text/plain" } });
    }
    return new Response("ok", { status: 200 });
  }
};

async function run(env) {
  const base = (env.PAGES_URL || "").replace(/\/+$/, "");
  if (!base) return { status: 500, text: "Missing env.PAGES_URL" };

  const res = await fetch(`${base}/api/daily`, { method: "GET" });
  const body = await res.text();
  return { status: res.status, text: `GET /api/daily -> ${res.status}\n${body.slice(0,400)}` };
}
