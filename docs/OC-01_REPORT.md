# OC-01 · Development foundation

2026-11-23 · Approved for local commit

## Result

Implemented the task 00 planning audit, pnpm/Turborepo monorepo, minimal Next.js web entry point, Fastify health endpoint, versioned contract, local service configuration and PR checks. Both HTTP processes ran on loopback and were stopped after verification. Live container startup and hosted CI remain unverified.

## Environment and Git

PowerShell reported `C:\Understand_bible\02_Codex_Workspace` on Windows build 19045. A uniquely named probe was created, read back and removed successfully. Git 2.56.1.windows.1 worked with the normal workspace configuration. The initial status was clean on `main`. Local HEAD and a live read of GitHub's `refs/heads/main` both returned `0e4fb57c733fb078a71653abaaa5cbf08fa2ef65`. Fetch and push URLs identify `https://github.com/ravichandrareddy-projects/UNDERSTAND_BIBLE.git`.

The 17 planning documents, planning index and catalogue matched the original commit at closeout. The owner approved a local commit of the 49 foundation files on `main`.

## Files created

| Area                 | Files                                                                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root                 | `README.md`, `.gitignore`, `.gitattributes`, `.npmrc`, `.nvmrc`, `.prettierignore`, `.prettierrc.json`, `eslint.config.mjs`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, `turbo.json` |
| Review and CI        | `.github/CODEOWNERS`, `.github/workflows/ci.yml`                                                                                                                                                                         |
| API                  | `apps/api/{README.md,package.json,tsconfig.json,tsconfig.build.json}`, `src/{app.ts,server.ts}` and `test/health.test.ts` under that app                                                                                 |
| Web                  | `apps/web/{README.md,package.json,tsconfig.json}` and `apps/web/app/{layout.tsx,page.tsx}`                                                                                                                               |
| Contracts and data   | `packages/contracts/{openapi.yaml,README.md}`, `data/README.md`                                                                                                                                                          |
| Services             | `infra/docker-compose.yml`, `infra/postgres/001-extensions.sql`, `infra/minio/{Dockerfile,start-minio.sh}`, `infra/{prepare-local.mjs,prepare-local.test.mjs}`                                                           |
| Reserved directories | A `.gitkeep` in `apps/review`, `e2e` and each of `packages/{ui,i18n,refparser,db,ingest,search,ai,policy}`                                                                                                               |
| Audit and handoff    | `docs/STATUS.md`, `docs/DECISION_REQUESTS.md`, `docs/OC-01_REPORT.md`                                                                                                                                                    |

## Dependencies installed

Existing tools were Node 26.13.1 LTS and npm 11.20.0. pnpm 10.32.1 was installed inside the workspace. The lockfile records the transitive tree. Final direct resolutions from `pnpm list --recursive --depth 0` follow.

| Workspace | Installed packages                                                                                                                                 |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root      | Turbo 2.11.13, TypeScript 5.9.3, ESLint 10.15.0, @eslint/js 10.0.1, typescript-eslint 8.73.0, globals 17.14.0, Prettier 3.10.1, @types/node 26.6.6 |
| API       | Fastify 5.12.8, Vitest 5.1.1, yaml 2.9.1                                                                                                           |
| Web       | Next.js 16.4.6, React and React DOM 19.3.1, @types/react and @types/react-dom 19.3.0                                                               |

The first dependency resolution flagged ESLint 9 as unsupported. The final install uses the supported ESLint 10 line. An official standalone Docker Compose v5.8.0 executable was downloaded to ignored `.local/` and checked against the release SHA-256 to validate configuration. System software installations, service purchases and deployments totaled zero.

## Commands and results

Windows package commands used the session-local pnpm on PATH as shown in the root README. Next and Turbo telemetry were disabled during verification.

