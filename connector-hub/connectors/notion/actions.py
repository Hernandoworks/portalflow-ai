import os
import requests

NOTION_API = 'https://api.notion.com/v1'


def headers():
    return {
        'Authorization': f"Bearer {os.getenv('NOTION_TOKEN')}",
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    }


def execute(action, payload):
    if action == 'search_page':
        return requests.post(
            f'{NOTION_API}/search',
            headers=headers(),
            json={'query': payload.get('query')}
        ).json()

    if action == 'create_page':
        return requests.post(
            f'{NOTION_API}/pages',
            headers=headers(),
            json=payload
        ).json()

    if action == 'query_database':
        return requests.post(
            f'{NOTION_API}/databases/{payload.get("database_id")}/query',
            headers=headers(),
            json=payload.get("filter", {})
        ).json()

    return {'error': 'unknown notion action'}
