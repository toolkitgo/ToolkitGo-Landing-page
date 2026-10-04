import nextEnv from "@next/env";

/** Read-only deployment check. Never posts an application or prints the webhook URL. */
nextEnv.loadEnvConfig(process.cwd());
const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  ?.replace(/^[\uFEFF\u200B\u200C\u200D\s"']+|[\s"']+$/g, "")
  .trim();

if (!webhook) {
  console.error("GOOGLE_SHEETS_WEBHOOK_URL is missing.");
  process.exitCode = 1;
} else {
  try {
    const url = new URL(webhook);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) {
      throw new Error("Use the deployed Google Apps Script web app URL ending in /exec.");
    }
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(25000) });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { /* HTML is usually a permission or deployment error. */ }
    console.log(JSON.stringify({
      httpStatus: response.status,
      responseType: data ? "json" : "non-json",
      status: data?.status,
      ready: data?.ready,
      error: typeof data?.error === "string" ? data.error.replace(/https?:\/\/\S+/g, "[redacted URL]") : undefined,
      requiresSignIn: new URL(response.url).hostname === "accounts.google.com" || /ServiceLogin|Sign in - Google Accounts/i.test(text),
      pageTitle: !data ? text.match(/<title[^>]*>(.*?)<\/title>/is)?.[1] : undefined,
      diagnostic: !data && /<title[^>]*>Error<\/title>/i.test(text) ? text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
        ?.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/https?:\/\/\S+/g, "[redacted URL]").replace(/[\w.+-]+@[\w.-]+/g, "[redacted email]").replace(/\s+/g, " ").slice(0, 600) : undefined,
    }, null, 2));
    if (!response.ok || !data || data.ready !== true) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message.replace(/https?:\/\/\S+/g, "[redacted URL]") : "Webhook check failed.");
    process.exitCode = 1;
  }
}
