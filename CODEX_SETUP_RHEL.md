# Understand Bible — Codex Setup (RHEL/Linux)

## 1. Prepare the project directory

Download `Understand_Bible_Codex_Starter_Pack.zip` from the conversation and save it in `~/Downloads`. It already contains Claude's 17 planning documents, the edition catalogue, `AGENTS.md`, and the Codex/Antigravity prompts.

```bash
mkdir -p ~/Projects
unzip ~/Downloads/Understand_Bible_Codex_Starter_Pack.zip -d ~/Projects
mv ~/Projects/understand_bible_starter ~/Projects/understand-bible
cd ~/Projects/understand-bible
```

## 2. Check prerequisites

```bash
node --version
npm --version
git --version
```

The planning stack expects a current Node.js LTS, pnpm, Git, and a local container runtime for services. Check whether Docker or Podman is already installed:

```bash
docker --version 2>/dev/null || true
podman --version 2>/dev/null || true
```

Do not install or configure a cloud account or paid service without approval. If no container runtime exists, ask Codex to report that blocker and propose options; do not let it install system packages without your approval.

## 3. Install Codex CLI

With npm available:

```bash
npm install -g @openai/codex
codex --version
```

Official installation and authentication guidance:
- https://learn.chatgpt.com/docs/codex/cli
- https://learn.chatgpt.com/docs/auth?surface=cli

## 4. Sign in with the correct ChatGPT account

```bash
codex login
codex login status
```

When the browser opens, sign in with the **other account that has ChatGPT Pro**. Use “Sign in with ChatGPT”, not an API key, if you intend to use the Pro plan's included Codex access. API-key usage is separately billed through the API platform.

If the browser is already signed into the wrong ChatGPT account, switch accounts in the browser first, then complete `codex login` again. Never copy or share `~/.codex/auth.json`.

## 5. Start inside the repository

```bash
cd ~/Projects/understand-bible
git init
# First checkpoint: commit the source planning documents and project instructions
git add AGENTS.md docs CODEX_SETUP_RHEL.md NEXT_STEPS.md README_CODEX_FIRST.md prompts
git commit -m "Add Understand Bible project plan and agent instructions"
codex
```

Inside Codex:
- Run `/init` only if the root `AGENTS.md` does not already exist. Review any generated changes; do not overwrite the supplied project instructions.
- Run `/status` to check the active account/session and model.
- Run `/permissions` and keep approvals enabled. Use workspace write for project edits. Network access is off by default; approve only the specific official download or package-host command you have reviewed.
- Use `/model` to choose an available high-reasoning model for architecture and code tasks.
- Use `/review` before accepting substantial changes.

Do not use `--yolo` / dangerously bypass approvals for this project.
