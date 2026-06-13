import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from notion_client import Client

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))


NOTION_API = 'https://api.notion.com/v1'


def _headers():
    return {
        'Authorization': f"Bearer {os.getenv('NOTION_TOKEN')}",
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    }


def _db_id(key):
    return os.getenv(key, '').replace('-', '')


class NotionConnector:

    def __init__(self):
        self.client = Client(auth=os.getenv("NOTION_TOKEN"))

    def commands(self):
        return {

            "search.all": {
                "risk": "safe",
                "description": "Search Notion workspace"
            },
            "page.create": {
                "risk": "write",
                "description": "Create Notion page"
            },
            "page.retrieve": {
                "risk": "safe",
                "description": "Retrieve page"
            },
            "page.update": {
                "risk": "write",
                "description": "Update page"
            },
            "database.query": {
                "risk": "safe",
                "description": "Query database entries"
            },
            "block.append": {
                "risk": "write",
                "description": "Append blocks to a page"
            },

            "memory.save": {
                "risk": "write",
                "description": "Save a memory entry to ChatGPT Memory Manager"
            },
            "memory.search": {
                "risk": "safe",
                "description": "Search memories by text, category, or tags"
            },
            "chat.log": {
                "risk": "write",
                "description": "Log a ChatGPT conversation message to the memory database"
            },
            "chat.get_history": {
                "risk": "safe",
                "description": "Get recent chat history for a session or thread"
            },

            "vault.save": {
                "risk": "write",
                "description": "Save a ChatGPT result or prompt to the vault"
            },
            "vault.search": {
                "risk": "safe",
                "description": "Search the ChatGPT vault by name, category, or tags"
            },

            "knowledge.save": {
                "risk": "write",
                "description": "Save a concept or relationship to the Knowledge Graph"
            },
            "knowledge.search": {
                "risk": "safe",
                "description": "Search the Knowledge Graph by concept, domain, or tags"
            },

            "asset.save": {
                "risk": "write",
                "description": "Save a document or asset to the Asset Library"
            },
            "asset.search": {
                "risk": "safe",
                "description": "Search assets by name, type, or tags"
            },

            "changelog.append": {
                "risk": "write",
                "description": "Append an entry to the Change Log audit database"
            },
            "changelog.query": {
                "risk": "safe",
                "description": "Query the Change Log by connector, status, or date range"
            },

        }

    async def run(self, action, payload):

        if action == "search.all":
            return self.client.search(query=payload.get("query", ""))

        if action == "page.create":
            return requests.post(
                f'{NOTION_API}/pages',
                headers=_headers(),
                json=payload.get("properties", {})
            ).json()

        if action == "page.retrieve":
            return self.client.pages.retrieve(payload.get("page_id"))

        if action == "page.update":
            return self.client.pages.update(
                page_id=payload.get("page_id"),
                **payload.get("properties", {})
            )

        if action == "database.query":
            db = payload.get("database_id", "").replace('-', '')
            if not db:
                return {"error": "database_id is required"}
            return requests.post(
                f'{NOTION_API}/databases/{db}/query',
                headers=_headers(),
                json=payload.get("filter", {})
            ).json()

        if action == "block.append":
            return self.client.blocks.children.append(
                block_id=payload.get("block_id"),
                children=payload.get("children", [])
            )

        if action == "memory.save":
            return self._save_memory(payload)

        if action == "memory.search":
            return self._search_memory(payload)

        if action == "chat.log":
            return self._log_chat(payload)

        if action == "chat.get_history":
            return self._get_chat_history(payload)

        if action == "vault.save":
            return self._save_to_vault(payload)

        if action == "vault.search":
            return self._search_vault(payload)

        if action == "knowledge.save":
            return self._save_knowledge(payload)

        if action == "knowledge.search":
            return self._search_knowledge(payload)

        if action == "asset.save":
            return self._save_asset(payload)

        if action == "asset.search":
            return self._search_assets(payload)

        if action == "changelog.append":
            return self._append_changelog(payload)

        if action == "changelog.query":
            return self._query_changelog(payload)

        return {
            "status": "registered",
            "action": action
        }

    # ==============================
    # MEMORY ACTIONS
    # ==============================

    def _save_memory(self, payload):
        db = _db_id("NOTION_MEMORY_DB")
        if not db:
            return {"error": "NOTION_MEMORY_DB not configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("memory"):
            body["properties"]["Memory"] = {
                "title": [{"text": {"content": payload["memory"]}}]
            }
        if payload.get("memory_text"):
            body["properties"]["Memory Text"] = {
                "rich_text": [{"text": {"content": payload["memory_text"]}}]
            }
        if payload.get("category"):
            body["properties"]["Category"] = {
                "select": {"name": payload["category"]}
            }
        if payload.get("importance"):
            body["properties"]["Importance"] = {
                "select": {"name": payload["importance"]}
            }
        if payload.get("tags"):
            body["properties"]["Tags"] = {
                "multi_select": [{"name": t} for t in payload["tags"]]
            }
        body["properties"]["Status"] = {
            "select": {"name": payload.get("status", "Active")}
        }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _search_memory(self, payload):
        db = _db_id("NOTION_MEMORY_DB")
        if not db:
            return {"error": "NOTION_MEMORY_DB not configured"}

        filters = []
        if payload.get("query"):
            filters.append({
                "property": "Memory",
                "title": {"contains": payload["query"]}
            })
        if payload.get("category"):
            filters.append({
                "property": "Category",
                "select": {"equals": payload["category"]}
            })
        if payload.get("tags"):
            filters.append({
                "property": "Tags",
                "multi_select": {"contains": payload["tags"][0]}
            })

        body = {"page_size": payload.get("page_size", 20)}
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()

    def _log_chat(self, payload):
        db = _db_id("NOTION_CHATGPT_MEMORY_DB")
        if not db:
            db = _db_id("NOTION_MEMORY_DB")
        if not db:
            return {"error": "no memory database configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("memory"):
            body["properties"]["Memory"] = {
                "title": [{"text": {"content": payload["memory"][:2000]}}]
            }
        if payload.get("memory_text"):
            body["properties"]["Memory Text"] = {
                "rich_text": [{"text": {"content": payload["memory_text"][:2000]}}]
            }
        if payload.get("role"):
            body["properties"]["Category"] = {
                "select": {"name": f"chat_{payload['role']}"}
            }
        if payload.get("tags"):
            body["properties"]["Tags"] = {
                "multi_select": [{"name": t} for t in payload["tags"]]
            }
        body["properties"]["Status"] = {
            "select": {"name": "Active"}
        }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _get_chat_history(self, payload):
        db = _db_id("NOTION_CHATGPT_MEMORY_DB")
        if not db:
            db = _db_id("NOTION_MEMORY_DB")
        if not db:
            return {"error": "no memory database configured"}

        body = {
            "page_size": payload.get("page_size", 20),
            "sorts": [{"timestamp": "created_time", "direction": "descending"}]
        }

        filters = []
        if payload.get("category"):
            filters.append({
                "property": "Category",
                "select": {"equals": payload["category"]}
            })
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()

    # ==============================
    # VAULT ACTIONS
    # ==============================

    def _save_to_vault(self, payload):
        db = _db_id("NOTION_CHATGPT_VAULT_DB")
        if not db:
            return {"error": "NOTION_CHATGPT_VAULT_DB not configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("name"):
            body["properties"]["Name"] = {
                "title": [{"text": {"content": payload["name"]}}]
            }
        if payload.get("prompt"):
            body["properties"]["Prompt"] = {
                "rich_text": [{"text": {"content": payload["prompt"]}}]
            }
        if payload.get("result"):
            body["properties"]["ChatGPT Result"] = {
                "rich_text": [{"text": {"content": payload["result"]}}]
            }
        if payload.get("category"):
            body["properties"]["Category"] = {
                "select": {"name": payload["category"]}
            }
        if payload.get("tags"):
            body["properties"]["Tags"] = {
                "multi_select": [{"name": t} for t in payload["tags"]]
            }
        if payload.get("source"):
            body["properties"]["Source"] = {
                "rich_text": [{"text": {"content": payload["source"]}}]
            }
        body["properties"]["Status"] = {
            "select": {"name": payload.get("status", "Active")}
        }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _search_vault(self, payload):
        db = _db_id("NOTION_CHATGPT_VAULT_DB")
        if not db:
            return {"error": "NOTION_CHATGPT_VAULT_DB not configured"}

        filters = []
        if payload.get("query"):
            filters.append({
                "property": "Name",
                "title": {"contains": payload["query"]}
            })
        if payload.get("category"):
            filters.append({
                "property": "Category",
                "select": {"equals": payload["category"]}
            })
        if payload.get("tags"):
            filters.append({
                "property": "Tags",
                "multi_select": {"contains": payload["tags"][0]}
            })

        body = {"page_size": payload.get("page_size", 20)}
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()

    # ==============================
    # KNOWLEDGE GRAPH ACTIONS
    # ==============================

    def _save_knowledge(self, payload):
        db = _db_id("NOTION_KNOWLEDGE_GRAPH_DB")
        if not db:
            return {"error": "NOTION_KNOWLEDGE_GRAPH_DB not configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("concept"):
            body["properties"]["Concept"] = {
                "title": [{"text": {"content": payload["concept"]}}]
            }
        if payload.get("summary"):
            body["properties"]["Summary"] = {
                "rich_text": [{"text": {"content": payload["summary"]}}]
            }
        if payload.get("knowledge_type"):
            body["properties"]["Knowledge Type"] = {
                "select": {"name": payload["knowledge_type"]}
            }
        if payload.get("domain"):
            body["properties"]["Domain"] = {
                "select": {"name": payload["domain"]}
            }
        if payload.get("tags"):
            body["properties"]["Tags"] = {
                "multi_select": [{"name": t} for t in payload["tags"]]
            }
        if payload.get("source"):
            body["properties"]["Source"] = {
                "rich_text": [{"text": {"content": payload["source"]}}]
            }
        if payload.get("confidence"):
            body["properties"]["Confidence"] = {
                "select": {"name": payload["confidence"]}
            }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _search_knowledge(self, payload):
        db = _db_id("NOTION_KNOWLEDGE_GRAPH_DB")
        if not db:
            return {"error": "NOTION_KNOWLEDGE_GRAPH_DB not configured"}

        filters = []
        if payload.get("query"):
            filters.append({
                "property": "Concept",
                "title": {"contains": payload["query"]}
            })
        if payload.get("domain"):
            filters.append({
                "property": "Domain",
                "select": {"equals": payload["domain"]}
            })
        if payload.get("knowledge_type"):
            filters.append({
                "property": "Knowledge Type",
                "select": {"equals": payload["knowledge_type"]}
            })

        body = {"page_size": payload.get("page_size", 20)}
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()

    # ==============================
    # ASSET / DOCUMENT ACTIONS
    # ==============================

    def _save_asset(self, payload):
        db = _db_id("NOTION_ASSET_DB")
        if not db:
            return {"error": "NOTION_ASSET_DB not configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("asset"):
            body["properties"]["Asset"] = {
                "title": [{"text": {"content": payload["asset"]}}]
            }
        if payload.get("content"):
            body["properties"]["Content"] = {
                "rich_text": [{"text": {"content": payload["content"][:2000]}}]
            }
        if payload.get("type"):
            body["properties"]["Type"] = {
                "select": {"name": payload["type"]}
            }
        if payload.get("tags"):
            body["properties"]["Tags"] = {
                "multi_select": [{"name": t} for t in payload["tags"]]
            }
        if payload.get("version"):
            body["properties"]["Version"] = {
                "rich_text": [{"text": {"content": payload["version"]}}]
            }
        if payload.get("storage"):
            body["properties"]["Storage"] = {
                "multi_select": [{"name": s} for s in payload["storage"]]
            }
        body["properties"]["Status"] = {
            "select": {"name": payload.get("status", "Active")}
        }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _search_assets(self, payload):
        db = _db_id("NOTION_ASSET_DB")
        if not db:
            return {"error": "NOTION_ASSET_DB not configured"}

        filters = []
        if payload.get("query"):
            filters.append({
                "property": "Asset",
                "title": {"contains": payload["query"]}
            })
        if payload.get("type"):
            filters.append({
                "property": "Type",
                "select": {"equals": payload["type"]}
            })
        if payload.get("tags"):
            filters.append({
                "property": "Tags",
                "multi_select": {"contains": payload["tags"][0]}
            })

        body = {"page_size": payload.get("page_size", 20)}
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()

    # ==============================
    # CHANGE LOG / AUDIT ACTIONS
    # ==============================

    def _append_changelog(self, payload):
        db = _db_id("NOTION_CHANGE_LOG_DB")
        if not db:
            return {"error": "NOTION_CHANGE_LOG_DB not configured"}

        body = {
            "parent": {"database_id": db},
            "properties": {}
        }

        if payload.get("action"):
            body["properties"]["Action"] = {
                "title": [{"text": {"content": payload["action"]}}]
            }
        if payload.get("connector"):
            body["properties"]["Connector"] = {
                "select": {"name": payload["connector"]}
            }
        if payload.get("risk_level"):
            body["properties"]["Risk Level"] = {
                "select": {"name": payload["risk_level"]}
            }
        if payload.get("status"):
            body["properties"]["Status"] = {
                "select": {"name": payload["status"]}
            }
        if payload.get("actor"):
            body["properties"]["Actor"] = {
                "rich_text": [{"text": {"content": payload["actor"]}}]
            }
        if payload.get("payload_summary"):
            body["properties"]["Payload Summary"] = {
                "rich_text": [{"text": {"content": payload["payload_summary"][:2000]}}]
            }
        if payload.get("result"):
            body["properties"]["Result"] = {
                "rich_text": [{"text": {"content": payload["result"][:2000]}}]
            }
        body["properties"]["Timestamp"] = {
            "date": {"start": datetime.utcnow().isoformat()}
        }
        if payload.get("details"):
            body["properties"]["Details"] = {
                "rich_text": [{"text": {"content": payload["details"][:2000]}}]
            }

        r = requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
        return r.json()

    def _query_changelog(self, payload):
        db = _db_id("NOTION_CHANGE_LOG_DB")
        if not db:
            return {"error": "NOTION_CHANGE_LOG_DB not configured"}

        filters = []
        if payload.get("connector"):
            filters.append({
                "property": "Connector",
                "select": {"equals": payload["connector"]}
            })
        if payload.get("status"):
            filters.append({
                "property": "Status",
                "select": {"equals": payload["status"]}
            })
        if payload.get("action"):
            filters.append({
                "property": "Action",
                "title": {"contains": payload["action"]}
            })

        body = {
            "page_size": payload.get("page_size", 20),
            "sorts": [{"property": "Timestamp", "direction": "descending"}]
        }
        if filters:
            body["filter"] = {"and": filters} if len(filters) > 1 else filters[0]

        r = requests.post(f'{NOTION_API}/databases/{db}/query', headers=_headers(), json=body)
        return r.json()
