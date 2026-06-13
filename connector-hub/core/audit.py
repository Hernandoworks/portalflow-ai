import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

NOTION_API = 'https://api.notion.com/v1'
AUDIT_ENABLED = os.getenv("NOTION_CHANGE_LOG_DB") is not None


def _headers():
    return {
        'Authorization': f"Bearer {os.getenv('NOTION_TOKEN')}",
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    }


def _db_id(key):
    return os.getenv(key, '').replace('-', '')


def log_action(request, result):
    db = _db_id("NOTION_CHANGE_LOG_DB")
    if not db:
        print(json.dumps({
            "time": str(datetime.now()),
            "request": request,
            "result": str(result)
        }))
        return

    connector = request.get("connector", "system")
    action = request.get("action", "unknown")
    status = "success"
    if isinstance(result, dict) and result.get("error"):
        status = "error"

    payload_summary = json.dumps(request.get("payload", {}))
    if len(payload_summary) > 2000:
        payload_summary = payload_summary[:1997] + "..."

    result_str = json.dumps(result) if isinstance(result, dict) else str(result)
    if len(result_str) > 2000:
        result_str = result_str[:1997] + "..."

    body = {
        "parent": {"database_id": db},
        "properties": {
            "Action": {
                "title": [{"text": {"content": f"{connector}.{action}"}}]
            },
            "Connector": {
                "select": {"name": connector}
            },
            "Status": {
                "select": {"name": status}
            },
            "Actor": {
                "rich_text": [{"text": {"content": request.get("actor", "system")}}]
            },
            "Payload Summary": {
                "rich_text": [{"text": {"content": payload_summary}}]
            },
            "Result": {
                "rich_text": [{"text": {"content": result_str}}]
            },
            "Timestamp": {
                "date": {"start": datetime.utcnow().isoformat()}
            }
        }
    }

    try:
        requests.post(f'{NOTION_API}/pages', headers=_headers(), json=body)
    except Exception as e:
        print(f"Audit log error: {e}")
