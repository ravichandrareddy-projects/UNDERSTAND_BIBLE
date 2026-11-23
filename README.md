# Understand Bible

Understand Bible is a multilingual Bible reading and study project. OC-01 supplies the shared development workspace, a Fastify liveness endpoint, a Next.js App Router entry point and three local data services. Review the dated status and task report for validation on the Windows development machine.

## Prerequisites

Use the Node.js LTS patch in `.nvmrc` and pnpm 10.32.1. From the project root, verify `node --version` and `pnpm --version`. Package downloads and system software installation require owner approval.

For a workspace-local pnpm on Windows, run these commands after package download approval. The PATH change lasts for the current PowerShell session.

```powershell
npm.cmd install --prefix .local/bootstrap --no-save --package-lock=false --ignore-scripts --no-audit --no-fund pnpm@10.32.1
$env:Path = (Join-Path (Get-Location) '.local/bootstrap/node_modules/.bin') + ';' + $env:Path
pnpm.cmd --version
```

For the full stack, use a local Docker engine running Linux containers and a Compose plugin supporting `up --wait`. Verify the engine with `docker info` and `docker compose version`. A supported Windows host can use Docker Desktop with its WSL 2 backend after owner approval of the installation and licence terms. A local Linux development machine can use Docker Engine with the Compose plugin. See the official [Windows prerequisites](https://docs.docker.com/desktop/setup/install/windows-install/) and [Linux installation instructions](https://docs.docker.com/engine/install/).

The first service startup pulls the pinned PostgreSQL, Redis, Go and Alpine images and compiles MinIO Community from its pinned upstream Go module. Allow time and disk space for the build. Review these downloads with the owner before starting services. The build runs inside Docker and uses the Go module proxy, Go checksum database and Alpine package mirror. The development workstation only needs Node, pnpm and the container runtime. [MinIO upstream release](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z)

## Run locally

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` prepares ignored local credentials, starts the three services, waits for their health checks and then runs both apps. Open the web app at `http://127.0.0.1:3000/`. The API at `http://127.0.0.1:3001/health` responds with `{"status":"ok"}`. The health endpoint reports process liveness.

When developing without a container runtime, use `pnpm dev:apps` after the same install. For one app use `pnpm --filter @understand-bible/api dev` or `pnpm --filter @understand-bible/web dev`. In PowerShell, use `pnpm.cmd` if script execution policy blocks the pnpm shim.

| Local service            | Loopback port | Readiness                                                                              |
| ------------------------ | ------------- | -------------------------------------------------------------------------------------- |
| PostgreSQL 17            | 5432          | Database `understand_bible` accepts connections and has `vector` and `pg_trgm` enabled |
| Redis                    | 6379          | `redis-cli ping`                                                                       |
| MinIO S3 API and console | 9000, 9001    | HTTP 200 at `/minio/health/ready` on port 9000                                         |

Postgres and MinIO use the local development username `understand_bible`. `pnpm services:prepare` generates per-checkout passwords in `.local/secrets/`. Keep that directory with the corresponding volumes between runs. Postgres runs the extension bootstrap on its first start with an empty volume. Redis binds through the loopback interface for local development.

```sh
pnpm services:up
pnpm services:status
docker compose -f infra/docker-compose.yml exec -T postgres psql -U understand_bible -d understand_bible -c "SELECT extname FROM pg_extension ORDER BY extname"
docker compose -f infra/docker-compose.yml exec -T redis redis-cli ping
docker compose -f infra/docker-compose.yml exec -T minio wget -q --spider http://127.0.0.1:9000/minio/health/ready
pnpm services:down
```

Ctrl+C stops the foreground apps. `pnpm services:down` stops the service containers and preserves their named volumes. BGE-M3 and the embedding service belong to the later search evaluation.

## Repository map

| Path                                               | Contents                                           | Engineering owner             |
| -------------------------------------------------- | -------------------------------------------------- | ----------------------------- |
| `apps/api/`                                        | Fastify, health test and TypeScript build          | Codex                         |
| `apps/web/`, `apps/review/`                        | Next.js baseline and reserved review console       | Antigravity                   |
| `packages/contracts/`                              | Versioned OpenAPI contract                         | Codex with Antigravity review |
| `packages/{db,ingest,policy,refparser,search,ai}/` | Reserved workspaces for scheduled tasks            | Codex                         |
| `packages/{ui,i18n}/`, `e2e/`                      | Reserved design system, messages and browser tests | Antigravity                   |
| `data/`, `infra/`, root tooling and CI             | Provenance boundary, local services and automation | Codex                         |
| `docs/`, `prompts/`                                | Planning pack, task reports and handoffs           | Claude and project owner      |

Reserve package directories until their scheduled tasks introduce code and a package manifest. Local archives, source text, build output, private permissions and credentials stay outside version control. Original plans are versioned at commit `0e4fb57`.

## Verification and review

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The pull request workflow also audits dependencies and starts the service stack on its Ubuntu runner. Run `pnpm format` to format project files. Original planning documents are excluded from the formatter. Contracts change through a versioned proposal with an example and frontend review. Antigravity requests shared configuration changes with the `root-config` label.

The project owner receives GitHub code-owner reviews for the engineering roles until separate accounts are designated. Review the [agent instructions](AGENTS.md), [status](docs/STATUS.md), [open decisions](docs/DECISION_REQUESTS.md) and [OC-01 report](docs/OC-01_REPORT.md) before assigning the next task.
