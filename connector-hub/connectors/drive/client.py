import os
import io
import json
import base64
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload, MediaFileUpload


SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/script.deployments',
]


def _get_credentials():
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
    refresh_token = os.getenv('GOOGLE_REFRESH_TOKEN')

    if not refresh_token:
        return None

    creds = Credentials(
        None,
        refresh_token=refresh_token,
        token_uri='https://oauth2.googleapis.com/token',
        client_id=client_id,
        client_secret=client_secret,
        scopes=SCOPES,
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())

    return creds


def _get_service(name, version):
    creds = _get_credentials()
    if not creds:
        return None
    return build(name, version, credentials=creds)


class DriveConnector:

    def commands(self):
        return {

            # --- Drive File Actions ---
            "file.list": {
                "risk": "safe",
                "description": "List files and folders in Google Drive"
            },
            "file.upload": {
                "risk": "write",
                "description": "Upload content to Google Drive as a new file"
            },
            "file.download": {
                "risk": "safe",
                "description": "Download file content from Google Drive by ID"
            },
            "file.search": {
                "risk": "safe",
                "description": "Search Google Drive files by name or mime type"
            },
            "file.delete": {
                "risk": "write",
                "description": "Delete a file from Google Drive"
            },

            # --- Sheets Actions ---
            "sheet.create": {
                "risk": "write",
                "description": "Create a new Google Sheet with optional initial data"
            },
            "sheet.read": {
                "risk": "safe",
                "description": "Read values from a Google Sheet range"
            },
            "sheet.append": {
                "risk": "write",
                "description": "Append a row of data to a Google Sheet"
            },
            "sheet.update": {
                "risk": "write",
                "description": "Update a cell or range in a Google Sheet"
            },

            # --- Docs Actions ---
            "doc.create": {
                "risk": "write",
                "description": "Create a new Google Doc with optional body text"
            },
            "doc.read": {
                "risk": "safe",
                "description": "Read the body content of a Google Doc"
            },
            "doc.append": {
                "risk": "write",
                "description": "Append text to an existing Google Doc"
            },

            # --- Apps Script Actions ---
            "script.run": {
                "risk": "write",
                "description": "Run a function in an Apps Script project"
            },
            "script.create": {
                "risk": "write",
                "description": "Create an Apps Script project with code"
            },

        }

    async def run(self, action, payload):

        creds = _get_credentials()
        if not creds:
            return {"error": "Google OAuth not configured. Set GOOGLE_REFRESH_TOKEN in .env"}

        if action == "file.list":
            return self._file_list(payload)
        if action == "file.upload":
            return self._file_upload(payload)
        if action == "file.download":
            return self._file_download(payload)
        if action == "file.search":
            return self._file_search(payload)
        if action == "file.delete":
            return self._file_delete(payload)

        if action == "sheet.create":
            return self._sheet_create(payload)
        if action == "sheet.read":
            return self._sheet_read(payload)
        if action == "sheet.append":
            return self._sheet_append(payload)
        if action == "sheet.update":
            return self._sheet_update(payload)

        if action == "doc.create":
            return self._doc_create(payload)
        if action == "doc.read":
            return self._doc_read(payload)
        if action == "doc.append":
            return self._doc_append(payload)

        if action == "script.run":
            return self._script_run(payload)
        if action == "script.create":
            return self._script_create(payload)

        return {"error": f"Unknown Drive action: {action}"}

    # ==============================
    # DRIVE FILE ACTIONS
    # ==============================

    def _file_list(self, payload):
        service = _get_service('drive', 'v3')
        if not service:
            return {"error": "Drive API not available"}

        page_size = payload.get("page_size", 20)
        folder_id = payload.get("folder_id")

        q = f"'{folder_id}' in parents" if folder_id else None

        results = service.files().list(
            q=q,
            pageSize=page_size,
            fields="files(id, name, mimeType, size, webViewLink, createdTime, modifiedTime)"
        ).execute()

        return results

    def _file_upload(self, payload):
        service = _get_service('drive', 'v3')
        if not service:
            return {"error": "Drive API not available"}

        name = payload.get("name", "untitled")
        content = payload.get("content", "")
        mime_type = payload.get("mime_type", "text/plain")
        folder_id = payload.get("folder_id")

        body = {"name": name}
        if folder_id:
            body["parents"] = [folder_id]

        media = MediaIoBaseUpload(
            io.BytesIO(content.encode('utf-8') if isinstance(content, str) else content),
            mimetype=mime_type,
            resumable=True
        )

        file = service.files().create(
            body=body,
            media_body=media,
            fields="id, name, mimeType, size, webViewLink"
        ).execute()

        return file

    def _file_download(self, payload):
        service = _get_service('drive', 'v3')
        if not service:
            return {"error": "Drive API not available"}

        file_id = payload.get("file_id")
        if not file_id:
            return {"error": "file_id is required"}

        meta = service.files().get(fileId=file_id, fields="id, name, mimeType").execute()
        content = service.files().get_media(fileId=file_id).execute()

        return {
            "id": meta["id"],
            "name": meta["name"],
            "mimeType": meta["mimeType"],
            "content": content.decode('utf-8', errors='replace')[:50000],
            "sizeBytes": len(content),
        }

    def _file_search(self, payload):
        service = _get_service('drive', 'v3')
        if not service:
            return {"error": "Drive API not available"}

        query = payload.get("query", "")
        mime_type = payload.get("mime_type")
        page_size = payload.get("page_size", 20)

        q_parts = []
        if query:
            q_parts.append(f"name contains '{query}'")
        if mime_type:
            q_parts.append(f"mimeType='{mime_type}'")

        q = " and ".join(q_parts) if q_parts else None

        results = service.files().list(
            q=q,
            pageSize=page_size,
            fields="files(id, name, mimeType, size, webViewLink, createdTime)"
        ).execute()

        return results

    def _file_delete(self, payload):
        service = _get_service('drive', 'v3')
        if not service:
            return {"error": "Drive API not available"}

        file_id = payload.get("file_id")
        if not file_id:
            return {"error": "file_id is required"}

        meta = service.files().get(fileId=file_id, fields="id, name").execute()
        service.files().delete(fileId=file_id).execute()

        return {"status": "deleted", "id": meta["id"], "name": meta["name"]}

    # ==============================
    # SHEETS ACTIONS
    # ==============================

    def _sheet_create(self, payload):
        service = _get_service('sheets', 'v4')
        if not service:
            return {"error": "Sheets API not available"}

        title = payload.get("title", "Untitled Spreadsheet")
        headers = payload.get("headers", [])
        rows = payload.get("rows", [])

        spreadsheet = service.spreadsheets().create(
            body={"properties": {"title": title}}
        ).execute()

        spreadsheet_id = spreadsheet["spreadsheetId"]

        if headers:
            values = [headers] + (rows if rows else [])
            service.spreadsheets().values().update(
                spreadsheetId=spreadsheet_id,
                range="A1",
                valueInputOption="RAW",
                body={"values": values}
            ).execute()

        return {
            "spreadsheetId": spreadsheet_id,
            "spreadsheetUrl": spreadsheet["spreadsheetUrl"],
            "title": title,
        }

    def _sheet_read(self, payload):
        service = _get_service('sheets', 'v4')
        if not service:
            return {"error": "Sheets API not available"}

        spreadsheet_id = payload.get("spreadsheet_id")
        range_ = payload.get("range", "A1:Z1000")

        if not spreadsheet_id:
            return {"error": "spreadsheet_id is required"}

        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=range_
        ).execute()

        return result

    def _sheet_append(self, payload):
        service = _get_service('sheets', 'v4')
        if not service:
            return {"error": "Sheets API not available"}

        spreadsheet_id = payload.get("spreadsheet_id")
        values = payload.get("values", [])
        range_ = payload.get("range", "A1")

        if not spreadsheet_id:
            return {"error": "spreadsheet_id is required"}
        if not values:
            return {"error": "values are required"}

        result = service.spreadsheets().values().append(
            spreadsheetId=spreadsheet_id,
            range=range_,
            valueInputOption="RAW",
            insertDataOption="INSERT_ROWS",
            body={"values": [values]}
        ).execute()

        return {
            "updates": result.get("updates", {}),
            "appendedRow": values,
        }

    def _sheet_update(self, payload):
        service = _get_service('sheets', 'v4')
        if not service:
            return {"error": "Sheets API not available"}

        spreadsheet_id = payload.get("spreadsheet_id")
        range_ = payload.get("range", "A1")
        values = payload.get("values", [])

        if not spreadsheet_id:
            return {"error": "spreadsheet_id is required"}

        result = service.spreadsheets().values().update(
            spreadsheetId=spreadsheet_id,
            range=range_,
            valueInputOption="RAW",
            body={"values": [values] if isinstance(values, list) and not isinstance(values[0], list) else values}
        ).execute()

        return {
            "updatedCells": result.get("updatedCells"),
            "updatedRange": result.get("updatedRange"),
        }

    # ==============================
    # DOCS ACTIONS
    # ==============================

    def _doc_create(self, payload):
        service = _get_service('docs', 'v1')
        if not service:
            return {"error": "Docs API not available"}

        title = payload.get("title", "Untitled Document")
        body_text = payload.get("body", "")

        doc = service.documents().create(
            body={"title": title}
        ).execute()

        doc_id = doc["documentId"]

        if body_text:
            requests = [{
                "insertText": {
                    "location": {"index": 1},
                    "text": body_text
                }
            }]
            service.documents().batchUpdate(
                documentId=doc_id,
                body={"requests": requests}
            ).execute()

        return {
            "documentId": doc_id,
            "documentUrl": f"https://docs.google.com/document/d/{doc_id}/edit",
            "title": title,
        }

    def _doc_read(self, payload):
        service = _get_service('docs', 'v1')
        if not service:
            return {"error": "Docs API not available"}

        doc_id = payload.get("document_id")
        if not doc_id:
            return {"error": "document_id is required"}

        doc = service.documents().get(documentId=doc_id).execute()

        content = ""
        if "body" in doc and "content" in doc["body"]:
            for elem in doc["body"]["content"]:
                if "paragraph" in elem:
                    for run in elem["paragraph"]["elements"]:
                        if "textRun" in run:
                            content += run["textRun"]["content"]

        return {
            "documentId": doc["documentId"],
            "title": doc.get("title", ""),
            "content": content,
        }

    def _doc_append(self, payload):
        service = _get_service('docs', 'v1')
        if not service:
            return {"error": "Docs API not available"}

        doc_id = payload.get("document_id")
        text = payload.get("text", "")

        if not doc_id:
            return {"error": "document_id is required"}
        if not text:
            return {"error": "text is required"}

        doc = service.documents().get(documentId=doc_id).execute()
        end_index = doc.get("body", {}).get("content", [{}])[-1].get("endIndex", 1)

        requests = [{
            "insertText": {
                "location": {"index": end_index - 1},
                "text": "\n" + text
            }
        }]

        service.documents().batchUpdate(
            documentId=doc_id,
            body={"requests": requests}
        ).execute()

        return {"status": "appended", "documentId": doc_id, "appendedText": text[:100]}

    # ==============================
    # APPS SCRIPT ACTIONS
    # ==============================

    def _script_run(self, payload):
        service = _get_service('script', 'v1')
        if not service:
            return {"error": "Apps Script API not available"}

        script_id = payload.get("script_id")
        function_name = payload.get("function", "myFunction")
        parameters = payload.get("parameters", [])

        if not script_id:
            return {"error": "script_id is required"}

        request = {
            "function": function_name,
            "parameters": parameters,
            "devMode": payload.get("dev_mode", False),
        }

        try:
            response = service.scripts().run(
                scriptId=script_id,
                body=request
            ).execute()

            if "error" in response:
                return {"error": response["error"]}

            return {"result": response.get("response", {}).get("result")}

        except Exception as e:
            return {"error": str(e)}

    def _script_create(self, payload):
        service = _get_service('script', 'v1')
        if not service:
            return {"error": "Apps Script API not available"}

        title = payload.get("title", "PortalFlow Script")
        code = payload.get("code", "function myFunction() {\n  return 'Hello from PortalFlow!';\n}")
        file_name = payload.get("file_name", "Code.gs")

        manifest = {
            "timeZone": payload.get("timezone", "America/New_York"),
            "dependencies": {},
            "exceptionLogging": "STACKDRIVER",
            "runtimeVersion": "V8",
        }

        files = [
            {
                "name": file_name,
                "type": "SERVER_JS",
                "source": code,
            },
            {
                "name": "appsscript",
                "type": "JSON",
                "source": json.dumps(manifest),
            },
        ]

        try:
            project = service.projects().create(
                body={"title": title}
            ).execute()

            script_id = project["scriptId"]

            service.projects().updateContent(
                scriptId=script_id,
                body={"files": files}
            ).execute()

            return {
                "scriptId": script_id,
                "title": title,
                "url": f"https://script.google.com/d/{script_id}/edit",
            }

        except Exception as e:
            return {"error": str(e)}
