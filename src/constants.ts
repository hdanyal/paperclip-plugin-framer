import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version?: string };

if (typeof pkg.version !== "string" || !pkg.version) {
  throw new Error("package.json must contain a semver string in \"version\"");
}

/** Plugin id registered with Paperclip (unique) */
export const PLUGIN_ID = "paperclip-plugin-framer";
export const PLUGIN_VERSION = pkg.version;

export const DEFAULT_CONFIG = {
  /** Local dev default; set your real `/mcp` URL in Paperclip plugin settings for production. */
  framerMcpUrl: "http://localhost:3333/mcp",
  framerMcpBearerToken: "",
} as const;
