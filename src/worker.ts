import {
  definePlugin,
  runWorker,
  type PluginContext,
  type ToolRunContext,
} from "@paperclipai/plugin-sdk";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { FramerPluginInstanceConfig } from "./types.js";
import { DEFAULT_CONFIG } from "./constants.js";
import { withFramerMcp, callToolResultToContent } from "./mcp-client.js";

function bearerFromConfig(config: FramerPluginInstanceConfig): string | undefined {
  const t = config.framerMcpBearerToken?.trim();
  return t || undefined;
}

const plugin = definePlugin({
  async setup(ctx: PluginContext) {
    const raw = await ctx.config.get();
    const config = raw as unknown as FramerPluginInstanceConfig;
    const mcpUrl = config.framerMcpUrl?.trim() || DEFAULT_CONFIG.framerMcpUrl;
    const bearer = bearerFromConfig(config);

    ctx.tools.register(
      "framer_mcp_list_tools",
      {
        displayName: "List Framer MCP tools",
        description:
          "Lists tool names exposed by your Framer MCP server (framer_list_collections, framer_publish, etc.).",
        parametersSchema: {
          type: "object",
          properties: {},
        },
      },
      async (_params: unknown, _runCtx: ToolRunContext) => {
        void _params;
        try {
          const names = await withFramerMcp(mcpUrl, bearer, async (client) => {
            const listed = await client.listTools();
            return listed.tools.map((t) => t.name);
          });
          return { content: JSON.stringify(names, null, 2) };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return { error: `framer_mcp_list_tools failed: ${msg}` };
        }
      },
    );

    ctx.tools.register(
      "framer_mcp_call",
      {
        displayName: "Call Framer MCP tool",
        description:
          "Invokes a tool on your Framer MCP server. Use framer_mcp_list_tools to see names. Example toolName: framer_list_collections with arguments {}.",
        parametersSchema: {
          type: "object",
          properties: {
            toolName: {
              type: "string",
              description: "MCP tool name, e.g. framer_get_project_info, framer_upsert_collection_items",
            },
            arguments: {
              type: "object",
              description: "JSON object passed to the tool (field ids, collectionId, etc.)",
            },
          },
          required: ["toolName"],
        },
      },
      async (params: unknown, _runCtx: ToolRunContext) => {
        void _runCtx;
        const p = params as { toolName?: string; arguments?: Record<string, unknown> };
        const toolName = typeof p.toolName === "string" ? p.toolName.trim() : "";
        if (!toolName) {
          return { error: "toolName is required" };
        }
        const args = p.arguments && typeof p.arguments === "object" ? p.arguments : {};
        try {
          const text = await withFramerMcp(mcpUrl, bearer, async (client) => {
            const result = (await client.callTool({
              name: toolName,
              arguments: args,
            })) as CallToolResult;
            return callToolResultToContent(result);
          });
          return { content: text };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return { error: `framer_mcp_call failed: ${msg}` };
        }
      },
    );

    ctx.logger.info("paperclip-plugin-framer: registered framer_mcp_list_tools, framer_mcp_call", {
      mcpUrl: mcpUrl.replace(/\/\/.*@/, "//***@"),
    });
  },

  async onValidateConfig(config: unknown) {
    const c = config as FramerPluginInstanceConfig;
    if (!c?.framerMcpUrl || typeof c.framerMcpUrl !== "string" || !c.framerMcpUrl.trim()) {
      return { ok: false, errors: ["framerMcpUrl is required (HTTPS URL to your framer-mcp /mcp endpoint)"] };
    }
    try {
      new URL(c.framerMcpUrl);
    } catch {
      return { ok: false, errors: ["framerMcpUrl must be a valid URL"] };
    }
    return { ok: true };
  },

  async onHealth() {
    return { status: "ok" as const };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
