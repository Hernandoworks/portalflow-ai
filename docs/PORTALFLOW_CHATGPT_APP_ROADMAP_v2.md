# PortalFlow AI ChatGPT App Roadmap v2

## Vision

PortalFlow AI is an AI Agent Control Plane built as a ChatGPT App.

It connects AI assistants to external systems with:

- connectors
- permissions
- agents
- workflows
- audit logs
- memory

## Architecture

ChatGPT App
↓
Apps SDK / MCP Layer
↓
PortalFlow Core API
↓
Agent Runtime
↓
Permission Engine
↓
Connector Runtime
↓
Business Applications

---

# Phase 0 - Foundation

Goal: Preserve Custom GPT prototype assets.

Deliverables:

- Agent template registry
- Prompt registry
- Custom GPT archive
- Architecture docs
- Decision records

Documents:

- PRODUCT_VISION.md
- ARCHITECTURE.md
- DECISION_LOG.md

---

# Phase 1 - ChatGPT App Layer

Goal: Build installable ChatGPT application.

Components:

apps/chatgpt/

- MCP server
- tool definitions
- app manifest
- UI components

Core tools:

- portalflow.search
- portalflow.plan
- portalflow.execute
- portalflow.approve
- portalflow.inspect

Documents:

- CHATGPT_APP_SPEC.md
- MCP_TOOLS_REGISTRY.md

---

# Phase 2 - PortalFlow Backend

Components:

- API Gateway
- Auth
- Permission Engine
- Audit Engine
- Registry Service

Documents:

- API_SPECIFICATION.md
- SECURITY_MODEL.md

---

# Phase 3 - Connector Runtime

Goal: Universal connector framework.

Initial connectors:

- Notion
- GitHub
- Google Drive

Documents:

- CONNECTOR_STANDARD.md
- CONNECTOR_REGISTRY.md

---

# Phase 4 - Agent Runtime

Components:

- Agent Registry
- Planner
- Memory
- Workflow Engine

Documents:

- AGENT_RUNTIME.md
- WORKFLOW_ENGINE.md

---

# Phase 5 - Product Layer

Components:

- User dashboard
- Agent marketplace
- Teams
- Billing

Documents:

- PRODUCT_REQUIREMENTS.md
- RELEASE_PLAN.md

---

# Tracking System

Every feature requires:

1. Requirement
2. Architecture impact
3. Database impact
4. API impact
5. Security review
6. Test criteria
7. Release note

