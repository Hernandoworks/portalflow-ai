# Custom GPT Action Gateway

Gateway between AI clients and PortalFlow connectors.

Flow:

ChatGPT Custom GPT
→ GPT Action
→ Action Gateway
→ Permission Check
→ Connector Router
→ External Apps
→ Audit Log

## Responsibilities

- Receive AI tool requests
- Validate permissions
- Route actions
- Return execution results

## Endpoints

POST /search

Purpose:
Search connected systems before creating.

POST /execute

Purpose:
Execute approved connector actions.

POST /audit

Purpose:
Record system changes.
