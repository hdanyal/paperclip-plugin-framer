# paperclip-plugin-framer

Paperclip plugin that proxies agent tools to **your** [Framer MCP](https://github.com/hdanyal-ts/framer-mcp) server over **Streamable HTTP** (URL ending in `/mcp`). Works with any compatible deployment once Paperclip can reach that URL.

| | |
|--:|---|
| **npm** | `paperclip-plugin-framer` |
| **Plugin id** | `paperclip-plugin-framer` |
| **Source** | [github.com/hdanyal/paperclip-plugin-framer](https://github.com/hdanyal/paperclip-plugin-framer) |

## Requirements

- Paperclip with third-party **plugins** and `@paperclipai/plugin-sdk` satisfying the package `peerDependencies`.
- A running **framer-mcp** (or compatible) **Streamable HTTP** endpoint.
- **Node** ≥ 20 (see `engines` in `package.json`).

## Install (Paperclip server app)

Use **one** of these from the directory of your **Paperclip server** (not the framer-mcp repo). Until the package is published to npm, use **git** or a **Release `.tgz`** from GitHub.

```bash
npm install paperclip-plugin-framer@0.2.0
```

```bash
npm install git+https://github.com/hdanyal/paperclip-plugin-framer.git#v0.2.0
```

```bash
npm install ./paperclip-plugin-framer-0.2.0.tgz
```

If your deployment uses the Paperclip CLI ([plugin spec](https://github.com/paperclipai/paperclip/blob/master/doc/plugins/PLUGIN_SPEC.md)):

```bash
pnpm paperclipai plugin install paperclip-plugin-framer@0.2.0
```

## After install

1. **Restart** or redeploy the Paperclip server.
2. In the board UI, **enable** **Framer MCP** (`paperclip-plugin-framer`) for the **company** that runs tasks.
3. Open plugin settings: set **Framer MCP URL** to your `https://…/mcp` (or dev default below); add optional bearer if the MCP server uses `MCP_AUTH_TOKEN`.

The plugin does **not** store Framer API secrets. It only forwards the optional **MCP bearer token** you configure to your MCP server as `Authorization: Bearer`.

## Configuration

| Field | Description |
|--------|-------------|
| **Framer MCP URL** | Full Streamable HTTP URL, e.g. `https://your-host.com/mcp`. Schema default `http://localhost:3333/mcp` is for **local dev** only—override in production. |
| **MCP bearer token** | Optional; same value as `MCP_AUTH_TOKEN` on framer-mcp if used. |

## Tools

| Tool | Purpose |
|------|---------|
| `framer_mcp_list_tools` | List tool names on the MCP server. |
| `framer_mcp_call` | Call a tool (`toolName`, optional `arguments`). |

**Smoke:** After configuring, run `framer_mcp_list_tools`, then `framer_mcp_call` with `toolName: "framer_get_project_info"` and `arguments: {}` (if that tool exists on your server).

## Compatibility

- **Tested / declared:** `@paperclipai/plugin-sdk` `^2026.427.0`; Node ≥ 20. Confirm against your Paperclip host version.

## Run framer-mcp

Deploy or run the MCP server separately—see [framer-mcp](https://github.com/hdanyal-ts/framer-mcp) and its [operator notes](https://github.com/hdanyal-ts/framer-mcp/blob/main/docs/PAPERCLIP.md).

## Development

```bash
npm ci
npm run verify
```

## Releases / npm publishing

Tag **`v*.*.*`** to trigger [release workflow](.github/workflows/release.yml). Set repository secret **`NPM_TOKEN`** to publish to npm; omit it to skip publish and still attach the `.tgz` to the GitHub Release.

## License

MIT — see [LICENSE](./LICENSE).
