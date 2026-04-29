import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { PLUGIN_VERSION } from "./constants.js";

export async function withFramerMcp<T>(
  mcpUrl: string,
  bearer: string | undefined,
  fn: (client: Client) => Promise<T>,
): Promise<T> {
  const client = new Client({ name: "paperclip-plugin-framer", version: PLUGIN_VERSION });
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
    requestInit: bearer
      ? { headers: { Authorization: `Bearer ${bearer}` } }
      : undefined,
  });
  await client.connect(transport);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

export function callToolResultToContent(result: CallToolResult): string {
  const text =
    result.content
      ?.map((c) => {
        if (c.type === "text" && "text" in c && c.text) return c.text;
        return JSON.stringify(c);
      })
      .join("\n") ?? "";
  if (result.isError) {
    return `Error: ${text}`;
  }
  return text;
}
