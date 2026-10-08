# zoxide-doctor MCP publication packet

Status: **Published and publicly verified.** `@agoes/zoxide-doctor-mcp@0.1.2` is on npm with GitHub Actions provenance, and the Official MCP Registry has an active record with the canonical `websiteUrl`.

## Asset

- Source repository: https://github.com/jiankn/zoxide-doctor-mcp
- Tagged release point: https://github.com/jiankn/zoxide-doctor-mcp/tree/v0.1.2
- Package: `@agoes/zoxide-doctor-mcp@0.1.2`
- MCP Registry name: `io.github.jiankn/zoxide-doctor`
- Canonical tool guide / MCP Registry `websiteUrl`: https://zoxide.org/tools/zoxide-doctor/
- Publish workflow: https://github.com/jiankn/zoxide-doctor-mcp/actions/workflows/publish.yml
- Passing cross-platform CI: https://github.com/jiankn/zoxide-doctor-mcp/actions/runs/31298580818
- Successful publication: https://github.com/jiankn/zoxide-doctor-mcp/actions/runs/31298620506

The server exposes one useful local tool, `diagnose_zoxide`. It delegates to the published `zoxide-doctor` diagnostic core, returns JSON, defaults profile scanning to off, and never modifies shell files.

## Publication record

- The initial `@jiankn` scope was rejected by npm because it does not exist for the publishing account. The package was corrected to the actual npm owner scope, `@agoes`.
- `v0.1.1` published the npm package but the Registry rejected a 140-character `server.json` description; its maximum is 100 characters.
- `v0.1.2` shortens that description, verifies the limit in CI, publishes npm with provenance, authenticates to the Registry through GitHub OIDC, and publishes `server.json` successfully. No MCP Registry token is needed.

## Acceptance URLs

- npm: https://www.npmjs.com/package/@agoes/zoxide-doctor-mcp
- MCP Registry API: https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jiankn%2Fzoxide-doctor/versions/latest
- npm registry metadata: https://registry.npmjs.org/@agoes%2Fzoxide-doctor-mcp
- npm.io mirror candidate: https://npm.io/package/@agoes/zoxide-doctor-mcp

The Registry endpoint returned HTTP 200 on 2026-08-09 with status `active`, version `0.1.2`, npm identifier `@agoes/zoxide-doctor-mcp`, and the exact canonical `websiteUrl`. This is a public metadata reference, not an HTML anchor: `rel`/ordinary-follow semantics are not applicable. Downstream aggregator pages remain pending until each is independently audited.