| Commands                                                                                                                                                                                     | Observed result                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Get-Location`, `Get-Content -Raw -Encoding UTF8 AGENTS.md`, `rg --files`, `Get-Content` for the task and planning pack                                                                      | Correct workspace. Audit includes the full set of planning documents and the catalogue.                                                                                                                                                                     |
| `git status --short --branch`, `git remote -v`, `git log -1 --oneline --decorate`, `git ls-remote --exit-code origin refs/heads/main`, `git rev-parse HEAD`                                  | Baseline commit matched GitHub.                                                                                                                                                                                                                             |
| `New-Item`, `Get-Content -Raw`, `Remove-Item -LiteralPath` and `Test-Path` on the temporary probe                                                                                            | Write, readback and cleanup passed.                                                                                                                                                                                                                         |
| `Import-Csv docs/data/edition_catalogue.csv`, filtered on exact CORE role                                                                                                                    | 81 total entries, 21 CORE across 13 Bible-text languages. Six named M1 pilot IDs present.                                                                                                                                                                   |
| `node --version`, `npm.cmd --version`, `git --version`, `Get-Command` and service discovery for Docker and Podman                                                                            | Node and Git present. Neither container engine was available.                                                                                                                                                                                               |
| `npm.cmd install --prefix .local/bootstrap --cache .local/npm-cache --registry https://registry.npmjs.org --ignore-scripts --no-audit --no-fund --no-save --package-lock=false pnpm@10.32.1` | Workspace-local pnpm installed with package download approval.                                                                                                                                                                                              |
| `node .local/bootstrap/node_modules/pnpm/bin/pnpm.cjs install --registry=https://registry.npmjs.org --store-dir=.local/pnpm-store --reporter=append-only`                                    | Initial install and dependency refresh completed. Lockfile generated.                                                                                                                                                                                       |
| `pnpm.cmd install --offline --frozen-lockfile --store-dir=.local/pnpm-store`                                                                                                                 | Passed against the generated lockfile and local store.                                                                                                                                                                                                      |
| `pnpm.cmd format`, `pnpm.cmd format:check`, `pnpm.cmd lint`                                                                                                                                  | Formatter and zero-warning lint checks passed.                                                                                                                                                                                                              |
| `pnpm.cmd typecheck`, `pnpm.cmd test`, `pnpm.cmd build`                                                                                                                                      | Typechecking and builds passed for both apps. Two tests passed: credential generation and persistence, and the Fastify response against the OpenAPI example. Windows blocked child processes on the first test and build attempts. Approved retries passed. |
| `pnpm audit --registry=https://registry.npmjs.org --audit-level high`                                                                                                                        | Registry reported no known vulnerabilities in the npm dependencies.                                                                                                                                                                                         |
| `pnpm.cmd dev:apps` plus `Invoke-WebRequest` to loopback ports 3001 and 3000                                                                                                                 | HTTP 200 from `/health` with `{"status":"ok"}` and HTTP 200 from `/` with the product heading. Both listeners closed after the smoke test.                                                                                                                  |
| `pnpm.cmd dev`                                                                                                                                                                               | Local credentials prepared. Full-stack startup stopped at the missing Docker executable.                                                                                                                                                                    |
| `.local/docker-compose-oc01.exe -f infra/docker-compose.yml config --quiet` and `config --services`                                                                                          | Compose accepted the final file and listed minio, postgres and redis. Git Bash syntax check passed on the MinIO entrypoint.                                                                                                                                 |
| `git ls-files --others --exclude-standard`, `git check-ignore`, `git diff --exit-code 0e4fb57 -- docs AGENTS.md prompts`                                                                     | New files inventoried. Secrets, downloads, build output and private rights ignored. Original planning files had zero tracked changes.                                                                                                                       |

## Services, downloads and data

PostgreSQL 17 has persistent storage and extension bootstrap for `vector` and `pg_trgm`. Redis and MinIO also use named volumes. All published ports bind to loopback. Postgres and MinIO use generated per-checkout credentials. A container engine is required to build and exercise the final stack. The root README gives startup, readiness and shutdown commands. TEI/BGE-M3 is deferred to the embedding task.

The proposed legacy MinIO image returned 404 on Docker Hub and denied anonymous access on Quay. Upstream confirms source-only distribution. The Dockerfile uses the upstream release commit `9e49d5e7a648f00e26f2246f4dc28e6b07f8c84a`, verified through GitHub and the Go proxy. The two service images and the Go and Alpine base images are digest-pinned. No image or Go module was pulled on this workstation. The first container run must still verify the MinIO build and each service's readiness. [Upstream MinIO release](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z)

Network activity covered npm packages, metadata and audit at `registry.npmjs.org`, Git and release checks at `github.com` and `api.github.com`, upstream files at `raw.githubusercontent.com`, the official GitHub release asset download, container metadata at `hub.docker.com` and `quay.io`, and module metadata at `proxy.golang.org`. Local HTTP smoke tests used `127.0.0.1`.

Bible translations and datasets acquired or imported: zero. No publisher was contacted. Licence evidence and acquisition manifests do not exist for OC-01. The catalogue remains a research snapshot.

## Decisions and next assignment

The owner selected `@ravichandrareddy-projects` as the temporary code owner for all roles. The [decision register](DECISION_REQUESTS.md) records the six-pilot versus 21-CORE scope, OC-02 versus OC-07 dependency order, Q-01/D-001, geographic scope, deferred previews and outstanding planning questions.

Antigravity should start from the local OC-01 foundation commit, read `AGENTS.md` and execute `prompts/ANTIGRAVITY_TASK_00_UI_FOUNDATION.md` for **AG-01 only**. Use the apps-only startup in the root README. Build the ten route skeletons in that prompt, locale routing for 14 interface languages, the installable PWA manifest, service-worker skeleton, error boundaries and an environment-controlled mock mode. Demonstrate `/en` and `/te`, the four-verse loading layout, desktop and mobile comparison layouts, Arabic RTL and Indic rendering. Include keyboard, accessibility and installability checks. Only liveness has an OC-01 API contract. Use empty states and propose missing contracts to Codex with examples. Return the routes, components, desktop/mobile screenshots, checks and contract requests. Stop after AG-01 and propose AG-02/03/04 for review.

## Closeout verification

All 49 intended files were inspected, including ten empty directory placeholders and the lockfile's 269 integrity-checked package resolutions. The file and credential scan found no secrets, credentials, binaries or temporary artifacts among them. Git ignore checks covered the actual local credentials, downloaded validator, logs, dependencies and build outputs.

The closeout run of `pnpm.cmd dev:apps` served HTTP 200 at `http://127.0.0.1:3000/` with the Understand Bible heading and HTTP 200 at `http://127.0.0.1:3001/health` with `{"status":"ok"}`. The smoke-test processes were stopped. Formatting was checked again. The lint, typecheck, test and build results above are from the implementation run.

The next Codex task proposed for separate approval is OC-02, the licence registry and G-LIC-1, subject to the OC-07 sequencing decision. OC-02 has not started.
