import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import { DEFAULT_CONFIG, PLUGIN_ID, PLUGIN_VERSION } from "./constants.js";

const manifest: PaperclipPluginManifestV1 = {
  id: PLUGIN_ID,
  apiVersion: 1,
  version: PLUGIN_VERSION,
  displayName: "Framer MCP",
  description:
    "Connects Paperclip agents to your Framer MCP server (Streamable HTTP): CMS collections, publish/deploy, and project info. Point this plugin at your deployment's /mcp URL.",
  author: "hdanyal",
  categories: ["connector", "automation"],
  capabilities: ["agent.tools.register", "http.outbound"],
  entrypoints: {
    worker: "./dist/worker.js",
  },
  tools: [
    {
      name: "framer_mcp_list_tools",
      displayName: "List Framer MCP tools",
      description:
        "Lists tool names exposed by your Framer MCP server (framer_list_collections, framer_publish, etc.).",
      parametersSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "framer_mcp_call",
      displayName: "Call Framer MCP tool",
      description:
        "Invokes a tool on your Framer MCP server. Use framer_mcp_list_tools to see names. Example toolName: framer_list_collections with arguments {}.",
      parametersSchema: {
        type: "object",
        properties: {
          toolName: {
            type: "string",
            description:
              "MCP tool name, e.g. framer_get_project_info, framer_upsert_collection_items",
          },
          arguments: {
            type: "object",
            description:
              "JSON object passed to the tool (field ids, collectionId, etc.)",
          },
        },
        required: ["toolName"],
      },
    },
  ],
  instanceConfigSchema: {
    type: "object",
    properties: {
      framerMcpUrl: {
        type: "string",
        title: "Framer MCP URL",
        description:
          "Full URL to the Streamable HTTP MCP endpoint (must end with /mcp). Example: https://your-host.com/mcp",
        default: DEFAULT_CONFIG.framerMcpUrl,
      },
      framerMcpBearerToken: {
        type: "string",
        format: "password",
        title: "MCP bearer token (optional)",
        description:
          "If framer-mcp is secured with MCP_AUTH_TOKEN, paste that exact token here. It is sent as Authorization: Bearer on MCP requests.",
        default: DEFAULT_CONFIG.framerMcpBearerToken,
      },
    },
    required: ["framerMcpUrl"],
  },
};

export default manifest;
