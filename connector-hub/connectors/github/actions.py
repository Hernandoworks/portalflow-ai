import os
import requests

BASE='https://api.github.com'


def headers():
    return {
        'Authorization': f"Bearer {os.getenv('GITHUB_TOKEN')}",
        'Accept':'application/vnd.github+json'
    }


def execute(action,payload):

    if action == 'create_issue':
        repo = payload['repo']
        return requests.post(
            f'{BASE}/repos/{repo}/issues',
            headers=headers(),
            json={
              'title':payload['title'],
              'body':payload.get('body','')
            }
        ).json()

    return {'error':'unknown github action'}
