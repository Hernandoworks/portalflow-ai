import os
import io
import json
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload


SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/script.deployments',
]


def _creds():
    refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')
    if not refresh_token:
        return None
    creds = Credentials(
        None,
        refresh_token=refresh_token,
        token_uri='https://oauth2.googleapis.com/token',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        scopes=SCOPES,
    )
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return creds


def execute(action, payload):
    creds = _creds()
    if not creds:
        return {'error': 'Google OAuth not configured'}

    if action == 'file_list':
        drive = build('drive', 'v3', credentials=creds)
        return drive.files().list(
            pageSize=payload.get('page_size', 20),
            q=f"'{payload[\"folder_id\"]}' in parents" if payload.get('folder_id') else None,
            fields="files(id, name, mimeType, size, webViewLink)"
        ).execute()

    if action == 'file_upload':
        drive = build('drive', 'v3', credentials=creds)
        body = {'name': payload.get('name', 'untitled')}
        if payload.get('folder_id'):
            body['parents'] = [payload['folder_id']]
        content = payload.get('content', '').encode('utf-8')
        media = MediaIoBaseUpload(io.BytesIO(content), mimetype=payload.get('mime_type', 'text/plain'))
        return drive.files().create(body=body, media_body=media, fields="id,name,mimeType,webViewLink").execute()

    if action == 'sheet_create':
        sheets = build('sheets', 'v4', credentials=creds)
        return sheets.spreadsheets().create(body={
            'properties': {'title': payload.get('title', 'Untitled')}
        }).execute()

    if action == 'sheet_read':
        sheets = build('sheets', 'v4', credentials=creds)
        return sheets.spreadsheets().values().get(
            spreadsheetId=payload['spreadsheet_id'],
            range=payload.get('range', 'A1:Z1000')
        ).execute()

    if action == 'doc_create':
        docs = build('docs', 'v1', credentials=creds)
        doc = docs.documents().create(body={'title': payload.get('title', 'Untitled')}).execute()
        if payload.get('body'):
            docs.documents().batchUpdate(
                documentId=doc['documentId'],
                body={'requests': [{'insertText': {'location': {'index': 1}, 'text': payload['body']}}]}
            ).execute()
        return doc

    if action == 'script_run':
        script = build('script', 'v1', credentials=creds)
        return script.scripts().run(
            scriptId=payload['script_id'],
            body={'function': payload.get('function', 'myFunction'), 'parameters': payload.get('parameters', [])}
        ).execute()

    return {'error': f'unknown drive action: {action}'}
