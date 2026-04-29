export interface FramerPluginInstanceConfig {
  /** Full URL to framer-mcp Streamable HTTP endpoint, e.g. https://mcp.example.com/mcp */
  framerMcpUrl: string;
  /** Optional: same string as MCP_AUTH_TOKEN on framer-mcp (Authorization: Bearer) */
  framerMcpBearerToken?: string;
}
