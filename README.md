# PortalFlow AI

AI execution layer connecting AI assistants with real applications.

## Products

This monorepo contains two distinct products:

### 1. Connector Hub (`connector-hub/`)
**Python FastAPI backend** — Action Gateway connecting ChatGPT with:
- **Notion** — 18 actions (search, page CRUD, memory/vault/knowledge/changelog)
- **Google Drive** — 14 actions (files, Sheets, Docs, Apps Script)
- **GitHub** — issue tracking
- **Audit** — all actions logged to Notion Change Log DB

**Deployment**: `https://connector-hub-production-3bc7.up.railway.app`

**Start**: `cd connector-hub && source venv/bin/activate && uvicorn main:app --reload`

### 2. Upload Portal (`upload-portal/`)
**Next.js web app** — Create secure file upload portals that push files directly into Google Drive.

**Start**: `cd upload-portal && pnpm dev`

## Architecture

```
AI Clients                    PortalFlow                    Connected Apps
(ChatGPT GPT Actions)   →    Connector Hub API    →        Notion
(Claude, Gemini)              Action Gateway               Google Drive
                              Permission Engine             GitHub
                              Audit Logger
```

## Schema

`schemas/openapi.yaml` — Import into ChatGPT as a Custom GPT Action.

## Philosophy

Notion = Brain (knowledge, strategy, memory)
GitHub = Engine (code, connectors, automation)
