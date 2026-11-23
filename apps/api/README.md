# Understand Bible API

From the repository root, run `pnpm --filter @understand-bible/api dev`. The Fastify process listens on loopback port 3001. `GET /health` returns HTTP 200 and `{"status":"ok"}` when the process is serving requests. Service readiness is reported separately by Compose.

Run `pnpm --filter @understand-bible/api test` for the in-process HTTP check against the OpenAPI example. Run the package's `build` and `start` scripts to serve the compiled entry point.
