# API contracts

For the endpoint-by-endpoint review of all 13 browser resources and their 23 named interfaces, see the [Antigravity contract review](../../docs/API_CONTRACT_REVIEW.md). The OpenAPI file describes the current Fastify surface.

Antigravity's browser routes and the service paths for books, chapters, batches, translations and reading positions are mapped in the [OC-07 reader contract](reader-proposal.md). Codex accepts the resource names. Review the source-label and content-version changes before wiring the screens. The separate [wire types](reader.ts) describe the proposed service payloads.

Codex maintains the versioned OpenAPI document. The OC-01 contract covers process liveness. The API test checks the example against the running handler. Antigravity reviews contract changes before consuming them. Submit a `contract-change` proposal with the intended behaviour and a JSON example when a screen needs another operation.

At the OC-02 checkpoint, five private source archives have passed structural inventory. The published API surface remains `GET /health`. Antigravity can continue against its labelled reader fixtures. A reader endpoint requires approved parsing, edition-aware mapping, attribution and action-specific policy before a versioned contract and client are available. [Source checkpoint](../../docs/OC-02_REPORT.md)
